import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';
import https from 'https';
import { prisma } from './src/lib/prisma.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ─── Fail fast on missing critical env vars in production ────────────────────
if (process.env.NODE_ENV === 'production') {
  const required = ['JWT_SECRET', 'DATABASE_URL', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`FATAL: Missing required environment variable: ${key}`);
    }
  }
}

// ─── JWT Setup ───────────────────────────────────────────────────────────────
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: JWT_SECRET environment variable is not set');
}
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-only-insecure-secret-do-not-use-in-production'
);

// ─── Cloudinary ──────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Multer ──────────────────────────────────────────────────────────────────
const upload = multer({ storage: multer.memoryStorage() });

// ─── Body Parsers ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Cookie Parser (zero-dependency) ────────────────────────────────────────
app.use((req: Request, _res: Response, next: NextFunction) => {
  const cookieHeader = req.headers.cookie || '';
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      cookies[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
  (req as any).cookies = cookies;
  next();
});

// ─── Auth Types ──────────────────────────────────────────────────────────────
interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

// ─── JWT Helpers ─────────────────────────────────────────────────────────────
async function generateToken(payload: { id: string; email: string; role: string }) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

// ─── Auth Middlewares ────────────────────────────────────────────────────────
async function isAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = (req as any).cookies?.token;
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const payload = await verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
  req.user = payload;
  next();
}

async function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const token = (req as any).cookies?.token;
  if (!token) {
    res.status(401).json({ error: 'Admin authentication required' });
    return;
  }
  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden: Admin privilege required' });
    return;
  }
  req.user = payload;
  next();
}

// ─── Cookie Helper ───────────────────────────────────────────────────────────
function setAuthCookie(res: Response, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// ─── Email Transporter ───────────────────────────────────────────────────────
function createTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  if (!emailUser || !emailPass) return null;
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: emailUser, pass: emailPass },
  });
}

async function sendOtpEmail(email: string, otpCode: string, type: 'VERIFY_EMAIL' | 'RESET_PASSWORD') {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[EMAIL] EMAIL_USER / EMAIL_PASS not set — skipping email send');
    return;
  }
  const subject =
    type === 'RESET_PASSWORD'
      ? '[Royal Gems] Reset Your Password'
      : '[Royal Gems] Verify Your Email Address';
  const html = `
    <div style="font-family:'Jost',sans-serif;background:#fff8f6;padding:40px;color:#221a16;max-width:480px;margin:auto;">
      <h2 style="color:#69001b;font-family:'Cormorant SC',serif;letter-spacing:0.08em;">ROYAL GEMS</h2>
      <p style="font-size:16px;margin-bottom:24px;">
        ${type === 'RESET_PASSWORD' ? 'Use the code below to reset your password.' : 'Use the code below to verify your email and create your account.'}
      </p>
      <div style="font-size:32px;font-weight:700;letter-spacing:0.15em;color:#7e5700;background:#f5efe3;padding:20px 32px;display:inline-block;border:1px solid rgba(139,90,43,0.3);">
        ${otpCode}
      </div>
      <p style="font-size:13px;color:#7A6A5A;margin-top:24px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      <hr style="border:none;border-top:1px solid rgba(139,90,43,0.15);margin:32px 0;" />
      <p style="font-size:11px;color:#7A6A5A;">Royal Gems · Jaipur, Rajasthan, India</p>
    </div>`;
  await transporter.sendMail({
    from: `"Royal Gems Concierge" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    text: `Your Royal Gems verification code is: ${otpCode}. It expires in 10 minutes.`,
    html,
  });
}

// ─── Paytm Helper ────────────────────────────────────────────────────────────
// Install:
// npm install paytmchecksum
// npm install -D @types/paytmchecksum
async function initiatePaytmTransaction(
  orderId: string,
  amount: number,
  customerId: string,
  customerEmail: string
): Promise<{ txnToken: string; mid: string; orderId: string; amount: string }> {
  const PaytmChecksum = require('paytmchecksum');

  const mid = process.env.PAYTM_MID!;
  const merchantKey = process.env.PAYTM_MERCHANT_KEY!;
  const isStaging = (process.env.PAYTM_ENV || 'staging') !== 'production';
  const txnAmount = amount.toFixed(2);

  const paytmBody = {
    requestType: 'Payment',
    mid,
    websiteName: process.env.PAYTM_WEBSITE || 'WEBSTAGING',
    orderId,
    callbackUrl: process.env.PAYTM_CALLBACK_URL || `${process.env.APP_URL}/api/orders/verify`,
    txnAmount: { value: txnAmount, currency: 'INR' },
    userInfo: { custId: customerId, email: customerEmail },
  };

  const checksum = await PaytmChecksum.generateSignature(
    JSON.stringify(paytmBody),
    merchantKey
  );

  const endpoint = isStaging
    ? 'securegw-stage.paytm.in'
    : 'securegw.paytm.in';

  const options = {
    hostname: endpoint,
    path: `/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-checksum': checksum,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, paytmRes => {
      let data = '';
      paytmRes.on('data', chunk => (data += chunk));
      paytmRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed?.body?.txnToken) {
            resolve({ txnToken: parsed.body.txnToken, mid, orderId, amount: txnAmount });
          } else {
            reject(new Error(`Paytm initiation failed: ${JSON.stringify(parsed?.body)}`));
          }
        } catch {
          reject(new Error('Failed to parse Paytm response'));
        }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify(paytmBody));
    req.end();
  });
}

async function verifyPaytmChecksum(body: Record<string, string>, receivedChecksum: string): Promise<boolean> {
  const PaytmChecksum = require('paytmchecksum');
  const merchantKey = process.env.PAYTM_MERCHANT_KEY!;
  const bodyWithoutChecksum = { ...body };
  delete bodyWithoutChecksum['CHECKSUMHASH'];

  return await PaytmChecksum.verifySignature(
    JSON.stringify(bodyWithoutChecksum),
    merchantKey,
    receivedChecksum
  );
}

// ─── Cloudinary Delete Helper ────────────────────────────────────────────────
async function deleteCloudinaryImages(imageUrls: string[]) {
  for (const url of imageUrls) {
    try {
      const match = url.match(/\/royalgems\/([^/.]+)(?:\.[a-z]+)?$/i);
      if (match) {
        await cloudinary.uploader.destroy(`royalgems/${match[1]}`);
      }
    } catch (e) {
      console.warn(`[Cloudinary] Failed to delete image ${url}:`, e);
    }
  }
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

// POST /api/auth/login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (email === adminEmail) {
      if (!adminPasswordHash) {
        res.status(500).json({ error: 'Server misconfiguration: Admin credentials not set' });
        return;
      }

      const isMatch = await bcrypt.compare(password, adminPasswordHash);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid administrator credentials' });
        return;
      }

      const token = await generateToken({
        id: 'admin-id',
        email: adminEmail,
        role: 'ADMIN'
      });

      setAuthCookie(res, token);

      res.json({
        user: { id: 'admin-id', email: adminEmail, role: 'ADMIN' }
      });
      return;
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found. Please register first.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    setAuthCookie(res, token);

    res.json({
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// POST /api/auth/send-otp
app.post('/api/auth/send-otp', async (req: Request, res: Response) => {
  const { email, type } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const otpType: 'VERIFY_EMAIL' | 'RESET_PASSWORD' =
    type === 'RESET_PASSWORD' ? 'RESET_PASSWORD' : 'VERIFY_EMAIL';

  if (otpType === 'VERIFY_EMAIL') {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email is already registered' });
      return;
    }
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    await prisma.otpCode.create({
      data: { email, code: otpCode, type: otpType, expiresAt }
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[OTP DEV LOG] ${otpType} | ${email} | Code: ${otpCode}`);
    }

    try {
      await sendOtpEmail(email, otpCode, otpType);
    } catch (error) {
      console.error('[EMAIL] Failed to send OTP email:', error);
    }

    res.json({
      message: 'Verification code sent to your email',
      ...(process.env.NODE_ENV !== 'production' && { otp: otpCode })
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create OTP. Please try again.' });
  }
});

// POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', async (req: Request, res: Response) => {
  const { email, code, password } = req.body;
  if (!email || !code || !password) {
    res.status(400).json({ error: 'Email, OTP code, and password are required' });
    return;
  }

  try {
    const dbOtp = await prisma.otpCode.findFirst({
      where: { email, code, type: 'VERIFY_EMAIL', used: false },
      orderBy: { createdAt: 'desc' }
    });

    if (!dbOtp) {
      res.status(400).json({ error: 'Invalid or expired OTP code' });
      return;
    }

    if (dbOtp.expiresAt < new Date()) {
      res.status(400).json({ error: 'Verification code has expired. Request a new one.' });
      return;
    }

    await prisma.otpCode.update({
      where: { id: dbOtp.id },
      data: { used: true }
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER'
      }
    });

    const token = await generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    setAuthCookie(res, token);

    res.json({
      message: 'Account created successfully',
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      res.json({ message: 'If this email is registered, a reset code has been sent.' });
      return;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({
      data: { email, code: otpCode, type: 'RESET_PASSWORD', expiresAt }
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[OTP DEV LOG] RESET_PASSWORD | ${email} | Code: ${otpCode}`);
    }

    try {
      await sendOtpEmail(email, otpCode, 'RESET_PASSWORD');
    } catch (error) {
      console.error('[EMAIL] Failed to send reset OTP email:', error);
    }

    res.json({
      message: 'If this email is registered, a reset code has been sent.',
      ...(process.env.NODE_ENV !== 'production' && { otp: otpCode })
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
  const { email, code, password } = req.body;
  if (!email || !code || !password) {
    res.status(400).json({ error: 'Email, OTP code, and new password are required' });
    return;
  }

  try {
    const dbOtp = await prisma.otpCode.findFirst({
      where: { email, code, type: 'RESET_PASSWORD', used: false },
      orderBy: { createdAt: 'desc' }
    });

    if (!dbOtp) {
      res.status(400).json({ error: 'Invalid or expired OTP code' });
      return;
    }

    if (dbOtp.expiresAt < new Date()) {
      res.status(400).json({ error: 'Reset code has expired. Request a new one.' });
      return;
    }

    await prisma.otpCode.update({
      where: { id: dbOtp.id },
      data: { used: true }
    });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password has been updated successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', async (req: Request, res: Response) => {
  const token = (req as any).cookies?.token;
  if (!token) {
    res.json({ user: null });
    return;
  }
  const payload = await verifyToken(token);
  res.json({ user: payload ?? null });
});

// ─── USER PROFILE / ADDRESSES ────────────────────────────────────────────────

// GET /api/user/profile
app.get('/api/user/profile', isAuth, async (req: AuthRequest, res: Response) => {
  if (req.user!.role === 'ADMIN') {
    res.json({ user: { id: 'admin-id', email: req.user!.email, role: 'ADMIN', name: 'Admin' } });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true }
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PATCH /api/user/profile
app.patch('/api/user/profile', isAuth, async (req: AuthRequest, res: Response) => {
  if (req.user!.role === 'ADMIN') {
    res.status(403).json({ error: 'Admin profile cannot be modified' });
    return;
  }

  const { name, phone } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, phone },
      select: { id: true, email: true, name: true, phone: true, role: true }
    });
    res.json({ user: updated });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PATCH /api/user/change-password
app.patch('/api/user/change-password', isAuth, async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(400).json({ error: 'Both old and new passwords are required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Incorrect current password' });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashed }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/user/addresses
app.get('/api/user/addresses', isAuth, async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await prisma.address.findMany({ where: { userId: req.user!.id } });
    res.json({ addresses });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/user/addresses
app.post('/api/user/addresses', isAuth, async (req: AuthRequest, res: Response) => {
  const { title, fullName, phone, line1, line2, city, state, pinCode, country } = req.body;

  try {
    const address = await prisma.address.create({
      data: {
        userId: req.user!.id,
        title: title || 'Home',
        fullName,
        phone,
        line1,
        line2: line2 || '',
        city,
        state,
        pinCode,
        country: country || 'India'
      }
    });
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PATCH /api/user/addresses/:id
app.patch('/api/user/addresses/:id', isAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, fullName, phone, line1, line2, city, state, pinCode, country } = req.body;

  try {
    const existing = await prisma.address.findFirst({ where: { id, userId: req.user!.id } });
    if (!existing) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }

    const address = await prisma.address.update({
      where: { id },
      data: { title, fullName, phone, line1, line2, city, state, pinCode, country }
    });
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/user/addresses/:id
app.delete('/api/user/addresses/:id', isAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const existing = await prisma.address.findFirst({ where: { id, userId: req.user!.id } });
    if (!existing) {
      res.status(404).json({ error: 'Address not found or unauthorized' });
      return;
    }

    await prisma.address.delete({ where: { id } });
    res.json({ success: true, message: 'Address removed successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

// GET /api/products
app.get('/api/products', async (req: Request, res: Response) => {
  const { category, stoneType, stoneColor, search, sort, featured } = req.query;

  try {
    const filter: any = {};
    if (category) filter.category = String(category);
    if (stoneType) filter.stoneType = String(stoneType);
    if (stoneColor) filter.stoneColor = String(stoneColor);
    if (featured === 'true') filter.featured = true;

    if (search) {
      filter.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'name_asc') orderBy = { name: 'asc' };

    const products = await prisma.product.findMany({ where: filter, orderBy });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/products
app.post('/api/products', isAdmin, async (req: Request, res: Response) => {
  const {
    name, description, price, images, category, stoneType, stoneColor,
    featured, caratWeight, dimensions, clarity, treatments, origin
  } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        images: Array.isArray(images) ? images : [images],
        category,
        stoneType,
        stoneColor,
        featured: featured === true || featured === 'true',
        caratWeight: Number(caratWeight || 1.0),
        dimensions,
        clarity,
        treatments,
        origin
      }
    });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PATCH /api/products/:id
app.patch('/api/products/:id', isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.price !== undefined) updates.price = Number(updates.price);
  if (updates.caratWeight !== undefined) updates.caratWeight = Number(updates.caratWeight);
  if (updates.featured !== undefined) updates.featured = updates.featured === true || updates.featured === 'true';

  try {
    if (updates.images) {
      const existing = await prisma.product.findUnique({ where: { id } });
      if (existing?.images?.length) {
        await deleteCloudinaryImages(existing.images);
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updates
    });

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/products/:id
app.delete('/api/products/:id', isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (existing?.images?.length) {
      await deleteCloudinaryImages(existing.images);
    }

    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/upload
app.post('/api/upload', isAdmin, upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  try {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'royalgems' },
        (error, result) => (result ? resolve(result) : reject(error))
      );
      stream.end(req.file!.buffer);
    });

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ─── ORDERS & PAYTM ──────────────────────────────────────────────────────────

// POST /api/orders/create
app.post('/api/orders/create', isAuth, async (req: AuthRequest, res: Response) => {
  const { items, addressId, totalAmount } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Cart items are required' });
    return;
  }

  if (!process.env.PAYTM_MID || !process.env.PAYTM_MERCHANT_KEY) {
    res.status(500).json({ error: 'Payment gateway not configured' });
    return;
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        amount: Number(totalAmount),
        status: 'PENDING',
        isPaid: false,
        addressId: addressId || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || item.id,
            quantity: Number(item.quantity || 1),
            price: Number(item.price)
          }))
        }
      }
    });

    const paytmData = await initiatePaytmTransaction(
      order.id,
      Number(totalAmount),
      req.user!.id,
      req.user!.email
    );

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: 'INR',
      paytm: paytmData
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/orders/verify
app.post('/api/orders/verify', isAuth, async (req: AuthRequest, res: Response) => {
  const { ORDERID, TXNID, STATUS, CHECKSUMHASH, RESPCODE } = req.body;
  const orderId = ORDERID || req.body.orderId;

  if (!orderId) {
    res.status(400).json({ error: 'Order ID is required' });
    return;
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    if (CHECKSUMHASH && process.env.PAYTM_MERCHANT_KEY) {
      const isValid = await verifyPaytmChecksum(req.body, CHECKSUMHASH);
      if (!isValid) {
        res.status(400).json({ error: 'Payment verification failed: invalid checksum' });
        return;
      }
    }

    const txnSuccess =
      String(STATUS).toUpperCase() === 'TXN_SUCCESS' ||
      String(RESPCODE) === '01' ||
      req.body.isPaid === true;

    if (txnSuccess) {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          status: 'PROCESSING',
          paymentId: TXNID || `TXN-${Date.now()}`,
          paymentSignature: CHECKSUMHASH || ''
        }
      });
      res.json({ success: true, order: updatedOrder });
    } else {
      res.status(400).json({ error: 'Payment failed or was cancelled' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/orders/my
app.get('/api/orders/my', isAuth, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/orders/:id
app.get('/api/orders/:id', isAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, address: true }
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (req.user!.role !== 'ADMIN' && order.userId !== req.user!.id) {
      res.status(403).json({ error: 'Unauthorized to view this order' });
      return;
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/orders
app.get('/api/orders', isAdmin, async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PATCH /api/orders/:id/status
app.patch('/api/orders/:id/status', isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    return;
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ─── BOOTSTRAP ───────────────────────────────────────────────────────────────
async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Royal Gems] Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
}

bootstrap();