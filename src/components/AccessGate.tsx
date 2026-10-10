import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Mail,
  Smartphone,
  ArrowLeft,
  RefreshCw,
  Send,
  Loader2,
} from 'lucide-react';
import {
  createRecaptchaVerifier,
  sendFirebaseMobileOtp,
  verifyFirebaseMobileOtp,
} from '../services/firebaseAuth';
import {
  sendEmailJsOtp,
  verifyEmailJsOtp,
  isEmailJsConfigured,
} from '../services/emailJsService';
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';

export type OtpChannel = 'mobile' | 'email';

interface AccessGateProps {
  onAuthenticate: (remember: boolean) => void;
}

type GateView = 'login' | 'forgot_method' | 'verify_otp' | 'reset_pin' | 'reset_success';

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_RECOVERY_EMAIL || 'ashapulokesh32@gmail.com').trim();
const ADMIN_MOBILE = (import.meta.env.VITE_ADMIN_RECOVERY_MOBILE || '+91 6301451462').trim();

export const AccessGate: React.FC<AccessGateProps> = ({ onAuthenticate }) => {
  // Login State
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password / Firebase Flow State
  const [view, setView] = useState<GateView>('login');
  const [recoveryChannel, setRecoveryChannel] = useState<OtpChannel>('mobile');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmNewPasscode, setConfirmNewPasscode] = useState('');
  const [showNewPasscode, setShowNewPasscode] = useState(false);

  const loginInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const newPasscodeRef = useRef<HTMLInputElement>(null);

  // Focus management
  useEffect(() => {
    if (view === 'login') {
      loginInputRef.current?.focus();
    } else if (view === 'verify_otp') {
      otpInputRef.current?.focus();
    } else if (view === 'reset_pin') {
      newPasscodeRef.current?.focus();
    }
  }, [view]);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (view === 'verify_otp' && resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [view, resendCooldown]);

  // Retrieve current active passcode (custom stored in localStorage or default 2004)
  const getExpectedPasscode = () => {
    return (
      localStorage.getItem('invoice_app_custom_passcode') ||
      (import.meta.env.VITE_APP_ACCESS_CODE || '2004')
    ).trim();
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = getExpectedPasscode();
    const entered = passcode.trim();

    if (!entered) {
      setError('Please enter your security passcode');
      triggerShake();
      return;
    }

    if (entered === expected) {
      setError(null);
      setIsSubmitting(true);
      setTimeout(() => {
        onAuthenticate(rememberMe);
      }, 350);
    } else {
      setError('Incorrect passcode. Access denied.');
      triggerShake();
      setPasscode('');
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      loginInputRef.current?.focus();
    }, 500);
  };

  // Dispatch verification request via EmailJS (Email) or Firebase (Mobile)
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsSendingOtp(true);

    try {
      if (recoveryChannel === 'mobile') {
        let verifier = recaptchaVerifier;
        if (!verifier) {
          verifier = createRecaptchaVerifier('firebase-recaptcha-anchor');
          setRecaptchaVerifier(verifier);
        }
        const confResult = await sendFirebaseMobileOtp(ADMIN_MOBILE, verifier);
        setConfirmationResult(confResult);
        setDispatchStatus('Real Google SMS code has been dispatched to your authorized mobile phone.');
      } else {
        await sendEmailJsOtp(ADMIN_EMAIL);
        setDispatchStatus('A secure 6-digit OTP has been sent directly to your authorized Gmail inbox.');
      }

      setResendCooldown(60);
      setEnteredOtp('');
      setView('verify_otp');
    } catch (err: any) {
      console.error('[Dispatch Error]:', err);
      let friendlyError = err?.message || 'Failed to dispatch verification request.';
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('BILLING_NOT_ENABLED')) {
        friendlyError =
          'Firebase Free Tier requires adding +916301451462 under Authentication > Sign-in method > Phone > "Phone numbers for testing" (Free & Instant), or use Email Verification.';
      } else if (err?.code === 'auth/too-many-requests') {
        friendlyError = 'Too many requests. Please wait a few moments before trying again, or use Email Verification.';
      } else if (err?.code === 'auth/quota-exceeded') {
        friendlyError = 'SMS quota reached. Please use email verification or try again later.';
      } else if (err?.code === 'auth/invalid-phone-number') {
        friendlyError = 'Invalid mobile number format configured.';
      }
      setError(friendlyError);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSendingOtp) return;
    setError(null);
    setIsSendingOtp(true);

    try {
      if (recoveryChannel === 'mobile') {
        let verifier = recaptchaVerifier;
        if (!verifier) {
          verifier = createRecaptchaVerifier('firebase-recaptcha-anchor');
          setRecaptchaVerifier(verifier);
        }
        const confResult = await sendFirebaseMobileOtp(ADMIN_MOBILE, verifier);
        setConfirmationResult(confResult);
        setDispatchStatus('A new Google SMS code has been dispatched to your authorized phone.');
      } else {
        await sendEmailJsOtp(ADMIN_EMAIL);
        setDispatchStatus('A new 6-digit OTP code has been dispatched to your Gmail inbox.');
      }

      setResendCooldown(60);
      setEnteredOtp('');
    } catch (err: any) {
      console.error('[Resend Error]:', err);
      let msg = err?.message || 'Failed to resend verification request.';
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('BILLING_NOT_ENABLED')) {
        msg =
          'Firebase Free Tier requires adding +916301451462 under Authentication > Sign-in method > Phone > "Phone numbers for testing" (Free & Instant), or use Email Verification.';
      }
      setError(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (recoveryChannel === 'mobile') {
      if (!enteredOtp.trim()) {
        setError('Please enter the 6-digit SMS code received on your phone');
        return;
      }

      if (!confirmationResult) {
        setError('SMS session expired. Please click resend to get a new code.');
        return;
      }

      setIsVerifyingOtp(true);
      try {
        const verified = await verifyFirebaseMobileOtp(confirmationResult, enteredOtp.trim());
        if (verified) {
          setNewPasscode('');
          setConfirmNewPasscode('');
          setView('reset_pin');
        } else {
          setError('Invalid verification code. Please check your SMS and try again.');
        }
      } catch (err: any) {
        console.error('[Firebase SMS Verification Error]:', err);
        let msg = 'Incorrect or expired SMS verification code.';
        if (err?.code === 'auth/invalid-verification-code') {
          msg = 'Incorrect SMS verification code. Please check the code sent to your phone.';
        } else if (err?.code === 'auth/code-expired') {
          msg = 'The verification code has expired. Please request a new code.';
        }
        setError(msg);
      } finally {
        setIsVerifyingOtp(false);
      }
    } else {
      // Email OTP verification
      if (!enteredOtp.trim()) {
        setError('Please enter the 6-digit OTP code received in your email');
        return;
      }

      setIsVerifyingOtp(true);
      try {
        const res = verifyEmailJsOtp(enteredOtp.trim());
        if (res.valid) {
          setNewPasscode('');
          setConfirmNewPasscode('');
          setView('reset_pin');
        } else {
          setError(res.reason || 'Invalid OTP code. Please check your email and try again.');
        }
      } catch (err: any) {
        console.error('[Email OTP Verification Error]:', err);
        setError(err?.message || 'Failed to verify email OTP.');
      } finally {
        setIsVerifyingOtp(false);
      }
    }
  };

  const handleSaveNewPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim()) {
      setError('Please enter a new passcode');
      return;
    }

    if (newPasscode.length < 4) {
      setError('Passcode must be at least 4 digits');
      return;
    }

    if (newPasscode !== confirmNewPasscode) {
      setError('Passcodes do not match. Please re-enter.');
      return;
    }

    // Save newly reset passcode to localStorage
    localStorage.setItem('invoice_app_custom_passcode', newPasscode.trim());
    setError(null);
    setPasscode(newPasscode.trim());
    setView('reset_success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Auth Card */}
      <div
        className={`relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl transition-all duration-200 ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
          }`}
        style={{
          animation: isShaking ? 'shake 0.45s cubic-bezier(.36,.07,.19,.97) both' : undefined,
        }}
      >
        <style>{`
          @keyframes shake {
            10%, 90% { transform: translate3d(-2px, 0, 0); }
            20%, 80% { transform: translate3d(3px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-5px, 0, 0); }
            40%, 60% { transform: translate3d(5px, 0, 0); }
          }
        `}</style>

        {/* Invisible Google reCAPTCHA anchor for Firebase Phone Auth */}
        <div id="firebase-recaptcha-anchor" className="w-0 h-0 opacity-0 overflow-hidden" />

        {/* ======================================================== */}
        {/* VIEW 1: NORMAL LOGIN PASSCODE                            */}
        {/* ======================================================== */}
        {view === 'login' && (
          <>
            {/* Security Badge Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  {isSubmitting ? (
                    <Unlock className="w-8 h-8 text-white transition-transform duration-300" />
                  ) : (
                    <Lock className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-[11px] font-semibold text-indigo-300 mb-3 tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Restricted Deployment
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Security Gate Access
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs">
                Enter your authorized passcode to unlock the Invoice Generator workspace.
              </p>
            </div>

            {/* Access Form */}
            <form onSubmit={handleUnlock} className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="passcode-input"
                    className="block text-xs font-semibold text-slate-300"
                  >
                    Security Passcode
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setView('forgot_method');
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium hover:underline"
                  >
                    Forgot Passcode?
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>

                  <input
                    id="passcode-input"
                    ref={loginInputRef}
                    type={showPasscode ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (error) setError(null);
                    }}
                    disabled={isSubmitting}
                    placeholder="Enter security passcode..."
                    autoComplete="current-password"
                    className={`w-full bg-slate-950/80 text-white placeholder-slate-600 text-sm rounded-xl pl-10 pr-11 py-3 border transition-all outline-none focus:ring-2 ${error
                        ? 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                      }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    title={showPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-400 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 focus:ring-2 cursor-pointer accent-indigo-600"
                  />
                  <span className="text-xs text-slate-300 font-medium">Remember this device</span>
                </label>

                <span className="text-[11px] text-slate-500">
                  {rememberMe ? 'Persistent session' : 'Single tab session'}
                </span>
              </div>

              {/* Unlock Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-indigo-600/30 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-spin" />
                    <span>Unlocking Workspace...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Workspace</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: SELECT RECOVERY CHANNEL (EMAIL OR MOBILE)        */}
        {/* ======================================================== */}
        {view === 'forgot_method' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setView('login');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
              <div className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">
                Step 1 of 3
              </div>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                <KeyRound className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Reset Security Passcode
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Select your verification channel to receive a real-time one-time password (OTP).
              </p>
            </div>

            {/* Channel Tabs (Automated Mobile / Automated Email) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setRecoveryChannel('mobile');
                  setError(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${recoveryChannel === 'mobile'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Dispatch</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecoveryChannel('email');
                  setError(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${recoveryChannel === 'email'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Dispatch</span>
              </button>
            </div>

            {/* Zero-Disclosure Protected Destination Card */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Authorized Administrator Profile
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Encrypted Recipient
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800/80 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  {recoveryChannel === 'mobile' ? <Smartphone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-white tracking-wide">
                    {recoveryChannel === 'mobile' ? 'Registered Administrator Device' : 'Registered Administrator Mailbox'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {recoveryChannel === 'mobile'
                      ? 'Automated security code will be sent to the confidential mobile contact on file.'
                      : 'Automated security code will be sent to the confidential email address on file.'}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                <span>Specific contact details are masked for system security.</span>
              </div>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              {recoveryChannel === 'email' && !isEmailJsConfigured() && (
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs space-y-1.5 text-amber-300">
                  <div className="font-semibold flex items-center gap-1.5 text-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>EmailJS Setup Required</span>
                  </div>
                  <p className="text-[11px] text-amber-300/80 leading-relaxed">
                    Please add your EmailJS credentials (<code className="bg-slate-900 px-1 py-0.5 rounded text-amber-200">VITE_EMAILJS_SERVICE_ID</code>, <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-200">VITE_EMAILJS_TEMPLATE_ID</code>, and <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-200">VITE_EMAILJS_PUBLIC_KEY</code>) to your <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-200">.env</code> file.
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-indigo-600/30"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Dispatching Automated OTP...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Dispatch Security Code</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: VERIFY REAL-TIME OTP                             */}
        {/* ======================================================== */}
        {view === 'verify_otp' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setView('forgot_method');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Change Channel
              </button>
              <div className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">
                Step 2 of 3
              </div>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {recoveryChannel === 'mobile' ? 'Enter Google SMS Code' : 'Enter 6-Digit Email OTP'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {recoveryChannel === 'mobile'
                  ? 'A 6-digit SMS verification code has been dispatched to your authorized phone.'
                  : 'A 6-digit one-time passcode has been sent directly to your authorized Gmail inbox.'}
              </p>
            </div>

            {/* Delivery Status Banner */}
            <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-xs flex items-center gap-2.5 text-indigo-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-[11px] leading-relaxed">
                {dispatchStatus ||
                  (recoveryChannel === 'mobile'
                    ? 'Please check your mobile text messages (SMS) for the 6-digit code.'
                    : 'Please check your Gmail inbox (including Spam folder) for the 6-digit OTP code.')}
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 text-center">
                  {recoveryChannel === 'mobile'
                    ? 'Enter 6-Digit SMS Code Received'
                    : 'Enter 6-Digit Code Received in Gmail'}
                </label>
                <input
                  ref={otpInputRef}
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '');
                    setEnteredOtp(cleaned);
                    if (error) setError(null);
                  }}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-white outline-none"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 justify-center">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifyingOtp}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-indigo-600/30"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying OTP Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP & Set New Passcode</span>
                  </>
                )}
              </button>
            </form>

            {/* Resend Cooldown */}
            <div className="text-center pt-1 border-t border-slate-800/60">
              {resendCooldown > 0 ? (
                <span className="text-xs text-slate-500">
                  Resend code in <strong className="text-indigo-400 font-mono">{resendCooldown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSendingOtp}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} /> Resend Verification Code
                </button>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: RESET PASSCODE (NEW PASSCODE SETUP)              */}
        {/* ======================================================== */}
        {view === 'reset_pin' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Identity Verified
              </div>
              <div className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">
                Step 3 of 3
              </div>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Set New Passcode
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Create your new security passcode to access the workspace.
              </p>
            </div>

            <form onSubmit={handleSaveNewPasscode} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  New Passcode (Min. 4 characters)
                </label>
                <div className="relative">
                  <input
                    ref={newPasscodeRef}
                    type={showNewPasscode ? 'text' : 'password'}
                    value={newPasscode}
                    onChange={(e) => {
                      setNewPasscode(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter new passcode..."
                    className="w-full bg-slate-950 text-white text-sm rounded-xl pl-4 pr-11 py-2.5 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPasscode(!showNewPasscode)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showNewPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Confirm New Passcode
                </label>
                <input
                  type={showNewPasscode ? 'text' : 'password'}
                  value={confirmNewPasscode}
                  onChange={(e) => {
                    setConfirmNewPasscode(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Re-enter new passcode..."
                  className="w-full bg-slate-950 text-white text-sm rounded-xl px-4 py-2.5 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] transition-all shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                Update Passcode
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 5: SUCCESS STATE                                    */}
        {/* ======================================================== */}
        {view === 'reset_success' && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Passcode Updated!
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Your new security passcode is now active. You can unlock your workspace immediately.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setView('login');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition-all shadow-lg shadow-indigo-600/30"
            >
              <Unlock className="w-4 h-4" />
              Proceed to Unlock
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            Protected by Anarva Single-User Security Protocol
          </p>
        </div>
      </div>
    </div>
  );
};
