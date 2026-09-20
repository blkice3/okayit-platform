// Feedback endpoint — anonymous feedback collection
// Sends enquiries/feedback to admin@okayit.uk

import { NextRequest, NextResponse } from 'next/server';
import { sendNotification, emailWrapper, SUPER_ADMIN_EMAIL } from '@/lib/email';

interface FeedbackData {
  type: string;
  rating?: number;
  feedback: string;
  timestamp: string;
}

const feedbackTypeLabels: Record<string, string> = {
  review: 'Review',
  suggestion: 'Suggestion',
  positive: 'Positive Feedback',
  issue: 'Issue Report',
};

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackData = await request.json();
    const { type, rating, feedback, timestamp } = body;

    if (!type || !feedback || !timestamp) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const typeLabel = feedbackTypeLabels[type] || type;
    const stars = rating ? '⭐'.repeat(Math.min(rating, 5)) : 'N/A';

    // Email to admin@okayit.uk
    const content = `
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 16px;">
        <p style="margin: 8px 0;"><strong>Type:</strong> ${typeLabel}</p>
        <p style="margin: 8px 0;"><strong>Rating:</strong> ${stars}</p>
        <p style="margin: 8px 0;"><strong>Time:</strong> ${new Date(timestamp).toLocaleString('en-GB')}</p>
        <div style="background: #f9fafb; padding: 12px; border-radius: 6px; border-left: 4px solid #7c3aed; margin-top: 12px;">
          <p style="margin: 0; white-space: pre-wrap;">${feedback}</p>
        </div>
      </div>
    `;

    sendNotification({
      notificationId: process.env.NOTIF_ID_PLATFORM_ENQUIRY || '',
      subject: `[${typeLabel}] New platform feedback received`,
      htmlBody: emailWrapper('Platform Feedback / Enquiry', content),
      recipientEmail: SUPER_ADMIN_EMAIL,
    }).catch(err => console.error('Failed to send feedback email:', err));

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! It has been sent to the team.',
    });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to process feedback' }, { status: 500 });
  }
}
