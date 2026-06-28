import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Lock, ShieldAlert, Award, Star, Loader2, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { login, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  // Once auth is confirmed, redirect to correct destination
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirect === '/login' ? '/' : redirect, { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, authLoading]);

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sign-in fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign-up flow
  const [signupEmail, setSignupEmail] = useState('');
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [signupPassword, setSignupPassword] = useState('');

  // Forgot password flow
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const loggedInUser = await login(loginEmail, loginPassword);
      // Redirect based on role returned from server
      if (loggedInUser.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirect === '/login' ? '/' : redirect, { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!signupEmail) { setErrorMsg('Please enter a valid email address.'); return; }
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, type: 'VERIFY_EMAIL' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch verification code');
      setSuccessMsg('A 6-digit verification code has been dispatched to your email.');
      setSignupStep(2);
      // Dev only: log OTP to console, never show in UI
      if (data.otp) console.log(`[DEV] OTP: ${data.otp}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP delivery failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const joinedCode = otpCode.join('');
    if (joinedCode.length < 6) { setErrorMsg('Please enter the complete 6-digit code.'); return; }
    if (!signupPassword) { setErrorMsg('Please set a password.'); return; }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, code: joinedCode, password: signupPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify account');
      setSuccessMsg('Account created successfully! Starting your session...');
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch password recovery');
      // Never expose the OTP code in the UI message
      setSuccessMsg('If this email is registered, a reset code has been sent to your inbox.');
      setIsForgotOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Forgot password request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) return;
    const nextCode = [...otpCode];
    nextCode[index] = val;
    setOtpCode(nextCode);
    if (val && index < 5) document.getElementById(`otp-input-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md relative">

          {/* Corner accents */}
          <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-secondary" />
          <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-secondary" />
          <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-secondary" />
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-secondary" />

          <div className="bg-surface border border-border-sepia/40 p-8 md:p-10 shadow-xl">

            {/* Branding */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl text-primary uppercase tracking-widest mb-1">Royal Gems</h1>
              <p className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase">
                Est. 1924 · Heritage Excellence
              </p>
            </div>

            {/* Feedback */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-error/10 border border-error/30 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-error flex-shrink-0" />
                <p className="font-body text-[13px] text-error">{errorMsg}</p>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-success-forest/10 border border-success-forest/30 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success-forest flex-shrink-0" />
                <p className="font-body text-[13px] text-success-forest">{successMsg}</p>
              </div>
            )}

            {isForgotOpen ? (
              /* Forgot Password */
              <form onSubmit={handleForgotSubmit} className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <button type="button" onClick={() => setIsForgotOpen(false)} className="text-primary p-1 hover:scale-95 transition-all">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <h2 className="font-display text-xl text-on-surface uppercase tracking-wider">Reset Password</h2>
                </div>
                <p className="font-body text-[13px] text-on-surface-variant leading-relaxed">
                  Enter your registered email and we will send a reset code to your inbox.
                </p>
                <div>
                  <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase mb-2">Email Address</label>
                  <input
                    type="email" required value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter registered email"
                    className="w-full bg-surface-bright border border-secondary/30 px-4 py-3 font-body text-[13px] focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <button
                  type="submit" disabled={isLoading}
                  className="w-full py-3 bg-primary text-white font-label-caps text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'SEND RESET CODE'}
                </button>
              </form>
            ) : (
              <>
                {/* Tab Switcher */}
                <div className="flex border-b border-border-sepia/40 mb-6">
                  {(['signin', 'signup'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setErrorMsg(''); setSuccessMsg(''); }}
                      className={`flex-1 py-3 font-label-caps text-[11px] uppercase tracking-widest transition-all ${activeTab === tab ? 'border-b-2 border-secondary text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                    >
                      {tab === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>
                  ))}
                </div>

                {activeTab === 'signin' ? (
                  /* Sign In Form */
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase mb-2">Email Address</label>
                      <input
                        type="email" required value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="name@heritage.com"
                        className="w-full bg-surface-bright border border-secondary/30 px-4 py-3 font-body text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">Password</label>
                        <button type="button" onClick={() => setIsForgotOpen(true)} className="font-body text-[11px] text-primary hover:underline">
                          Forgot Password?
                        </button>
                      </div>
                      <input
                        type="password" required value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-surface-bright border border-secondary/30 px-4 py-3 font-body text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                    <button
                      type="submit" disabled={isLoading}
                      className="w-full py-3.5 bg-primary text-white font-label-caps text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'SIGN IN'}
                    </button>
                  </form>
                ) : (
                  /* Sign Up Form */
                  <div>
                    {signupStep === 1 ? (
                      <div className="space-y-5">
                        <div>
                          <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase mb-2">Email Address</label>
                          <input
                            type="email" required value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="Enter your email to receive OTP"
                            className="w-full bg-surface-bright border border-secondary/30 px-4 py-3 font-body text-[13px] focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                        <button
                          type="button" onClick={handleSendOTP} disabled={isLoading}
                          className="w-full py-3.5 bg-primary text-white font-label-caps text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60"
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'SEND OTP CODE'}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleRegisterVerify} className="space-y-5">
                        <p className="font-body text-[13px] text-on-surface-variant">
                          A 6-digit code was sent to <strong className="text-on-surface">{signupEmail}</strong>.
                        </p>
                        {/* OTP Inputs */}
                        <div className="flex gap-2 justify-center">
                          {otpCode.map((digit, idx) => (
                            <input
                              key={idx}
                              id={`otp-input-${idx}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="w-10 h-12 text-center text-xl font-bold bg-white border border-secondary/30 focus:ring-1 focus:ring-primary outline-none"
                            />
                          ))}
                        </div>
                        <div>
                          <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase mb-2">Set Password</label>
                          <input
                            type="password" required value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className="w-full bg-surface-bright border border-secondary/30 px-4 py-3 font-body text-[13px] focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                        <button
                          type="submit" disabled={isLoading}
                          className="w-full py-3.5 bg-primary text-white font-label-caps text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60"
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'VERIFY & CREATE ACCOUNT'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSignupStep(1); setErrorMsg(''); setSuccessMsg(''); }}
                          className="w-full text-center font-body text-[12px] text-on-surface-variant hover:text-primary transition-colors"
                        >
                          ← Back to Step 1
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Trust marks */}
            <div className="mt-8 pt-6 border-t border-border-sepia/30 flex justify-center gap-6">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <Lock className="h-3 w-3" />
                <span className="font-label-caps text-[9px] tracking-wider uppercase">Secure SSL</span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <Award className="h-3 w-3" />
                <span className="font-label-caps text-[9px] tracking-wider uppercase">Lab Certified</span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <Star className="h-3 w-3" />
                <span className="font-label-caps text-[9px] tracking-wider uppercase">Insured Ship</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}