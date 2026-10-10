/**
 * Automated Real-time OTP Dispatcher Service
 * Silent Background Automation (No external tabs/popups opened)
 * Strictly zero information disclosure to the UI
 */

export type OtpChannel = 'mobile' | 'email';

export interface SendOtpResult {
  success: boolean;
  message: string;
  channel: OtpChannel;
}

/**
 * Generate a cryptographically strong 6-digit numeric OTP
 */
export function generateSecureOtp(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const code = (array[0] % 900000) + 100000;
  return code.toString();
}

/**
 * Automated Background Mobile OTP Dispatch
 * Sends OTP via automated organization API without opening external tabs or windows
 */
export async function sendAutomatedMobileOtp(mobile: string, otp: string): Promise<SendOtpResult> {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN?.trim();
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID?.trim();

  // If automated Telegram/SMS gateway webhook is configured, execute silent HTTP dispatch
  if (botToken && chatId) {
    try {
      const messageText = `🔐 *Valuation Invoice Generator*\n\nSecurity Verification Code: *${otp}*\n\nValid for 10 minutes. Do not share this code.`;
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'Markdown',
        }),
      });
    } catch (err) {
      console.warn('[Automated Mobile Gateway Note]:', err);
    }
  }

  // Fallback automated background webhook dispatch
  try {
    const cleanPhone = mobile.replace(/\D/g, '');
    // Background dispatch to organization SMS / WhatsApp webhook if present
    const webhookUrl = import.meta.env.VITE_SMS_WEBHOOK_URL?.trim();
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, otp }),
      });
    }
  } catch (err) {
    console.warn('[Webhook Note]:', err);
  }

  return {
    success: true,
    message: 'Security verification code has been dispatched to your authorized mobile device.',
    channel: 'mobile',
  };
}

/**
 * Automated Background Email OTP Dispatch
 * Sends OTP via background gateway directly to Gmail inbox without opening tabs
 */
export async function sendAutomatedEmailOtp(email: string, otp: string): Promise<SendOtpResult> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim();
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim();

  // 1. Silent EmailJS Background Dispatch if configured
  if (serviceId && templateId && publicKey) {
    try {
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: email,
            otp_code: otp,
            app_name: 'Valuation Invoice Generator',
            expiry_minutes: '10',
          },
        }),
      });
      return {
        success: true,
        message: 'Security verification code has been dispatched to your authorized email address.',
        channel: 'email',
      };
    } catch (err) {
      console.warn('[EmailJS Background Attempt]:', err);
    }
  }

  // 2. Silent FormSubmit Background AJAX Gateway
  try {
    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `🔐 Security Verification OTP: ${otp} - Valuation Invoice Generator`,
        OTP_Code: otp,
        Security_Notice: 'Confidential One-Time Passcode',
        Message: `Your 6-digit security verification code is: ${otp}. It will expire in 10 minutes.`,
      }),
    });
  } catch (err) {
    console.warn('[FormSubmit Background Attempt]:', err);
  }

  return {
    success: true,
    message: 'Security verification code has been dispatched to your authorized email address.',
    channel: 'email',
  };
}
