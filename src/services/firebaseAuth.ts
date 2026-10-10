import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  type ConfirmationResult,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCTkRJCNAmlRKber7wv8s4gQKvIHHnjnb4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'satyasaiconstructions-f5713.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'satyasaiconstructions-f5713',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'satyasaiconstructions-f5713.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '666173449262',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:666173449262:web:e9427ca30fed0d4da12bbf',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-E6DRNB4HGR',
};

// Initialize Firebase App singleton
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

/**
 * Format raw phone number into E.164 standard (e.g. "+916301451462")
 */
export function formatPhoneE164(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  return rawPhone.startsWith('+') ? rawPhone : `+${rawPhone}`;
}

/**
 * Initialize invisible Google reCAPTCHA verifier
 */
export function createRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(firebaseAuth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved silently
    },
    'expired-callback': () => {
      console.warn('[Firebase Auth]: reCAPTCHA expired, will re-verify on next request.');
    },
  });
}

/**
 * Send real Google SMS OTP to the hardlocked mobile phone
 */
export async function sendFirebaseMobileOtp(
  mobile: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const formatted = formatPhoneE164(mobile);
  return await signInWithPhoneNumber(firebaseAuth, formatted, appVerifier);
}

/**
 * Verify user-entered 6-digit SMS OTP against Google's ConfirmationResult
 */
export async function verifyFirebaseMobileOtp(
  confirmationResult: ConfirmationResult,
  code: string
): Promise<boolean> {
  const result = await confirmationResult.confirm(code);
  return Boolean(result.user);
}

/**
 * Send official Google Security Reset Email to the hardlocked email address
 */
export async function sendFirebaseEmailReset(email: string): Promise<void> {
  await sendPasswordResetEmail(firebaseAuth, email.trim());
}
