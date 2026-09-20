
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { jsPDF } from 'jspdf';

interface SupportRequest {
  resourceId: string;
  resourceTitle: string;
}

// OKAYiT Brand Colors
const BRAND_COLORS = {
  primary: '#4A3F8F',    // Purple
  secondary: '#D4A574',  // Gold  
  accent: '#E8927C',     // Warm tone
  background: '#F8F9FA',
  text: '#2C3E50'
};

function addBrandedHeader(doc: jsPDF, title: string) {
  // Add OKAYiT branding
  doc.setFillColor(BRAND_COLORS.primary);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('OKAYiT', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text(title, 105, 32, { align: 'center' });
  
  // Reset colors
  doc.setTextColor(BRAND_COLORS.text);
}

function addBrandedFooter(doc: jsPDF, pageNumber: number) {
  doc.setFillColor(BRAND_COLORS.secondary);
  doc.rect(0, 287, 210, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('OKAYiT Help & Support Center', 10, 293);
  doc.text(`Page ${pageNumber}`, 195, 293, { align: 'right' });
  doc.text('admin@okayit.uk | 0800-OKAYIT', 105, 293, { align: 'center' });
}

function addSection(doc: jsPDF, yPos: number, title: string, content: string): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, 20, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(content, 170);
  doc.text(lines, 20, yPos);
  yPos += lines.length * 6 + 10;
  
  return yPos;
}

function generateEmergencyHelp(doc: jsPDF) {
  addBrandedHeader(doc, 'Emergency Support Guide');
  
  let yPos = 55;
  
  // Emergency banner
  doc.setFillColor(255, 165, 0, 0.2);
  doc.rect(15, yPos - 5, 180, 30, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 100, 0);
  doc.text('IMMEDIATE HELP AVAILABLE 24/7', 105, yPos + 5, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Call 999 or 0800-CARE-HELP', 105, yPos + 15, { align: 'center' });
  doc.setTextColor(BRAND_COLORS.text);
  
  yPos += 40;
  
  yPos = addSection(doc, yPos, 'Call Immediately If:', 
    'You are in danger\nSomeone is hurting you\nYou are having thoughts of self-harm\nYou need police, fire, or ambulance\nYou feel unsafe or scared');
  
  yPos = addSection(doc, yPos, 'Emergency Numbers:',
    'Police/Fire/Ambulance: 999\n24/7 Care Crisis: 0800-CARE-HELP\nChildline: 0800-1111\nSamaritans: 116 123\nCrisis Text: Text SHOUT to 85258');
  
  yPos = addSection(doc, yPos, 'What to Expect:',
    'Someone will answer immediately\nThey will listen without judgment\nThey can send help to you if needed\nAll calls are confidential\nYou will be taken seriously');
  
  yPos = addSection(doc, yPos, 'Important Tips:',
    'Save these numbers in your phone right now\nIt is always okay to call - even if you are not sure\nYou do not need to handle a crisis alone\nAsking for help is brave, not weak');
  
  addBrandedFooter(doc, 1);
}

function generateGeneralInquiry(doc: jsPDF) {
  addBrandedHeader(doc, 'General Questions & Support');
  
  let yPos = 55;
  
  yPos = addSection(doc, yPos, 'How to Get Help:',
    'You can contact us anytime during office hours. We respond to all inquiries within 24 hours. For urgent matters, call us directly. For non-urgent questions, use the contact form or email.');
  
  yPos = addSection(doc, yPos, 'What We Can Help With:',
    'Questions about your care plan\nInformation about activities and services\nAdvice on education and training\nSupport with relationships and friendships\nGuidance on independent living\nHelp with paperwork and forms\nReferrals to other services');
  
  yPos = addSection(doc, yPos, 'Contact Methods:',
    'Phone: 0800-OKAYIT (Monday-Friday 9am-5pm)\nEmail: admin@okayit.uk (24 hour response)\nIn Person: Book an appointment with your key worker\nContact Form: Available on the platform');
  
  yPos = addSection(doc, yPos, 'Remember:',
    'No question is too small or silly\nWe are here to help - that is our job\nIf you are not sure who to ask, ask us\nWe can connect you with the right support');
  
  addBrandedFooter(doc, 1);
}

function generateComplaintsFeedback(doc: jsPDF) {
  addBrandedHeader(doc, 'Complaints & Feedback Guide');
  
  let yPos = 55;
  
  yPos = addSection(doc, yPos, 'Your Right to Complain:',
    'You have the right to complain about any aspect of your care. Complaints help us improve our services. You will not be treated differently for making a complaint. You can have someone support you through the process.');
  
  yPos = addSection(doc, yPos, 'How to Make a Complaint:',
    'Step 1: Talk to your key worker or any staff member you trust\nStep 2: If not resolved, make a formal complaint using the form\nStep 3: We will investigate and respond within 10 working days\nStep 4: If still unhappy, you can contact Ofsted or an advocate');
  
  yPos = addSection(doc, yPos, 'What Happens Next:',
    'We take all complaints seriously. Someone will acknowledge your complaint within 2 working days. We will investigate thoroughly and fairly. You will receive a full response in writing. We will explain what actions we will take.');
  
  yPos = addSection(doc, yPos, 'Helpful Tips:',
    'Keep a record of dates, times, and what happened\nYou can ask for an advocate to support you\nComplaints help us improve for everyone\nYou can contact Ofsted at any time: 0300-123-1231');
  
  addBrandedFooter(doc, 1);
}

function generateYourRights(doc: jsPDF) {
  addBrandedHeader(doc, 'Know Your Rights');
  
  let yPos = 55;
  
  yPos = addSection(doc, yPos, 'Your Core Rights in Care:',
    'Right to feel safe and protected\nRight to be treated with respect\nRight to privacy and confidentiality\nRight to have your voice heard\nRight to make complaints\nRight to an independent advocate\nRight to keep in touch with family and friends\nRight to education and healthcare\nRight to your cultural and religious identity\nRight to personal belongings and money');
  
  if (yPos > 200) {
    addBrandedFooter(doc, 1);
    doc.addPage();
    addBrandedHeader(doc, 'Know Your Rights');
    yPos = 55;
  }
  
  yPos = addSection(doc, yPos, 'Advocacy Services:',
    'An advocate is an independent person who supports you to have your voice heard. They can attend meetings with you, help you understand your rights, support you to make complaints, and speak up on your behalf if you want them to.');
  
  yPos = addSection(doc, yPos, 'External Support:',
    'Independent Advocacy: 0800-ADVOCATE\nCoram Voice: 0808-800-5792\nChildren Commissioner: 0800-528-0731\nOfsted: 0300-123-1231\nChildline: 0800-1111');
  
  yPos = addSection(doc, yPos, 'Remember:',
    'Keep copies of important documents about your care\nAttend your review meetings and prepare what you want to say\nDo not be afraid to disagree - your opinion matters\nYou can contact Ofsted directly if you have concerns');
  
  addBrandedFooter(doc, doc.getNumberOfPages());
}

function generateMentalHealth(doc: jsPDF) {
  addBrandedHeader(doc, 'Mental Health Resources');
  
  let yPos = 55;
  
  yPos = addSection(doc, yPos, 'When to Seek Help:',
    'Feeling sad or anxious for more than 2 weeks\nHaving trouble sleeping or eating\nFeeling overwhelmed or unable to cope\nHaving thoughts of self-harm\nFinding it hard to enjoy things you usually like\nStruggling with school or relationships');
  
  yPos = addSection(doc, yPos, 'Available Support:',
    'Your Key Worker: First point of contact\nSchool Counselor: During school hours\nGP: Can refer you to CAMHS\nCAMHS: Specialist mental health support\n24/7 Crisis Helplines: Always available');
  
  yPos = addSection(doc, yPos, 'Self-Help Strategies:',
    'Practice breathing exercises\nWrite in a journal\nExercise or move your body\nTalk to someone you trust\nListen to calming music\nPractice mindfulness\nStick to a routine\nGet enough sleep\nLimit social media');
  
  yPos = addSection(doc, yPos, 'Remember:',
    'Mental health problems are common and treatable\nIt is okay to not be okay\nTalking about it helps - you are not alone\nSmall steps forward are still progress');
  
  // Emergency contacts
  doc.setFillColor(255, 0, 0, 0.1);
  doc.rect(15, yPos, 180, 25, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('24/7 Mental Health Crisis Line:', 20, yPos + 8);
  doc.setFontSize(14);
  doc.text('0800-MIND-HELP', 20, yPos + 18);
  
  addBrandedFooter(doc, 1);
}

function generateAccommodationInfo(doc: jsPDF) {
  addBrandedHeader(doc, 'Accommodation Information');
  
  let yPos = 55;
  
  yPos = addSection(doc, yPos, 'Your Room:',
    'Your room is your personal space. You can decorate it (within reason). You are responsible for keeping it reasonably tidy. Lock your valuables in your personal safe. Report any maintenance issues promptly.');
  
  yPos = addSection(doc, yPos, 'Shared Spaces:',
    'Kitchen, living room, and garden are shared by everyone. Clean up after yourself. Respect others need for quiet. Take turns with TV and games. Ask before borrowing items.');
  
  yPos = addSection(doc, yPos, 'House Expectations:',
    'Be kind and respectful to everyone\nFollow your agreed bedtime routine\nLet staff know where you are going\nKeep the house reasonably tidy\nFollow house rules about visitors\nAttend house meetings');
  
  yPos = addSection(doc, yPos, 'Remember:',
    'This is your home - help make it a nice place for everyone\nTreat others how you want to be treated\nSpeak up if something is not working\nSmall actions make a big difference');
  
  addBrandedFooter(doc, 1);
}

function generateEducationGuide(doc: jsPDF) {
  addBrandedHeader(doc, 'Education Support Guide');
  
  let yPos = 55;
  
  yPos = addSection(doc, yPos, 'Homework Support:',
    'Dedicated study time each weekday evening. Staff can help explain assignments. Quiet space available for studying. Access to computers and internet. We can arrange tutoring if needed.');
  
  yPos = addSection(doc, yPos, 'Attendance Matters:',
    'Good attendance leads to better results. We will wake you up and help you get ready. We can talk through any barriers to attending. Let us know if you are struggling.');
  
  yPos = addSection(doc, yPos, 'Planning Your Future:',
    'We can help you explore your options. Support with college applications. Advice on apprenticeships. Help with CVs and job applications. Guidance on university pathways.');
  
  yPos = addSection(doc, yPos, 'Key Tips:',
    'Attending school regularly makes everything easier\nAsk for help early - do not wait until it is a big problem\nYour education is an investment in your future\nEveryone can succeed with the right support');
  
  addBrandedFooter(doc, 1);
}

function generateActivitiesSocial(doc: jsPDF) {
  addBrandedHeader(doc, 'Activities & Social Life');
  
  let yPos = 55;
  
  yPos = addSection(doc, yPos, 'Regular Activities:',
    'Movie nights every Friday\nSports on Wednesdays\nCooking together on Sundays\nMonthly trips out\nGames room always available\nGarden activities in summer');
  
  yPos = addSection(doc, yPos, 'Try Something New:',
    'We can help you join clubs or classes. Support with transport and costs. Try different activities until you find what you like. Meet new people with similar interests.');
  
  yPos = addSection(doc, yPos, 'Making Friends:',
    'Join activities that interest you. Be yourself. Start small conversations. Be a good listener. Give people a chance. Remember making friends takes time.');
  
  yPos = addSection(doc, yPos, 'Remember:',
    'Trying new things helps you discover what you enjoy\nIt is okay to feel shy at first - everyone does\nGood friends accept you for who you are\nActivities help you build confidence and skills');
  
  addBrandedFooter(doc, 1);
}

export async function POST(request: NextRequest) {
  try {
    // P0-03: Require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { resourceId, resourceTitle }: SupportRequest = await request.json();
    
    // Create PDF
    const doc = new jsPDF();
    
    // Generate appropriate content based on resource ID
    switch (resourceId) {
      case 'emergency-help':
        generateEmergencyHelp(doc);
        break;
      case 'general-inquiry':
        generateGeneralInquiry(doc);
        break;
      case 'complaints-feedback':
        generateComplaintsFeedback(doc);
        break;
      case 'your-rights':
        generateYourRights(doc);
        break;
      case 'mental-health':
        generateMentalHealth(doc);
        break;
      case 'accommodation-info':
        generateAccommodationInfo(doc);
        break;
      case 'education-guide':
        generateEducationGuide(doc);
        break;
      case 'activities-social':
        generateActivitiesSocial(doc);
        break;
      default:
        // Generic template
        addBrandedHeader(doc, resourceTitle);
        let yPos = 55;
        doc.setFontSize(12);
        doc.text('This resource guide is being prepared for you.', 20, yPos);
        yPos += 10;
        doc.text('For immediate support, please contact:', 20, yPos);
        yPos += 10;
        doc.text('Email: admin@okayit.uk', 20, yPos);
        yPos += 8;
        doc.text('Phone: 0800-OKAYIT', 20, yPos);
        addBrandedFooter(doc, 1);
    }
    
    // Get PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resourceId}-guide.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
