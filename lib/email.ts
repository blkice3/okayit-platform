// Shared email helper for OKAYiT platform
// All emails route to admin@okayit.uk

export const SUPER_ADMIN_EMAIL = 'admin@okayit.uk';

export async function sendNotification({
  notificationId,
  subject,
  htmlBody,
  recipientEmail,
}: {
  notificationId: string;
  subject: string;
  htmlBody: string;
  recipientEmail?: string;
}): Promise<boolean> {
  try {
    const appUrl = process.env.NEXTAUTH_URL || 'https://okayit.online';
    const hostname = new URL(appUrl).hostname;

    const response = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: notificationId,
        subject,
        body: htmlBody,
        is_html: true,
        recipient_email: recipientEmail || SUPER_ADMIN_EMAIL,
        sender_email: `noreply@${hostname}`,
        sender_alias: 'OKAYiT Platform',
      }),
    });

    const result = await response.json();
    if (!result.success && result.notification_disabled) {
      console.log('Notification disabled by user, skipping');
      return true;
    }
    return result.success === true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export function emailWrapper(title: string, content: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">OKAYiT</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 13px;">Care Platform</p>
      </div>
      <div style="padding: 24px;">
        <h2 style="color: #1f2937; margin: 0 0 16px; font-size: 18px;">${title}</h2>
        ${content}
      </div>
      <div style="text-align: center; padding: 16px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 11px; margin: 0;">OKAYiT Care Platform &bull; <a href="https://okayit.online" style="color: #7c3aed;">okayit.online</a></p>
      </div>
    </div>
  `;
}
