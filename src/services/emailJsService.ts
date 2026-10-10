import emailjs from '@emailjs/browser';

interface OtpSession {
  code: string;
  expiresAt: number;
  attempts: number;
  email: string;
}

// In-memory OTP session storage
let activeOtpSession: OtpSession | null = null;

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

/**
 * Check if EmailJS configuration keys are available
 */
export function isEmailJsConfigured(): boolean {
  return Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
function generateSecureOtp(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const code = (array[0] % 900000) + 100000;
    return code.toString();
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send real 6-digit OTP to the authorized email via EmailJS
 */
export async function sendEmailJsOtp(toEmail: string): Promise<{ success: boolean; message?: string }> {
  if (!isEmailJsConfigured()) {
    throw new Error(
      'EmailJS is not fully configured. Please add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to your .env file.'
    );
  }

  const otp = generateSecureOtp();
  const validityMinutes = 10;
  const expiresAt = Date.now() + validityMinutes * 60 * 1000;

  activeOtpSession = {
    code: otp,
    expiresAt,
    attempts: 0,
    email: toEmail.trim().toLowerCase(),
  };

  const templateParams = {
    to_email: toEmail.trim(),
    otp_code: otp,
    passcode: otp,
    code: otp,
    validity_minutes: validityMinutes.toString(),
    app_name: 'Valuation Invoice Generator',
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString('en-IN'),
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    if (response.status === 200 || response.text === 'OK') {
      return { success: true };
    } else {
      throw new Error(`EmailJS responded with status: ${response.status} (${response.text})`);
    }
  } catch (err: any) {
    console.error('[EmailJS Send Error]:', err);
    throw new Error(err?.text || err?.message || 'Failed to dispatch email OTP via EmailJS.');
  }
}

/**
 * Verify user entered 6-digit OTP
 */
export function verifyEmailJsOtp(enteredCode: string): { valid: boolean; reason?: string } {
  if (!activeOtpSession) {
    return { valid: false, reason: 'No active OTP request found. Please request a new code.' };
  }

  if (Date.now() > activeOtpSession.expiresAt) {
    activeOtpSession = null;
    return { valid: false, reason: 'The verification OTP has expired. Please request a new code.' };
  }

  if (activeOtpSession.attempts >= 5) {
    activeOtpSession = null;
    return { valid: false, reason: 'Maximum attempts exceeded. Please request a new OTP.' };
  }

  activeOtpSession.attempts += 1;

  if (activeOtpSession.code === enteredCode.trim()) {
    // Validated! Clear session to prevent code reuse
    activeOtpSession = null;
    return { valid: true };
  }

  return { valid: false, reason: 'Incorrect 6-digit OTP code. Please check your email and try again.' };
}

/**
 * Clear any active OTP session
 */
export function clearEmailJsOtpSession(): void {
  activeOtpSession = null;
}
