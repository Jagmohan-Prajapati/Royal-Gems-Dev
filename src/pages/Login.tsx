import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Lock, ShieldAlert, Award, Star, Loader2, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Navigation redirect path
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, redirect]);

  // Tab switcher
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forms Values
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Flow Values
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
      await login(loginEmail, loginPassword);
      navigate(redirect, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!signupEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, type: 'VERIFY_EMAIL' })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch verification code');
      }
      setSuccessMsg('A 6-digit verification code has been dispatched.');
      setSignupStep(2);
      // If OTP was returned in response (dev environment), autofocus it or log it
      if (data.otp) {
        console.log(`[AUTOFILLED CODE BYPASS] Dispatched: ${data.otp}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP delivery failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const joinedCode = otpCode.join('');
    if (joinedCode.length < 6) {
      setErrorMsg('Please enter the complete 6-digit code.');
      return;
    }
    if (!signupPassword) {
      setErrorMsg('Please declare a password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupEmail,
          code: joinedCode,
          password: signupPassword
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify account creation parameters');
      }

      setSuccessMsg('Account registered successfully! Secure session is starting.');
      // Auto reload session
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration verification failed');
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
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch password recovery');
      }
      setSuccessMsg(`A reset email was dispatched. Use code ${data.otp || '123456'} to log into forgot/reset parameters.`);
      setIsForgotOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Forgot password failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) return;
    const nextCode = [...otpCode];
    nextCode[index] = val;
    setOtpCode(nextCode);

    // Auto-advance
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface select-none pb-0">
      <Navbar />

      <main className="pt-32 pb-20 px-4 md:px-gutter max-w-lg mx-auto select-text relative z-10 z-index-10 flex flex-col justify-center items-center">
        {/* Subtle Cultural Mandala watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] -z-10 animate-pulse duration-[8s] scale-110">
          <Award className="h-[400px] w-[400px] text-primary" />
        </div>

        {/* Branding header */}
        <header className="text-center mb-8 select-none">
          <h1 className="font-headline-md text-headline-md text-primary tracking-tighter mb-2 uppercase font-medium">
            Royal Gems
          </h1>
          <p className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-semibold text-[10px]">
            Est. 1924 • Heritage Excellence
          </p>
        </header>

        {/* Auth Card container */}
        <div className="bg-surface-parchment p-8 md:p-10 border border-border-sepia w-full relative shadow-lg">
          
          {/* Corner borders visual details */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-secondary/20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-secondary/20" />

          {/* Feedback logs */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-error-container/40 border border-error/20 text-error-maroon font-body-sm text-[13px] flex items-center gap-2 select-none animate-bounce">
              <ShieldAlert className="h-5 w-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 bg-success-forest/10 border border-success-forest/30 text-success-forest font-body-sm text-[13px] flex items-center gap-2 select-none">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {isForgotOpen ? (
            /* Forgot Password Overlay details block */
            <div className="space-y-6">
              <div className="flex items-center mb-4 select-none">
                <button onClick={() => setIsForgotOpen(false)} className="mr-2 text-primary p-1 hover:scale-95 transition-all">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">
                  Reset Password
                </h2>
              </div>
              <p className="font-body-sm text-body-sm text-text-muted">
                Enter your registered email and we'll send you code instructions to reset your password.
              </p>
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-body-sm text-[13px] text-text-muted block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter registered email"
                    className="w-full bg-surface-bright border border-secondary/30 px-4 py-3 font-body-md text-[13px] rounded-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary-container transition-colors select-none font-semibold text-[11px] flex justify-center items-center gap-2"
                >
                  {isLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "RESET PASSWORD"}
                </button>
              </form>
            </div>
          ) : (
            /* Tab Switcher and Primary Forms */
            <div>
              {/* Tab Switcher */}
              <nav className="flex justify-between mb-8 border-b border-border-sepia/20 select-none">
                <button
                  onClick={() => {
                    setActiveTab('signin');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`flex-1 py-3 font-label-caps text-label-caps uppercase tracking-widest transition-all duration-300 font-semibold text-[11px] ${
                    activeTab === 'signin'
                      ? 'border-b-2 border-secondary text-on-surface'
                      : 'text-text-muted hover:text-on-surface'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`flex-1 py-3 font-label-caps text-label-caps uppercase tracking-widest transition-all duration-300 font-semibold text-[11px] ${
                    activeTab === 'signup'
                      ? 'border-b-2 border-secondary text-on-surface'
                      : 'text-text-muted hover:text-on-surface'
                  }`}
                >
                  Create Account
                </button>
              </nav>

              {activeTab === 'signin' ? (
                /* 1. Sign In Form */
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-1">
                    <label className="font-body-sm text-body-sm text-text-muted block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@heritage.com"
                      className="w-full bg-surface-bright border border-secondary/30 px-4 py-3 font-body-md text-[13px] rounded-none focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-text-muted"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center select-none text-[13px]">
                      <label className="font-body-sm text-[13px] text-text-muted">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotOpen(true)}
                        className="text-primary hover:underline hover:text-red-700"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-surface-bright border border-secondary/30 px-4 py-3 font-body-md text-[13px] rounded-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary-container transition-all duration-300 font-semibold text-[11px] flex justify-center items-center gap-2 select-none"
                  >
                    {isLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "SIGN IN PatRON"}
                  </button>
                </form>
              ) : (
                /* 2. Create Account Form (OTP Flow) */
                <div className="space-y-6">
                  {signupStep === 1 ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="font-body-sm text-body-sm text-text-muted block">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="Enter your email to receive OTP"
                          className="w-full bg-surface-bright border border-secondary/30 px-4 py-3 font-body-md text-[13px] rounded-none focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-text-muted"
                        />
                      </div>
                      <button
                        onClick={handleSendOTP}
                        disabled={isLoading}
                        className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary-container transition-all duration-300 font-semibold text-[11px] flex justify-center items-center gap-2 select-none"
                      >
                        {isLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "SEND OTP CODE"}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRegisterVerify} className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                      <p className="font-body-sm text-[13px] text-text-muted text-center select-none">
                        We've sent a 6-digit validation code to <b className="select-text text-on-surface font-semibold">{signupEmail}</b>.
                      </p>
                      
                      {/* OTP character inputs row */}
                      <div className="flex justify-between gap-2 max-w-xs mx-auto select-none">
                        {otpCode.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-10 h-12 text-center text-headline-sm font-headline-sm font-bold bg-white border border-secondary/30 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none outline-none rounded-none"
                          />
                        ))}
                      </div>

                      <div className="space-y-1 pt-2">
                        <label className="font-body-sm text-[13px] text-text-muted block">
                          Choose Legacy Password
                        </label>
                        <input
                          type="password"
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Minimize 6 characters"
                          className="w-full bg-surface-bright border border-secondary/30 px-4 py-3 font-body-md text-[13px] rounded-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary-container transition-all duration-300 font-semibold text-[11px] flex justify-center items-center gap-2 select-none"
                      >
                        {isLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "VERIFY & CREATE ACCOUNT"}
                      </button>

                      <div className="text-center pt-2 select-none">
                        <button
                          type="button"
                          onClick={() => {
                            setSignupStep(1);
                            setErrorMsg('');
                            setSuccessMsg('');
                          }}
                          className="font-body-sm text-[12px] text-text-muted hover:text-primary transition-colors"
                        >
                          Back to Step 1
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Double Rule divider link details */}
          <div className="h-1.5 border-t border-b border-secondary/15 w-full my-6 select-none" />

          {/* Secure Trust Marks footer panel details */}
          <div className="flex justify-center gap-6 opacity-60 text-text-muted select-none">
            <div className="flex items-center gap-1.5 text-[10px] font-label-caps">
              <Lock className="h-4 w-4 text-secondary font-semibold" />
              <span className="uppercase tracking-widest">SECURE SSL CONNECTION</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-label-caps">
              <Star className="h-4 w-4 text-secondary" />
              <span className="uppercase tracking-widest">AUTHENTIC LAB SEALS</span>
            </div>
          </div>
        </div>

        {/* Policy footer linkages */}
        <footer className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 select-none">
          <Link to="/privacy-policy" className="font-body-sm text-[12px] text-text-muted hover:text-primary transition-colors uppercase">
            Privacy Policy
          </Link>
          <span className="text-outline-variant/30">|</span>
          <Link to="/refund-policy" className="font-body-sm text-[12px] text-text-muted hover:text-primary transition-colors uppercase">
            Refund Terms
          </Link>
          <span className="text-outline-variant/30">|</span>
          <Link to="/shipping-policy" className="font-body-sm text-[12px] text-text-muted hover:text-primary transition-colors uppercase">
            Insured Shipping
          </Link>
        </footer>
      </main>

      <Footer />
    </div>
  );
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
