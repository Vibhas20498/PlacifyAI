import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Global OTP cache for instant fallback / local dev across route handlers
interface OtpRecord {
  hashedOtp: string;
  email: string;
  expiresAt: number;
  metadata?: Record<string, any>;
}

const globalForOtp = globalThis as unknown as {
  placifyOtpStore?: Map<string, OtpRecord>;
};

const memoryOtpStore =
  globalForOtp.placifyOtpStore ?? new Map<string, OtpRecord>();

if (process.env.NODE_ENV !== 'production') {
  globalForOtp.placifyOtpStore = memoryOtpStore;
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP code
 */
export function generateOtpCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Hash an OTP using SHA-256 with salt
 */
export function hashOtp(otp: string, email: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placify-otp-secret-salt-2026';
  return crypto
    .createHmac('sha256', secret)
    .update(`${email.toLowerCase()}:${otp}`)
    .digest('hex');
}

/**
 * Store OTP in memory and/or database with 10-minute expiry
 */
export async function storeOtp(email: string, otp: string, metadata?: Record<string, any>): Promise<void> {
  const cleanEmail = email.toLowerCase().trim();
  const hashedOtp = hashOtp(otp, cleanEmail);
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store in memory cache
  memoryOtpStore.set(cleanEmail, {
    hashedOtp,
    email: cleanEmail,
    expiresAt,
    metadata,
  });
}

/**
 * Verify provided OTP against stored hash
 */
export async function verifyStoredOtp(email: string, otp: string): Promise<{ valid: boolean; metadata?: Record<string, any>; message?: string }> {
  const cleanEmail = email.toLowerCase().trim();
  const record = memoryOtpStore.get(cleanEmail);

  if (!record) {
    return { valid: false, message: 'No active OTP found for this email or code expired.' };
  }

  if (Date.now() > record.expiresAt) {
    memoryOtpStore.delete(cleanEmail);
    return { valid: false, message: 'Verification code has expired. Please request a new one.' };
  }

  const computedHash = hashOtp(otp.trim(), cleanEmail);
  if (computedHash !== record.hashedOtp) {
    return { valid: false, message: 'Invalid verification code. Please check your email.' };
  }

  // OTP is valid - consume it (single use)
  const meta = record.metadata;
  memoryOtpStore.delete(cleanEmail);

  return { valid: true, metadata: meta };
}

/**
 * Send Swiss-Monochrome Styled HTML Email via Free SMTP (Nodemailer)
 */
export async function sendOtpEmail(email: string, otp: string, userName: string = 'Candidate'): Promise<{ success: boolean; devMode?: boolean; previewCode?: string }> {
  const cleanEmail = email.toLowerCase().trim();

  // Store OTP token
  await storeOtp(cleanEmail, otp, { name: userName });

  // Clean and sanitize SMTP credentials
  const smtpHost = process.env.SMTP_HOST?.trim();
  let smtpUser = process.env.SMTP_USER?.trim()?.replace(/^your-/, '');
  let smtpPass = process.env.SMTP_PASS?.trim()?.replace(/\s+/g, '');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PlacifyAI Security Verification</title>
        <!--[if mso]>
        <style type="text/css">
          body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
        </style>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; background-color: #F8F9FA; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F9FA; padding: 40px 15px;">
          <tr>
            <td align="center">
              <!-- Main Email Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
                
                <!-- Top Brand Bar -->
                <tr>
                  <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #F3F4F6;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="left">
                          <div style="display: inline-block; background-color: #0A0A0A; color: #FFFFFF; font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 8px; letter-spacing: 0.08em;">
                            PLACIFY // AI
                          </div>
                        </td>
                        <td align="right">
                          <span style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; background-color: #F3F4F6; padding: 4px 8px; border-radius: 6px;">
                            AUTH PROTOCOL
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 36px 32px 28px 32px;">
                    <h1 style="margin: 0 0 16px 0; font-size: 26px; font-weight: 700; letter-spacing: -0.02em; color: #0A0A0A; line-height: 1.2;">
                      Identity Verification
                    </h1>
                    
                    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #4B5563;">
                      Hello <strong>${userName}</strong>,<br>
                      Use the single-use verification code below to securely sign in and access your <strong>Placement Readiness Dashboard</strong>.
                    </p>

                    <!-- Large OTP Code Box -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                      <tr>
                        <td align="center" style="background-color: #FAFAFA; border: 1.5px solid #0A0A0A; border-radius: 14px; padding: 24px 16px;">
                          <div style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 40px; font-weight: 800; letter-spacing: 0.28em; color: #0A0A0A; line-height: 1; padding-left: 0.28em;">
                            ${otp}
                          </div>
                          <div style="margin-top: 14px; font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; font-weight: 600; color: #6B7280; letter-spacing: 0.08em; text-transform: uppercase;">
                            ⏳ Valid for 10 minutes • Do not share
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Feature Capabilities Grid -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 28px; border-top: 1px solid #F3F4F6; padding-top: 24px;">
                      <tr>
                        <td style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 11px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 12px;">
                          Intelligence Suite Unlocked
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td width="24" valign="top" style="font-family: monospace; font-size: 12px; font-weight: bold; color: #0A0A0A;">01</td>
                              <td style="font-size: 13px; color: #374151; line-height: 1.4;">
                                <strong>ML Placement Probability:</strong> Calibrated XGBoost & SHAP factor explainability.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td width="24" valign="top" style="font-family: monospace; font-size: 12px; font-weight: bold; color: #0A0A0A;">02</td>
                              <td style="font-size: 13px; color: #374151; line-height: 1.4;">
                                <strong>RAG Career Coach:</strong> Grounded multi-turn advising referencing Tier-1 hiring rubrics.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td width="24" valign="top" style="font-family: monospace; font-size: 12px; font-weight: bold; color: #0A0A0A;">03</td>
                              <td style="font-size: 13px; color: #374151; line-height: 1.4;">
                                <strong>ATS Resume Optimizer:</strong> Google XYZ impact formula & STAR bullet rewriter.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Security Footnote -->
                    <p style="margin: 28px 0 0 0; font-size: 12px; line-height: 1.5; color: #9CA3AF; border-top: 1px solid #F3F4F6; padding-top: 20px;">
                      If you did not request this security code, please disregard this email. Your account credentials remain protected.
                    </p>
                  </td>
                </tr>

                <!-- Bottom Footer -->
                <tr>
                  <td style="background-color: #FAFAFA; border-top: 1px solid #F3F4F6; padding: 20px 32px; text-align: center;">
                    <p style="margin: 0; font-size: 11px; font-family: 'JetBrains Mono', Consolas, Monaco, monospace; color: #9CA3AF; line-height: 1.6;">
                      PlacifyAI — Precision Career Intelligence Platform<br>
                      © 2026 PlacifyAI. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  // If SMTP is configured, send real email via SMTP
  if (smtpUser && smtpPass) {
    try {
      const isGmail = smtpHost?.includes('gmail') || smtpUser.endsWith('@gmail.com');

      const transportConfig: any = isGmail
        ? {
            service: 'gmail',
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          }
        : {
            host: smtpHost,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          };

      const transporter = nodemailer.createTransport(transportConfig);

      const senderFrom = process.env.SMTP_FROM || `"PlacifyAI Security" <${smtpUser}>`;

      await transporter.sendMail({
        from: senderFrom,
        to: cleanEmail,
        subject: `[${otp}] Your PlacifyAI Verification Code`,
        text: `Your PlacifyAI registration verification code is: ${otp}. Valid for 10 minutes.`,
        html: htmlContent,
      });

      console.log(`[Placify Security] Real Email OTP successfully dispatched to ${cleanEmail}`);
      return { success: true, emailSent: true };
    } catch (err: any) {
      console.error('[Placify Security] SMTP Send Error:', err.message);
      // Fall through to dev logger
    }
  }

  // Dev / Testing mode fallback: logs directly in terminal and provides code for fast test
  console.log('====================================================');
  console.log(`[PLACIFY SECURITY] SIMULATED EMAIL OTP DISPATCH:`);
  console.log(`To: ${cleanEmail} (${userName})`);
  console.log(`OTP Code: ${otp}`);
  console.log(`Expires: 10 minutes`);
  console.log('====================================================');

  return {
    success: true,
    devMode: true,
    previewCode: otp,
  };
}
