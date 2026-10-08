import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, Unlock, Eye, EyeOff, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';

interface AccessGateProps {
  onAuthenticate: (remember: boolean) => void;
}

export const AccessGate: React.FC<AccessGateProps> = ({ onAuthenticate }) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedPasscode = (import.meta.env.VITE_APP_ACCESS_CODE || '1981').trim();
    const entered = passcode.trim();

    if (!entered) {
      setError('Please enter your security passcode');
      triggerShake();
      return;
    }

    if (entered === expectedPasscode) {
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
      inputRef.current?.focus();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Auth Card */}
      <div
        className={`relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl transition-transform duration-200 ${
          isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
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
            Enter the authorized instance PIN or passcode to unlock the Invoice Generator workspace.
          </p>
        </div>

        {/* Access Form */}
        <form onSubmit={handleUnlock} className="space-y-5">
          <div>
            <label
              htmlFor="passcode-input"
              className="block text-xs font-semibold text-slate-300 mb-2"
            >
              Security Passcode / PIN
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>

              <input
                id="passcode-input"
                ref={inputRef}
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isSubmitting}
                placeholder="Enter PIN..."
                autoComplete="current-password"
                className={`w-full bg-slate-950/80 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-11 py-3 border transition-all outline-none focus:ring-2 ${
                  error
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

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            Protected by Antigravity Single-User Security Protocol
          </p>
        </div>
      </div>
    </div>
  );
};
