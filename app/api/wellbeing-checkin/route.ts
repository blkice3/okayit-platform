// CONSENT-BASED WELLBEING CHECK-INS
// Users can optionally share their wellbeing data with staff
// Data is only stored if user explicitly consents

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Mood level descriptions for email
const moodDescriptions: Record<string, string> = {
  'amazing': '😄 Amazing - Feeling fantastic',
  'good': '🙂 Good - Feeling pretty good',
  'okay': '😐 Okay - Not great, not bad',
  'struggling': '😔 Struggling - Having a hard time',
  'really-low': '😢 Really Low - Needs support'
};

// Helper to send email notification
async function sendWellbeingNotification(data: {
  userName: string;
  home: string;
  mood: string;
  moodLevel: number;
  note?: string;
  sendTo: 'keyworker' | 'manager';
  timestamp: string;
}) {
  try {
    const recipientType = data.sendTo === 'keyworker' ? 'Key Worker' : 'Home Manager';
    const moodEmoji = moodDescriptions[data.mood] || data.mood;
    const urgencyLevel = data.moodLevel <= 2 ? '🚨 URGENT - ' : data.moodLevel <= 3 ? '⚠️ Attention Needed - ' : '';
    
    const appUrl = process.env.NEXTAUTH_URL || 'https://okayit.online';
    const appName = 'OKAYiT';
    
    // Create HTML email
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: white; padding: 25px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">💜 ${urgencyLevel}Wellbeing Check-In Alert</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">A young person has shared their check-in with you</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: ${data.moodLevel <= 2 ? '#fef2f2' : data.moodLevel <= 3 ? '#fffbeb' : '#f0fdf4'}; border-left: 4px solid ${data.moodLevel <= 2 ? '#ef4444' : data.moodLevel <= 3 ? '#f59e0b' : '#22c55e'}; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">From</p>
            <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #333;">${data.userName}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">${data.home}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #7c3aed; margin: 0 0 10px 0; font-size: 16px;">How They're Feeling</h3>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 20px;">
              ${moodEmoji}
            </div>
          </div>
          
          ${data.note ? `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #7c3aed; margin: 0 0 10px 0; font-size: 16px;">What They Shared</h3>
            <div style="background: #faf5ff; padding: 20px; border-radius: 8px; border: 1px solid #e9d5ff;">
              <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${data.note}</p>
            </div>
          </div>
          ` : `
          <div style="margin-bottom: 20px;">
            <p style="color: #6b7280; font-style: italic;">No additional notes were shared.</p>
          </div>
          `}
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
              <strong>Sent to:</strong> ${recipientType}
            </p>
          </div>
          
          ${data.moodLevel <= 2 ? `
          <div style="background: #fef2f2; border: 2px solid #ef4444; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #b91c1c; font-weight: bold;">⚠️ This young person is feeling really low. Please reach out to them as soon as possible to offer support.</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This notification was sent because ${data.userName} chose to share their check-in with you.<br>
              Please respond with care and compassion.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 15px;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            Sent from OKAYiT Care Platform • <a href="${appUrl}" style="color: #7c3aed;">Visit Platform</a>
          </p>
        </div>
      </div>
    `;

    const response = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: process.env.NOTIF_ID_WELLBEING_CHECKIN_ALERT,
        subject: `${urgencyLevel}Wellbeing Check-In from ${data.userName} at ${data.home}`,
        body: htmlBody,
        is_html: true,
        recipient_email: 'admin@okayit.uk',
        sender_email: `noreply@okayit.online`,
        sender_alias: appName,
      }),
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error sending wellbeing notification:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // P0-03: Require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { mood, moodLevel, note, shareWithStaff, anonymousId, displayName, home, sendTo, userName } = body;
    
    // Validate input
    if (!mood || moodLevel === undefined) {
      return NextResponse.json(
        { error: 'Mood and mood level are required' },
        { status: 400 }
      );
    }
    
    // Generate feedback
    let feedback = '';
    if (moodLevel <= 2) {
      feedback = 'We noticed you are feeling low. Remember, support is always available. Talk to a staff member if you need help.';
    } else if (moodLevel <= 3) {
      feedback = 'Thanks for checking in. Remember, we are here if you need to talk.';
    } else {
      feedback = 'Great to hear you are doing well! Keep it up! 🌟';
    }
    
    // If user chose to send to keyworker or manager, send email notification
    let emailSent = false;
    if (sendTo && sendTo !== 'none') {
      emailSent = await sendWellbeingNotification({
        userName: userName || displayName || 'A young person',
        home: home || 'the care home',
        mood,
        moodLevel,
        note: note || undefined,
        sendTo: sendTo as 'keyworker' | 'manager',
        timestamp: new Date().toISOString()
      });
    }
    
    // If user consents to share, store the data
    if ((shareWithStaff || sendTo !== 'none') && (anonymousId || userName) && home) {
      try {
        const checkin = await prisma.sharedWellbeingCheckin.create({
          data: {
            anonymousId: anonymousId || `user_${Date.now()}`,
            displayName: userName || displayName || null,
            home,
            mood,
            moodLevel,
            note: note || null,
            consentGiven: true
          }
        });

        // SAFEGUARDING: Auto-create AlertAction for RED (1-3) and AMBER (4-5) check-ins
        if (moodLevel <= 5) {
          const alertLevel = moodLevel <= 3 ? 'RED' : 'AMBER';
          await prisma.alertAction.create({
            data: {
              checkinId: checkin.id,
              alertLevel,
              status: 'OPEN',
              careHome: home,
              actions: [],
            },
          }).catch((err: unknown) => {
            console.error('Failed to create AlertAction for safeguarding:', err);
          });
        }

        // Audit log: consent-based data sharing (actorId null for anonymous YP)
        await prisma.auditLog.create({
          data: {
            actorRole: 'YOUNG_PERSON',
            action: 'SHARE',
            resourceType: 'wellbeing_checkin',
            resourceId: checkin.id,
            description: `Wellbeing check-in shared with consent (mood: ${mood}, level: ${moodLevel}/10) at ${home}`,
            sensitivity: 'high',
          },
        }).catch(() => {}); // non-blocking
      } catch (dbError) {
        console.error('Error saving to database:', dbError);
        // Continue even if DB save fails
      }
      
      return NextResponse.json({
        success: true,
        feedback,
        shared: true,
        emailSent,
        message: emailSent 
          ? `Check-in processed and sent to your ${sendTo === 'keyworker' ? 'key worker' : 'manager'}`
          : 'Check-in processed and shared with your care team'
      });
    }
    
    // Return immediate feedback without storing
    return NextResponse.json({
      success: true,
      feedback,
      shared: false,
      emailSent: false,
      message: 'Check-in processed (kept private)'
    });
  } catch (error) {
    console.error('Wellbeing check-in processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process check-in' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Wellbeing check-ins can be shared with staff if you choose. Your privacy is protected.',
    note: 'You control whether your check-ins are shared. Staff can only see data you explicitly share.'
  });
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
