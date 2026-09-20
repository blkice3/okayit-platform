
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { jsPDF } from 'jspdf';

interface ResourceRequest {
  resourceId: string;
  resourceTitle: string;
}

// OKAYiT Brand Colors
const BRAND_COLORS = {
  primary: '#4A3F8F',    // Purple from logo
  secondary: '#D4A574',  // Gold from logo  
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
  doc.text('OKAYiT - Supporting your wellbeing and development', 10, 293);
  doc.text(`Page ${pageNumber}`, 195, 293, { align: 'right' });
  doc.text('admin@okayit.uk', 105, 293, { align: 'center' });
}

function generateWelcomePack(doc: jsPDF) {
  addBrandedHeader(doc, 'Welcome to Your New Home');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Hello and Welcome', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const welcomeText = [
    'We are so happy you are here. This is your new home, and we want you to feel',
    'comfortable, safe, and happy.',
    '',
    'In this guide, you will find:',
    '  - Information about your new home',
    '  - What to expect in your first few days',
    '  - How to ask for help when you need it',
    '  - Fun activities you can enjoy'
  ];
  
  welcomeText.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 7;
  });
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Your Room', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Your room is your personal space. You can decorate it and make it feel like home.', 20, yPos);
  
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Meeting the Team', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Our team is here to support you. Everyone is friendly and wants to help you settle in.', 20, yPos);
  
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('House Rules', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  const rules = [
    '  - Be kind and respectful to everyone',
    '  - Keep common areas tidy',
    '  - Ask before borrowing things',
    '  - Follow your daily routine',
    '  - Always tell us if something is wrong'
  ];
  
  rules.forEach(rule => {
    doc.text(rule, 20, yPos);
    yPos += 7;
  });
  
  addBrandedFooter(doc, 1);
}

function generateDailyRoutinePlanner(doc: jsPDF) {
  addBrandedHeader(doc, 'My Daily Routine Planner');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Plan Your Day', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Fill in your daily activities to stay organized and achieve your goals.', 20, yPos);
  
  yPos += 15;
  
  const timeSlots = [
    { time: '7:00 AM - 8:00 AM', activity: 'Morning Routine' },
    { time: '8:00 AM - 9:00 AM', activity: 'Breakfast' },
    { time: '9:00 AM - 12:00 PM', activity: 'School / Learning Time' },
    { time: '12:00 PM - 1:00 PM', activity: 'Lunch Break' },
    { time: '1:00 PM - 3:00 PM', activity: 'Afternoon Activities' },
    { time: '3:00 PM - 5:00 PM', activity: 'Free Time / Hobbies' },
    { time: '5:00 PM - 6:00 PM', activity: 'Dinner' },
    { time: '6:00 PM - 8:00 PM', activity: 'Evening Activities' },
    { time: '8:00 PM - 9:00 PM', activity: 'Wind Down Time' },
    { time: '9:00 PM', activity: 'Bedtime' }
  ];
  
  timeSlots.forEach((slot, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(BRAND_COLORS.background);
      doc.rect(20, yPos - 5, 170, 10, 'F');
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(slot.time, 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(slot.activity, 80, yPos);
    
    // Add space for notes
    doc.line(120, yPos + 2, 185, yPos + 2);
    
    yPos += 12;
  });
  
  addBrandedFooter(doc, 1);
}

function generateFeelingsChart(doc: jsPDF) {
  addBrandedHeader(doc, 'How Am I Feeling Today');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Check In With Your Emotions', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Circle the feeling that matches how you feel today. It is okay to feel different things.', 20, yPos);
  
  yPos += 15;
  
  const feelings = [
    { name: 'Happy', color: '#FFD700' },
    { name: 'Excited', color: '#FF6B6B' },
    { name: 'Calm', color: '#4ECDC4' },
    { name: 'Sad', color: '#95E1D3' },
    { name: 'Angry', color: '#FF8C42' },
    { name: 'Worried', color: '#A8E6CF' },
    { name: 'Tired', color: '#C7CEEA' },
    { name: 'Confused', color: '#FFB6C1' }
  ];
  
  let xPos = 20;
  let rowYPos = yPos;
  
  feelings.forEach((feeling, index) => {
    if (index % 4 === 0 && index !== 0) {
      rowYPos += 30;
      xPos = 20;
    }
    
    // Draw circle
    doc.setFillColor(feeling.color);
    doc.circle(xPos + 8, rowYPos, 8, 'F');
    
    // Add feeling name
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(feeling.name, xPos + 8, rowYPos + 18, { align: 'center' });
    
    xPos += 47;
  });
  
  yPos = rowYPos + 40;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('What made you feel this way?', 20, yPos);
  
  yPos += 10;
  for (let i = 0; i < 5; i++) {
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
  }
  
  addBrandedFooter(doc, 1);
}

function generateGoalSetting(doc: jsPDF) {
  addBrandedHeader(doc, 'My Goals and Dreams');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Dream Big and Set Your Goals', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('What do you want to achieve? Write down your goals and the steps to reach them.', 20, yPos);
  
  yPos += 20;
  
  const goalSections = [
    { title: 'My Big Dream', lines: 3 },
    { title: 'Short-Term Goals (This Month)', lines: 4 },
    { title: 'Steps I Can Take', lines: 5 },
    { title: 'Who Can Help Me', lines: 3 },
    { title: 'How Will I Know I Succeeded', lines: 3 }
  ];
  
  goalSections.forEach(section => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(section.title, 20, yPos);
    yPos += 8;
    
    for (let i = 0; i < section.lines; i++) {
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
    }
    yPos += 5;
  });
  
  addBrandedFooter(doc, 1);
}

function generateRightsGuide(doc: jsPDF) {
  addBrandedHeader(doc, 'Know Your Rights');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Rights in Care', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('You have rights that keep you safe and help you thrive. Here are your most important rights:', 20, yPos);
  
  yPos += 15;
  
  const rights = [
    {
      title: 'Right to Be Safe',
      description: 'You have the right to feel safe and protected at all times.'
    },
    {
      title: 'Right to Be Heard',
      description: 'Your opinions and feelings matter. You have the right to speak up.'
    },
    {
      title: 'Right to Privacy',
      description: 'You have the right to private time and personal space.'
    },
    {
      title: 'Right to Education',
      description: 'You have the right to learn and develop your skills.'
    },
    {
      title: 'Right to Healthcare',
      description: 'You have the right to receive medical care when you need it.'
    },
    {
      title: 'Right to Have Fun',
      description: 'You have the right to play, relax, and enjoy activities.'
    },
    {
      title: 'Right to Be Yourself',
      description: 'You have the right to be who you are and express yourself.'
    },
    {
      title: 'Right to Get Help',
      description: 'You have the right to ask for help whenever you need it.'
    }
  ];
  
  rights.forEach((right, index) => {
    if (index === 4) {
      addBrandedFooter(doc, 1);
      doc.addPage();
      addBrandedHeader(doc, 'Know Your Rights');
      yPos = 55;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${index + 1}. ${right.title}`, 20, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(right.description, 160);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 6 + 8;
  });
  
  addBrandedFooter(doc, doc.getNumberOfPages());
}

// NEW WELLBEING RESOURCES
function generateBreathingExercises(doc: jsPDF) {
  addBrandedHeader(doc, 'Calm Breathing Techniques');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Breath Is a Powerful Tool', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Your breath is always with you and can help you feel calmer in just minutes. These techniques are based on science and really work.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 10;
  
  // Box Breathing
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Box Breathing (4-4-4-4)', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const boxText = doc.splitTextToSize('Breathe IN for 4 counts, HOLD for 4, breathe OUT for 4, HOLD for 4. Repeat 5-10 times. This activates your calm response and is used by athletes and military personnel.', 170);
  doc.text(boxText, 20, yPos);
  yPos += boxText.length * 5 + 10;
  
  // 5-5 Breathing
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('5-5 Breathing', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const fiveText = doc.splitTextToSize('Breathe in slowly through your nose for 5 counts, then breathe out slowly through your mouth for 5 counts. Do this for 2 minutes. Perfect for when you feel anxious.', 170);
  doc.text(fiveText, 20, yPos);
  yPos += fiveText.length * 5 + 10;
  
  // Belly Breathing
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Belly Breathing', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const bellyText = doc.splitTextToSize('Place one hand on your chest and one on your belly. Breathe so that only your belly hand moves. This engages your diaphragm and triggers relaxation.', 170);
  doc.text(bellyText, 20, yPos);
  yPos += bellyText.length * 5 + 15;
  
  // When to Use
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('When to Use Breathing Exercises', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const whenList = [
    '- Before an exam or important event',
    '- When you feel angry or upset',
    '- Before bed to help you sleep',
    '- When you notice your heart racing',
    '- Anytime you want to feel more calm'
  ];
  whenList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.text('Top Tips:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Practice when calm so it is easier when stressed', 25, yPos + 10);
  doc.text('You cannot do it wrong - any conscious breathing helps', 25, yPos + 16);
  doc.text('Notice how your body feels before and after', 25, yPos + 22);
  
  addBrandedFooter(doc, 1);
}

function generateSleepGuide(doc: jsPDF) {
  addBrandedHeader(doc, 'Better Sleep Guide');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Get Quality Rest Every Night', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Good sleep is essential for your physical and mental health.', 20, yPos);
  yPos += 15;
  
  // Why Sleep Matters
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Why Sleep Matters', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const whyText = doc.splitTextToSize('Sleep helps your brain process emotions and memories. It strengthens your immune system. It improves concentration and mood. Teens need 8-10 hours per night.', 170);
  doc.text(whyText, 20, yPos);
  yPos += whyText.length * 5 + 10;
  
  // Creating a Sleep Routine
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Creating a Sleep Routine', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const routineList = [
    '- Go to bed at the same time each night',
    '- Stop screens 1 hour before bed',
    '- Keep your room cool, dark, and quiet',
    '- Do a calming activity before bed (reading, gentle music)',
    '- Avoid caffeine after 3pm'
  ];
  routineList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // What to Avoid
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('What to Avoid', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const avoidList = [
    '- Large meals before bed',
    '- Intense exercise close to bedtime',
    '- Stressful conversations at night',
    '- Bright lights and screens'
  ];
  avoidList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 35, 'F');
  doc.text('Sleep Tips:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('If you cannot sleep after 20 minutes, get up and do something calm', 25, yPos + 10);
  doc.text('Write down worries before bed so they do not keep you awake', 25, yPos + 16);
  doc.text('Use your bed only for sleep - not for homework or screens', 25, yPos + 22);
  doc.text('Talk to staff if sleep problems continue for more than 2 weeks', 25, yPos + 28);
  
  addBrandedFooter(doc, 1);
}

function generateMindfulnessIntro(doc: jsPDF) {
  addBrandedHeader(doc, 'Introduction to Mindfulness');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Simple Mindfulness Practices', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Mindfulness means paying attention to the present moment without judgment. It is a skill anyone can learn.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // What is Mindfulness
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('What is Mindfulness?', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const whatText = doc.splitTextToSize('Mindfulness is being aware of where you are and what you are doing, without being overwhelmed by what is going on around you. It is not about stopping your thoughts - it is about noticing them without getting caught up in them.', 170);
  doc.text(whatText, 20, yPos);
  yPos += whatText.length * 5 + 10;
  
  // One-Minute Mindfulness
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('One-Minute Mindfulness Exercise', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const oneMinList = [
    '1. Sit comfortably',
    '2. Close your eyes or look down',
    '3. Notice your breath - where do you feel it?',
    '4. When your mind wanders (it will!), gently bring attention back',
    '5. That is it! You are being mindful'
  ];
  oneMinList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // 5-4-3-2-1 Grounding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('5-4-3-2-1 Grounding Technique', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Name: 5 things you SEE, 4 you TOUCH, 3 you HEAR,', 25, yPos);
  yPos += 6;
  doc.text('2 you SMELL, 1 you TASTE', 25, yPos);
  yPos += 6;
  doc.text('This brings you into the present moment.', 25, yPos);
  yPos += 15;
  
  // Tips box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.text('Remember:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Start with just 1 minute per day', 25, yPos + 10);
  doc.text('There is no way to do it wrong', 25, yPos + 16);
  doc.text('Your mind will wander - that is normal and okay', 25, yPos + 22);
  
  addBrandedFooter(doc, 1);
}

// MENTAL HEALTH RESOURCES
function generateAnxietyManagement(doc: jsPDF) {
  addBrandedHeader(doc, 'Managing Anxiety and Worry');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Practical Tools for When Worry Feels Overwhelming', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Anxiety is your body trying to protect you, but sometimes it overreacts. These tools can help you feel more in control.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // Understanding Anxiety
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Understanding Anxiety', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Physical symptoms: racing heart, sweaty palms, tight chest, stomach upset', 20, yPos);
  yPos += 6;
  doc.text('Mental symptoms: racing thoughts, difficulty concentrating, expecting worst', 20, yPos);
  yPos += 6;
  doc.text('Good news: Anxiety is treatable and manageable!', 20, yPos);
  yPos += 15;
  
  // Immediate Relief Techniques
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Immediate Relief Techniques', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const reliefList = [
    '- Deep breathing (4-4-4-4)',
    '- Cold water on face or ice cube',
    '- Ground yourself (5-4-3-2-1)',
    '- Move your body - walk, stretch, dance',
    '- Talk to someone',
    '- Challenge worried thoughts'
  ];
  reliefList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // Worry Time Technique
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Worry Time Technique', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const worryText = doc.splitTextToSize('Set aside 15 minutes per day as "worry time." When anxious thoughts come up during the day, tell yourself "I will think about this during worry time." This helps contain worry instead of it taking over your whole day.', 170);
  doc.text(worryText, 20, yPos);
  yPos += worryText.length * 5 + 15;
  
  // When to Get Help
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('When to Get Help', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const helpList = [
    '- If anxiety interferes with school or relationships',
    '- If you avoid things you used to enjoy',
    '- If physical symptoms are frequent',
    '- If worry is constant'
  ];
  helpList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  
  // New page for contacts
  addBrandedFooter(doc, 1);
  doc.addPage();
  addBrandedHeader(doc, 'Managing Anxiety and Worry');
  yPos = 55;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Emergency Contacts', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('YoungMinds Crisis Messenger', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('Text YM to 85258 - 24/7 mental health text support', 20, yPos + 6);
  yPos += 18;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Anxiety UK', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('03444 775 774 - Helpline for anxiety support', 20, yPos + 6);
  yPos += 18;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Your Key Worker', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('Available during the day', 20, yPos + 6);
  
  addBrandedFooter(doc, 2);
}

function generateDepressionSupport(doc: jsPDF) {
  addBrandedHeader(doc, 'Understanding Low Mood and Depression');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Information and Support', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Depression is more than just feeling sad. It is a real medical condition that affects how you think, feel, and function. It is treatable.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // Signs of Depression
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Signs of Depression', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const signsList = [
    '- Persistent sad or empty mood',
    '- Loss of interest in things you used to enjoy',
    '- Changes in sleep (too much or too little)',
    '- Changes in appetite',
    '- Feeling tired all the time',
    '- Difficulty concentrating',
    '- Feelings of worthlessness or hopelessness',
    '- Thoughts of death or suicide'
  ];
  signsList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 8;
  doc.setFont('helvetica', 'italic');
  doc.text('If you have several of these for more than 2 weeks, talk to someone.', 20, yPos);
  yPos += 15;
  
  // What Helps
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('What Helps', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const helpsList = [
    '- Talk to a professional - depression responds well to treatment',
    '- Stay connected to people even when you do not feel like it',
    '- Stick to a routine',
    '- Get some physical activity (even a short walk helps)',
    '- Eat regular meals',
    '- Be patient with yourself - recovery takes time'
  ];
  helpsList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 3;
  });
  
  // New page for emergency contacts
  addBrandedFooter(doc, 1);
  doc.addPage();
  addBrandedHeader(doc, 'Understanding Low Mood and Depression');
  yPos = 55;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setFillColor(255, 200, 200);
  doc.rect(20, yPos - 5, 170, 20, 'F');
  doc.text('CRISIS SUPPORT - IF YOU ARE THINKING ABOUT SUICIDE', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('TELL SOMEONE NOW - Call 999 or Text SHOUT to 85258', 25, yPos + 10);
  yPos += 30;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Emergency Contacts', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Crisis Text Line', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('Text SHOUT to 85258 - Free 24/7 text support', 20, yPos + 6);
  yPos += 18;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Childline', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('0800 1111 - Confidential support for young people', 20, yPos + 6);
  yPos += 18;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Samaritans', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('116 123 - 24/7 listening service', 20, yPos + 6);
  yPos += 25;
  
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 25, 'F');
  doc.text('Remember:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Depression is not weakness - it is an illness', 25, yPos + 10);
  doc.text('You deserve help and support', 25, yPos + 16);
  
  addBrandedFooter(doc, 2);
}

function generateTraumaHealing(doc: jsPDF) {
  addBrandedHeader(doc, 'Healing from Difficult Experiences');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Gentle Guidance for Processing Trauma', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('If you have been through difficult or traumatic experiences, healing is possible. You are not defined by what happened to you.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // What is Trauma
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('What is Trauma?', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const traumaText = doc.splitTextToSize('Trauma is your emotional response to a terrible event like an accident, abuse, neglect, loss, or violence. Trauma can affect how you think, feel, and behave. It is a normal response to abnormal events.', 170);
  doc.text(traumaText, 20, yPos);
  yPos += traumaText.length * 5 + 10;
  
  // Common Trauma Responses
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Common Trauma Responses', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const responsesList = [
    '- Flashbacks or nightmares',
    '- Feeling numb or disconnected',
    '- Being easily startled',
    '- Difficulty trusting people',
    '- Anger or irritability',
    '- Guilt or shame',
    '- Avoiding reminders of the event'
  ];
  responsesList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 8;
  doc.setFont('helvetica', 'italic');
  doc.text('These are normal survival responses.', 20, yPos);
  yPos += 15;
  
  // Grounding When Triggered
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Grounding When Triggered', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const groundText = doc.splitTextToSize('If you feel overwhelmed or flashback: Notice 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste. Splash cold water on your face. Remind yourself: "That was then, this is now, I am safe here."', 170);
  doc.text(groundText, 20, yPos);
  yPos += groundText.length * 5 + 15;
  
  // Support box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.text('Remember:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('What happened to you is not your fault', 25, yPos + 10);
  doc.text('Healing is possible - your brain can rewire itself', 25, yPos + 16);
  doc.text('You are incredibly strong for surviving', 25, yPos + 22);
  
  // New page for contacts
  addBrandedFooter(doc, 1);
  doc.addPage();
  addBrandedHeader(doc, 'Healing from Difficult Experiences');
  yPos = 55;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Support Contacts', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('NSPCC', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('0800 1111 - Support for children and young people', 20, yPos + 6);
  yPos += 18;
  
  doc.setFont('helvetica', 'bold');
  doc.text('The Survivors Trust', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('08088 010 818 - Support for survivors of trauma and abuse', 20, yPos + 6);
  yPos += 18;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Victim Support', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('08 08 16 89 111 - Free and confidential support', 20, yPos + 6);
  
  addBrandedFooter(doc, 2);
}

// LIFE SKILLS RESOURCES
function generateMoneyBasics(doc: jsPDF) {
  addBrandedHeader(doc, 'Money Management Basics');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Essential Financial Skills for Independent Living', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Learning to manage money is an essential life skill.', 20, yPos);
  yPos += 15;
  
  // Budgeting Basics
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Budgeting Basics', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Income (money coming in): allowance, job earnings, benefits', 20, yPos);
  yPos += 6;
  doc.text('Expenses (money going out): essentials (food, transport) + wants (entertainment)', 20, yPos);
  yPos += 6;
  doc.text('The rule: Income should be greater than expenses', 20, yPos);
  yPos += 15;
  
  // 50-30-20 Rule
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('The 50-30-20 Rule', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('50% for NEEDS (essentials you must have)', 25, yPos);
  yPos += 6;
  doc.text('30% for WANTS (things you enjoy but do not need)', 25, yPos);
  yPos += 6;
  doc.text('20% for SAVINGS (building your future)', 25, yPos);
  yPos += 15;
  
  // Saving Strategies
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Saving Strategies', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const savingList = [
    '- Pay yourself first - save before you spend',
    '- Start small - even £5/week adds up',
    '- Use a separate savings account',
    '- Save for specific goals (phone, laptop, future flat)',
    '- Emergency fund: try to save £50-100 for unexpected expenses'
  ];
  savingList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 3;
  });
  
  yPos += 10;
  
  // Avoiding Money Problems
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Avoiding Money Problems', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const avoidList = [
    '- Only spend what you have - avoid debt when young',
    '- Watch out for "must have" marketing tricks',
    '- Wait 24 hours before buying non-essentials',
    '- Compare prices',
    '- Ask: Do I need this or want this?'
  ];
  avoidList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 3;
  });
  
  // New page for tips
  addBrandedFooter(doc, 1);
  doc.addPage();
  addBrandedHeader(doc, 'Money Management Basics');
  yPos = 55;
  
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 35, 'F');
  doc.text('Money Tips:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Financial mistakes are learning opportunities', 25, yPos + 10);
  doc.text('Saving feels hard at first but gets easier with practice', 25, yPos + 16);
  doc.text('Talk to staff about money - they can help you learn', 25, yPos + 22);
  doc.text('Building good money habits now sets you up for life', 25, yPos + 28);
  
  addBrandedFooter(doc, 2);
}

function generateCookingBasics(doc: jsPDF) {
  addBrandedHeader(doc, 'Simple Cooking and Nutrition');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Learn to Prepare Healthy, Affordable Meals', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Cooking is an essential skill for independent living. You do not need to be a chef - just learn a few basic, healthy meals.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // Kitchen Safety
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Kitchen Safety First', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const safetyList = [
    '- Always wash hands before cooking',
    '- Keep raw meat separate from other foods',
    '- Use different chopping boards for meat and vegetables',
    '- Turn pan handles inward',
    '- Never leave cooking food unattended',
    '- Know how to use a fire extinguisher'
  ];
  safetyList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 10;
  
  // Five Meals Everyone Should Know
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Five Meals Everyone Should Know', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const mealsList = [
    '1. Pasta with tomato sauce and vegetables',
    '2. Scrambled eggs on toast',
    '3. Chicken and rice',
    '4. Bean chili or curry',
    '5. Jacket potato with tuna/beans/cheese'
  ];
  mealsList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 8;
  doc.text('Master these and you will never go hungry!', 20, yPos);
  yPos += 15;
  
  // Budget-Friendly Shopping
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Budget-Friendly Shopping', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const shopList = [
    '- Make a list before shopping',
    '- Buy store brands - often same quality, lower price',
    '- Buy frozen vegetables - just as nutritious, less waste',
    '- Plan meals for the week',
    '- Cook bigger portions and freeze leftovers',
    '- Check reduced sections for deals'
  ];
  shopList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 3;
  });
  
  // New page for nutrition
  addBrandedFooter(doc, 1);
  doc.addPage();
  addBrandedHeader(doc, 'Simple Cooking and Nutrition');
  yPos = 55;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Nutrition Basics', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const nutritionText = doc.splitTextToSize('Aim for balanced meals: Protein (meat, fish, eggs, beans), Carbs (rice, pasta, bread, potatoes), Vegetables (fill half your plate). Drink water, not sugary drinks. Eat breakfast - your brain needs fuel. Limit processed foods high in sugar, salt, and fat.', 170);
  doc.text(nutritionText, 20, yPos);
  yPos += nutritionText.length * 5 + 15;
  
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.text('Top Tips:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Start with simple recipes and build confidence', 25, yPos + 10);
  doc.text('Cooking together with housemates can be fun and save money', 25, yPos + 16);
  doc.text('Keep basic staples: rice, pasta, tinned tomatoes, beans, eggs', 25, yPos + 22);
  
  addBrandedFooter(doc, 2);
}

function generateJobReadiness(doc: jsPDF) {
  addBrandedHeader(doc, 'Getting Ready for Work');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CV Writing, Interviews, and Workplace Skills', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Getting your first job is exciting! These skills will help you succeed.', 20, yPos);
  yPos += 15;
  
  // Creating a CV
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Creating a CV', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const cvList = [
    'Personal details: name, phone, email (professional)',
    'Personal statement: 2-3 sentences about who you are',
    'Education: schools attended, qualifications',
    'Experience: jobs, volunteering, responsibilities',
    'Skills: communication, teamwork, IT, languages',
    'References: teachers, youth workers (ask permission first)'
  ];
  cvList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 3;
  });
  yPos += 10;
  
  // Job Search Tips
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Job Search Tips', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const searchList = [
    '- Start with entry-level positions',
    '- Look at: supermarkets, cafes, restaurants, retail',
    '- Use: Indeed, Reed, local job centers, company websites',
    '- Apply in person - shows initiative',
    '- Follow up a few days after applying'
  ];
  searchList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 3;
  });
  
  // New page for interview and workplace skills
  addBrandedFooter(doc, 1);
  doc.addPage();
  addBrandedHeader(doc, 'Getting Ready for Work');
  yPos = 55;
  
  // Interview Success
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Interview Success', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const interviewList = [
    '- Research the company beforehand',
    '- Arrive 10 minutes early',
    '- Dress smartly (clean, ironed clothes)',
    '- Make eye contact and smile',
    '- Prepare answers to: Tell me about yourself',
    '  Why do you want this job?',
    '  What are your strengths/weaknesses?'
  ];
  interviewList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 10;
  
  // Workplace Skills
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Workplace Skills', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const workplaceList = [
    '- Punctuality: arrive on time, every time',
    '- Reliability: do what you say you will do',
    '- Communication: ask if you do not understand',
    '- Teamwork: help colleagues when you can',
    '- Professionalism: phones away, focus on work',
    '- Positive attitude: be pleasant even on hard days'
  ];
  workplaceList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 3;
  });
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 25, 'F');
  doc.text('Remember:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Everyone feels nervous at interviews - it is normal', 25, yPos + 10);
  doc.text('Rejection is part of job searching - keep trying', 25, yPos + 16);
  
  addBrandedFooter(doc, 2);
}

// EDUCATION RESOURCES
function generateStudySkills(doc: jsPDF) {
  addBrandedHeader(doc, 'Effective Study Techniques');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Learn How to Study Smarter, Not Harder', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Good study skills can make learning easier and more enjoyable. These techniques are based on research about how the brain learns best.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // Active Learning Methods
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Active Learning Methods', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Do not just read passively. Instead:', 20, yPos);
  yPos += 8;
  const activeList = [
    '- Summarize in your own words',
    '- Teach someone else',
    '- Create flashcards',
    '- Practice problems',
    '- Draw diagrams or mind maps',
    '- Test yourself regularly'
  ];
  activeList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 8;
  doc.text('Active methods work better than just reading and highlighting.', 20, yPos);
  yPos += 15;
  
  // The Pomodoro Technique
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('The Pomodoro Technique', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('1. Study for 25 minutes with full focus', 25, yPos);
  yPos += 6;
  doc.text('2. Take a 5-minute break', 25, yPos);
  yPos += 6;
  doc.text('3. After 4 sessions, take a longer 15-30 minute break', 25, yPos);
  yPos += 8;
  doc.text('This keeps your brain fresh and prevents burnout.', 20, yPos);
  yPos += 15;
  
  // Creating a Study Space
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Creating a Study Space', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const spaceList = [
    '- Find a quiet place with good lighting',
    '- Keep it tidy and organized',
    '- Remove distractions (phone, TV)',
    '- Have all materials ready before you start',
    '- Use the same space regularly'
  ];
  spaceList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  
  // New page
  addBrandedFooter(doc, 1);
  doc.addPage();
  addBrandedHeader(doc, 'Effective Study Techniques');
  yPos = 55;
  
  // Memory Techniques
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Memory Techniques', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const memoryList = [
    '- Spaced repetition: review material over increasing intervals',
    '- Mnemonics: create memorable phrases or images',
    '- Chunking: break information into smaller pieces',
    '- Sleep: memory consolidation happens during sleep',
    '- Understanding beats memorization'
  ];
  memoryList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 3;
  });
  yPos += 10;
  
  // Before Exams
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Before Exams', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const examList = [
    '- Start revising early - cramming does not work',
    '- Practice past papers under timed conditions',
    '- Get enough sleep',
    '- Eat breakfast on exam day',
    '- Stay hydrated',
    '- Arrive early to feel calm',
    '- Read questions carefully',
    '- Start with questions you know'
  ];
  examList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 3;
  });
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 25, 'F');
  doc.text('Study Tips:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Everyone learns differently - experiment to find what works', 25, yPos + 10);
  doc.text('Mistakes help you learn - do not be afraid to get things wrong', 25, yPos + 16);
  
  addBrandedFooter(doc, 2);
}

function generateAchievementTracker(doc: jsPDF) {
  addBrandedHeader(doc, 'My Achievement Tracker');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Track Your Progress and Celebrate Your Wins', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Every achievement matters, no matter how small. Use this tracker to recognize your growth and celebrate your successes.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Achievement Categories', 20, yPos);
  yPos += 10;
  
  const categories = [
    { name: 'School/Learning', examples: 'Completing homework, improving grades, learning new skills' },
    { name: 'Personal Growth', examples: 'Overcoming fears, building confidence, developing resilience' },
    { name: 'Relationships', examples: 'Making friends, resolving conflicts, helping others' },
    { name: 'Health/Wellbeing', examples: 'Exercise routine, healthy eating, managing stress' },
    { name: 'Life Skills', examples: 'Cooking a new meal, budgeting, job applications' },
    { name: 'Creativity', examples: 'Art projects, music, writing, problem-solving' }
  ];
  
  categories.forEach(cat => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(cat.name, 25, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const exText = doc.splitTextToSize(`Examples: ${cat.examples}`, 165);
    doc.text(exText, 25, yPos);
    yPos += exText.length * 5 + 8;
  });
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 40, 'F');
  doc.text('Why Track Achievements?', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('- Builds self-confidence and self-esteem', 25, yPos + 10);
  doc.text('- Shows you how far you have come', 25, yPos + 16);
  doc.text('- Provides motivation on difficult days', 25, yPos + 22);
  doc.text('- Helps you recognize patterns of success', 25, yPos + 28);
  doc.text('- Celebrates your unique journey', 25, yPos + 34);
  
  addBrandedFooter(doc, 1);
}

// APP & MULTIMEDIA RESOURCES
function generateHeadspaceApp(doc: jsPDF) {
  addBrandedHeader(doc, 'Headspace - Meditation App');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Guided Meditation for Better Mental Health', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Headspace offers guided meditation sessions designed for young people.', 20, yPos);
  yPos += 15;
  
  // What is Headspace
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('What is Headspace?', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const whatText = doc.splitTextToSize('Headspace is an app that teaches meditation and mindfulness. It has special programs for stress, anxiety, sleep, and focus.', 170);
  doc.text(whatText, 20, yPos);
  yPos += whatText.length * 5 + 15;
  
  // How to Use It
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('How to Use It', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const howList = [
    '1. Download the app from App Store or Google Play',
    '2. Start with the basics course (10 minutes per day)',
    '3. Try different topics like stress, sleep, or focus',
    '4. Use it daily for best results'
  ];
  howList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 15;
  
  // Free vs Paid
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Free vs Paid', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Free: Basic meditation courses and some sleep sounds', 20, yPos);
  yPos += 6;
  doc.text('Paid (£12.99/month): Full library, sleep sounds, specialized courses', 20, yPos);
  yPos += 6;
  doc.text('Student discount available', 20, yPos);
  yPos += 20;
  
  // Tips
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.text('Top Tips:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Start with just 5 minutes per day', 25, yPos + 10);
  doc.text('Use the sleep sounds at bedtime', 25, yPos + 16);
  doc.text('Try the SOS exercises when feeling overwhelmed', 25, yPos + 22);
  
  yPos += 45;
  
  // Download link
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setFillColor(BRAND_COLORS.primary);
  doc.rect(20, yPos - 5, 170, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Download: www.headspace.com', 105, yPos + 4, { align: 'center' });
  doc.setTextColor(BRAND_COLORS.text);
  
  addBrandedFooter(doc, 1);
}

function generateCalmApp(doc: jsPDF) {
  addBrandedHeader(doc, 'Calm - Sleep & Meditation');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Relaxation App for Better Sleep and Stress Relief', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Calm helps you sleep better, reduce stress, and feel more relaxed.', 20, yPos);
  yPos += 15;
  
  // Key Features
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Key Features', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const featuresList = [
    'Sleep Stories: Bedtime stories read by soothing voices',
    'Meditation: Guided sessions from 3-25 minutes',
    'Music: Relaxing soundscapes',
    'Breathing: Guided breathing exercises',
    'Masterclasses: Learn about mindfulness, stress, and anxiety'
  ];
  featuresList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  // Best For
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Best For', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const bestList = [
    '- Trouble falling asleep',
    '- Feeling anxious or stressed',
    '- Need to relax and unwind',
    '- Want to learn meditation',
    '- Improve focus and concentration'
  ];
  bestList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 15;
  
  // Tips
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.text('Top Tips:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Listen to sleep stories at bedtime', 25, yPos + 10);
  doc.text('Use the 7-day trial before subscribing', 25, yPos + 16);
  doc.text('Try different meditation teachers to find your favorite', 25, yPos + 22);
  
  yPos += 45;
  
  // Download link
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setFillColor(BRAND_COLORS.primary);
  doc.rect(20, yPos - 5, 170, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Download: www.calm.com', 105, yPos + 4, { align: 'center' });
  doc.setTextColor(BRAND_COLORS.text);
  
  addBrandedFooter(doc, 1);
}

function generateKhanAcademy(doc: jsPDF) {
  addBrandedHeader(doc, 'Khan Academy - Free Learning');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Free Online Courses in Math, Science, and More', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Khan Academy offers completely free education for anyone, anywhere.', 20, yPos);
  yPos += 15;
  
  // What You Can Learn
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('What You Can Learn', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const subjectsList = [
    'Math: From basic arithmetic to calculus',
    'Science: Biology, chemistry, physics',
    'Computing: Programming, computer science',
    'Arts & Humanities: History, grammar, art history',
    'Test Prep: SAT, LSAT, MCAT prep',
    'Life Skills: Financial literacy, college admissions'
  ];
  subjectsList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  // How It Works
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('How It Works', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const howList = [
    '1. Create a free account',
    '2. Choose your subjects and grade level',
    '3. Watch video lessons at your own pace',
    '4. Practice with interactive exercises',
    '5. Earn points and badges for learning',
    '6. Track your progress on the dashboard'
  ];
  howList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 15;
  
  // Tips
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.text('Top Tips:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Set a daily learning goal (even 15 minutes helps)', 25, yPos + 10);
  doc.text('Watch videos at 1.5x speed once you understand basics', 25, yPos + 16);
  doc.text('Use practice exercises to reinforce learning', 25, yPos + 22);
  
  yPos += 45;
  
  // Website link
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setFillColor(BRAND_COLORS.primary);
  doc.rect(20, yPos - 5, 170, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Visit: www.khanacademy.org', 105, yPos + 4, { align: 'center' });
  doc.setTextColor(BRAND_COLORS.text);
  
  addBrandedFooter(doc, 1);
}

function generateBBCBitesize(doc: jsPDF) {
  addBrandedHeader(doc, 'BBC Bitesize - UK Curriculum');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Free Revision Resources Aligned with UK Schools', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('BBC Bitesize provides free educational resources for all UK school levels.', 20, yPos);
  yPos += 15;
  
  // What Is Available
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('What Is Available', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('All subjects: Math, English, Science, History, Geography, Languages', 20, yPos);
  yPos += 6;
  doc.text('All levels: KS1, KS2, KS3, GCSE, A-Level', 20, yPos);
  yPos += 6;
  doc.text('All exam boards: AQA, Edexcel, OCR, WJEC, SQA', 20, yPos);
  yPos += 6;
  doc.text('Format: Videos, quizzes, and study guides', 20, yPos);
  yPos += 15;
  
  // How to Use for Revision
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('How to Use for Revision', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const howList = [
    '1. Find your subject and exam board',
    '2. Watch video lessons on topics you find difficult',
    '3. Read the revision guides',
    '4. Do practice questions',
    '5. Use the quizzes to test yourself'
  ];
  howList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 15;
  
  // Tips
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.text('Top Tips:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Bookmark topics you need to review', 25, yPos + 10);
  doc.text('Use it alongside your school textbooks', 25, yPos + 16);
  doc.text('Practice questions show what examiners want', 25, yPos + 22);
  
  yPos += 45;
  
  // Website link
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setFillColor(BRAND_COLORS.primary);
  doc.rect(20, yPos - 5, 170, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Visit: www.bbc.co.uk/bitesize', 105, yPos + 4, { align: 'center' });
  doc.setTextColor(BRAND_COLORS.text);
  
  addBrandedFooter(doc, 1);
}

function generateInstagramSafety(doc: jsPDF) {
  addBrandedHeader(doc, 'Instagram Safety Guide');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Stay Safe on Instagram', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Learn how to use Instagram safely and protect yourself online.', 20, yPos);
  yPos += 15;
  
  // Privacy Settings
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Privacy Settings', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const privacyList = [
    'Make account private: Settings > Privacy > Private Account',
    'Control comments: Settings > Privacy > Comments',
    'Hide your story: Settings > Privacy > Story',
    'Limit who can message you: Settings > Privacy > Messages'
  ];
  privacyList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  // Reporting & Blocking
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Reporting & Blocking', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('To report: Tap three dots on a post/profile > Report', 25, yPos);
  yPos += 6;
  doc.text('To block: Tap three dots on profile > Block', 25, yPos);
  yPos += 6;
  doc.text('Report bullying, harassment, or inappropriate content', 25, yPos);
  yPos += 15;
  
  // Healthy Usage Tips
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Healthy Usage Tips', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const healthyList = [
    '- Set daily time limits in Settings',
    '- Turn off notifications at night',
    '- Unfollow accounts that make you feel bad',
    '- Remember: people only post their best moments'
  ];
  healthyList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 3;
  });
  yPos += 15;
  
  // Safety tips box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.text('Safety First:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Never share your password with anyone', 25, yPos + 10);
  doc.text('Do not accept DMs from strangers', 25, yPos + 16);
  doc.text('Be careful what you post - it can be screenshotted', 25, yPos + 22);
  
  addBrandedFooter(doc, 1);
}

function generateTikTokSafety(doc: jsPDF) {
  addBrandedHeader(doc, 'TikTok Safety & Privacy');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Use TikTok Safely', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('TikTok can be fun, but it is important to stay safe and protect your privacy.', 20, yPos);
  yPos += 15;
  
  // Make Account Private
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Make Your Account Private', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Go to Settings and Privacy > Privacy', 25, yPos);
  yPos += 6;
  doc.text('Turn on Private Account', 25, yPos);
  yPos += 6;
  doc.text('This means only approved followers can see your videos', 25, yPos);
  yPos += 15;
  
  // Control Who Can Interact
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Control Who Can Interact', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Comments: Choose Everyone, Friends, or Nobody', 25, yPos);
  yPos += 6;
  doc.text('Duets & Stitch: Control who can use your videos', 25, yPos);
  yPos += 6;
  doc.text('Messages: Choose Friends or Nobody', 25, yPos);
  yPos += 15;
  
  // Red Flags
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Red Flags to Watch For', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const redFlagsList = [
    '- Adults asking to chat privately',
    '- Requests for personal information',
    '- Inappropriate comments or messages',
    '- Challenges that could be dangerous'
  ];
  redFlagsList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 3;
  });
  yPos += 15;
  
  // Safety tips box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.text('Stay Safe:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Never share personal info in videos', 25, yPos + 10);
  doc.text('Report and block accounts that make you uncomfortable', 25, yPos + 16);
  doc.text('Tell a trusted adult if something worries you', 25, yPos + 22);
  
  addBrandedFooter(doc, 1);
}

function generateYoutubeLearning(doc: jsPDF) {
  addBrandedHeader(doc, 'YouTube Learning Channels');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Best Educational YouTube Channels', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('YouTube has thousands of channels where you can learn new skills for free.', 20, yPos);
  yPos += 15;
  
  // Educational Channels
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Educational Channels', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const eduList = [
    'Crash Course: Fast-paced lessons on science, history, literature',
    'TED-Ed: Animated lessons on various topics',
    'Khan Academy: Detailed tutorials',
    'Kurzgesagt: Science videos with amazing animation',
    'SciShow: Science news and explanations'
  ];
  eduList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  // Creative & Hobby Channels
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Creative & Hobby Channels', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const creativeList = [
    'Art: Draw with Jazza, Moriah Elizabeth',
    'Music: Andrew Huang, David Bennett Piano',
    'Cooking: Binging with Babish, Tasty',
    'DIY & Crafts: 5-Minute Crafts, Mr Kate'
  ];
  creativeList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 15;
  
  // Tips box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.text('Top Tips:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Subscribe to channels you love', 25, yPos + 10);
  doc.text('Create playlists to organize videos by topic', 25, yPos + 16);
  doc.text('Watch at 1.5x or 2x speed to learn faster', 25, yPos + 22);
  
  yPos += 45;
  
  // Website link
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setFillColor(BRAND_COLORS.primary);
  doc.rect(20, yPos - 5, 170, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Visit: www.youtube.com/learning', 105, yPos + 4, { align: 'center' });
  doc.setTextColor(BRAND_COLORS.text);
  
  addBrandedFooter(doc, 1);
}

function generateSpotifyWellbeing(doc: jsPDF) {
  addBrandedHeader(doc, 'Spotify Wellbeing Playlists');
  
  let yPos = 55;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Curated Playlists for Relaxation and Focus', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Music can significantly improve your mood and mental health. Spotify has specialized playlists for every situation.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // Wellbeing Playlists
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Wellbeing Playlists to Search For', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const playlistsList = [
    'Peaceful Piano - Calming piano music',
    'Deep Focus - Ambient music for concentration',
    'Chill Vibes - Relaxing background music',
    'Sleep - Soothing sounds for bedtime',
    'Confidence Boost - Uplifting tracks',
    'Calm Meditation - Music for meditation'
  ];
  playlistsList.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  // How Music Helps
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('How Music Helps', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const helpsList = [
    '- Reduces stress and anxiety',
    '- Improves focus and productivity',
    '- Boosts mood and motivation',
    '- Helps you sleep better',
    '- Provides emotional release',
    '- Creates positive associations'
  ];
  helpsList.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 15;
  
  // Tips box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 25, 'F');
  doc.text('Spotify Tips:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Free Spotify has ads - Premium has student discount', 25, yPos + 10);
  doc.text('Download playlists for offline listening', 25, yPos + 16);
  
  yPos += 40;
  
  // Website link
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setFillColor(BRAND_COLORS.primary);
  doc.rect(20, yPos - 5, 170, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Visit: www.spotify.com', 105, yPos + 4, { align: 'center' });
  doc.setTextColor(BRAND_COLORS.text);
  
  addBrandedFooter(doc, 1);
}

// NEW COMPREHENSIVE RESOURCE PDF GENERATORS

function generateEmotionalRegulationToolkit(doc: jsPDF) {
  addBrandedHeader(doc, 'Emotional Regulation Toolkit');
  
  let yPos = 55;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Emotions are a normal and important part of life. This toolkit will help you recognize, understand, and manage your emotions in healthy ways.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // The Emotion Wheel
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('The Emotion Wheel', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const emotionText = doc.splitTextToSize('Primary Emotions: Happy (joyful, excited, content, proud), Sad (disappointed, lonely, hurt, grief), Angry (frustrated, irritated, furious, annoyed), Scared (anxious, worried, terrified, nervous), Surprised (amazed, confused, startled), Disgusted (revolted, disappointed, ashamed). Learn to identify what you\'re feeling by understanding these core emotions and their variations.', 170);
  doc.text(emotionText, 20, yPos);
  yPos += emotionText.length * 5 + 15;
  
  // Coping Strategies
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Coping Strategies Toolbox', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('When feeling overwhelmed:', 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const overwhelmedStrategies = [
    '• Deep breathing (4-7-8 technique)',
    '• Progressive muscle relaxation',
    '• Grounding exercises (5-4-3-2-1 method)',
    '• Safe space visualization'
  ];
  overwhelmedStrategies.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 5;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('When feeling angry:', 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const angryStrategies = [
    '• Physical exercise or movement',
    '• Punch a pillow or scream into it',
    '• Write in a journal',
    '• Talk to someone you trust',
    '• Count to 10 (or 100)'
  ];
  angryStrategies.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 5;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('When feeling sad:', 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const sadStrategies = [
    '• Allow yourself to cry',
    '• Listen to music that matches your mood',
    '• Do something creative',
    '• Reach out to friends or support people',
    '• Practice self-care activities'
  ];
  sadStrategies.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 5;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('When feeling anxious:', 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const anxiousStrategies = [
    '• Focus on your breathing',
    '• Challenge negative thoughts',
    '• Do a calming activity (drawing, music)',
    '• Ground yourself in the present moment',
    '• Talk through your worries'
  ];
  anxiousStrategies.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  
  // Add new page
  doc.addPage();
  yPos = 40;
  
  // Mindfulness Exercises
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Mindfulness Exercises', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('5-4-3-2-1 Grounding:', 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const groundingSteps = [
    '• 5 things you can see',
    '• 4 things you can touch',
    '• 3 things you can hear',
    '• 2 things you can smell',
    '• 1 thing you can taste'
  ];
  groundingSteps.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Body Scan:', 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const bodyScanSteps = [
    '• Sit or lie comfortably',
    '• Focus on each part of your body',
    '• Notice any tension or sensations',
    '• Breathe into areas that feel tight'
  ];
  bodyScanSteps.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 15;
  
  // Tips box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 28, 'F');
  doc.text('Important Tips:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('• Name your feeling - this helps reduce its intensity', 25, yPos + 10);
  doc.text('• Remember feelings come and go like waves', 25, yPos + 16);
  doc.text('• Your feelings are valid even if others don\'t understand', 25, yPos + 22);
  yPos += 40;
  
  // Crisis Support
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Crisis Support', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Childline: 0800 1111 (Free confidential helpline)', 25, yPos);
  yPos += 6;
  doc.text('Shout Crisis Text Line: Text SHOUT to 85258 (24/7 support)', 25, yPos);
  
  addBrandedFooter(doc, 1);
  addBrandedFooter(doc, 2);
}

function generateHealthyRelationshipsGuide(doc: jsPDF) {
  addBrandedHeader(doc, 'Healthy Relationships Guide');
  
  let yPos = 55;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Healthy relationships involve respect, trust and consideration for each other. This guide helps you understand what makes relationships healthy or unhealthy.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // Types of Relationships
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Types of Relationships', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const relationshipTypes = [
    '• Family members (mums, dads, grandparents, siblings)',
    '• Friends (peers at school, people your age)',
    '• Romantic partners (boyfriends, girlfriends)',
    '• Acquaintances (people you know but wouldn\'t call friends)'
  ];
  relationshipTypes.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  // Healthy vs Unhealthy
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Healthy vs Unhealthy Relationships', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(200, 255, 200);
  doc.rect(20, yPos - 3, 170, 6, 'F');
  doc.setFontSize(11);
  doc.text('Healthy Relationships:', 25, yPos + 2);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const healthySigns = [
    '• Mutual respect - you value each other and respect boundaries',
    '• Trust - you give each other benefit of the doubt',
    '• Good communication - you speak honestly and openly',
    '• Individuality - you accept people for who they are'
  ];
  healthySigns.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(255, 200, 200);
  doc.rect(20, yPos - 3, 170, 6, 'F');
  doc.text('Unhealthy Relationships:', 25, yPos + 2);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const unhealthySigns = [
    '• Disrespect - boundaries are not respected',
    '• Distrust - trust issues on one or both sides',
    '• Miscommunication - issues aren\'t discussed openly',
    '• Co-dependence - lack of freedom to express individuality'
  ];
  unhealthySigns.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  
  // Add new page
  doc.addPage();
  yPos = 40;
  
  // Signs of Abuse
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Warning Signs of Abuse', 20, yPos);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const abuseSigns = [
    'Verbal: Shouting, silent treatment, swearing, threatening',
    'Emotional: Manipulation, humiliation, making you scared to leave',
    'Financial: Controlling your finances, stopping you from earning',
    'Physical: Any form of physical harm - hitting, pushing, hurting',
    'Sexual: Any sexual activity without consent, unwanted touching, pressure'
  ];
  abuseSigns.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 8;
  });
  yPos += 10;
  
  // Communication Skills
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Communication Skills', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const commSkills = [
    '• Use "I feel" statements instead of "You always"',
    '• Listen actively without interrupting',
    '• Ask questions to understand better',
    '• Express your needs clearly',
    '• Respect when someone says no',
    '• Take breaks if discussions get heated'
  ];
  commSkills.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 15;
  
  // Tips box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 22, 'F');
  doc.text('Remember:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('• Disagreements are normal - it\'s how you handle them that matters', 25, yPos + 10);
  doc.text('• Trust your instincts - if something feels wrong, it probably is', 25, yPos + 16);
  yPos += 35;
  
  // Support Contacts
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Get Help', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Childline: 0800 1111 (Talk about relationship concerns)', 25, yPos);
  yPos += 6;
  doc.text('My CWA: 01270 250390 (24/7 helpline for relationship abuse)', 25, yPos);
  
  addBrandedFooter(doc, 1);
  addBrandedFooter(doc, 2);
}

function generateDatingSafetyGuide(doc: jsPDF) {
  addBrandedHeader(doc, 'Dark Sides to Dating - Safety Guide');
  
  let yPos = 55;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Dating should be fun and safe. This guide helps you recognize warning signs and stay safe in romantic relationships.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // Understanding Consent
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Understanding Consent', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const consentText = doc.splitTextToSize('Consent occurs when one person voluntarily agrees to a proposal from another.', 170);
  doc.text(consentText, 20, yPos);
  yPos += consentText.length * 5 + 10;
  
  const consentRules = [
    '• When asking for consent, no means no',
    '• Saying yes to one thing doesn\'t mean consenting to others',
    '• Consenting once doesn\'t mean you have to consent again',
    '• If someone doesn\'t respond yes or no, assume they haven\'t consented',
    '• Everyone has the right to change their mind',
    '• Someone under 16 cannot legally give consent to sexual acts'
  ];
  consentRules.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  // Warning Signs
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Warning Signs in Dating', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const warningSigns = [
    '• Extreme jealousy or possessiveness',
    '• Trying to control who you see or what you wear',
    '• Checking your phone or social media',
    '• Putting you down or making you feel bad',
    '• Pressuring you to do things you\'re uncomfortable with',
    '• Blaming you for their anger',
    '• Threatening to hurt you or themselves',
    '• Moving too fast (love bombing)'
  ];
  warningSigns.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  
  // Add new page
  doc.addPage();
  yPos = 40;
  
  // Types of Dating Abuse
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Types of Dating Abuse', 20, yPos);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const abuseTypes = [
    'Physical: Hitting, pushing, shoving, hair pulling, any unwanted physical contact',
    'Emotional: Name-calling, humiliation, threats, manipulation, isolation from friends',
    'Sexual: Any unwanted sexual contact, pressure for sexual activity, sharing intimate images without consent',
    'Digital: Excessive messaging, tracking your location, demanding passwords, posting about you without permission'
  ];
  abuseTypes.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 8;
  });
  yPos += 10;
  
  // Staying Safe
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Staying Safe', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const safetyTips = [
    '• Meet in public places for first dates',
    '• Tell someone where you\'re going',
    '• Keep your phone charged',
    '• Trust your instincts',
    '• Don\'t feel pressured to drink alcohol',
    '• Have your own transport home',
    '• Keep boundaries clear',
    '• It\'s okay to leave if you feel uncomfortable'
  ];
  safetyTips.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 15;
  
  // Breaking Up Safely
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Breaking Up Safely', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const breakupTips = [
    '• If you don\'t feel safe, don\'t break up in person',
    '• If in person, do it in a public place with friends nearby',
    '• Don\'t go to the door if your ex comes to your house',
    '• Trust your instincts',
    '• Block them on social media if needed',
    '• Tell trusted adults about the situation'
  ];
  breakupTips.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 15;
  
  // Important box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(255, 240, 240);
  doc.rect(20, yPos - 5, 170, 22, 'F');
  doc.text('Remember:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('• You deserve to be treated with respect', 25, yPos + 10);
  doc.text('• Abuse is never your fault - It\'s not love if it hurts', 25, yPos + 16);
  yPos += 30;
  
  // Emergency Contacts
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Emergency Contacts', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Childline: 0800 1111', 25, yPos);
  yPos += 6;
  doc.text('My CWA: 01270 250390 (24/7 helpline)', 25, yPos);
  yPos += 6;
  doc.text('Emergency: 999 (If you\'re in immediate danger)', 25, yPos);
  
  addBrandedFooter(doc, 1);
  addBrandedFooter(doc, 2);
}

function generatePersonalSafetyGuide(doc: jsPDF) {
  addBrandedHeader(doc, 'Safety and Me - Personal Safety Guide');
  
  let yPos = 55;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Your safety matters. This guide helps you create personal safety plans for different situations in your life.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // Safety at School/College
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Safety at School/College', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const schoolSafety = [
    '• Use different routes if you don\'t feel safe',
    '• Walk with friends or classmates',
    '• Choose safe times and places to speak to trusted adults',
    '• Eat in safe places with others',
    '• Know who your trusted adult at school is',
    '• Report bullying or harassment immediately'
  ];
  schoolSafety.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  // Safety Out and About
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Safety Out and About', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const outAboutSafety = [
    '• Meet in public places when with friends',
    '• Plan your route and timing',
    '• Keep your mobile phone charged',
    '• Know who to ring if you feel unsafe',
    '• Have a pre-arranged pickup or meeting place',
    '• Stay in well-lit areas',
    '• Walk with confidence',
    '• Trust your instincts'
  ];
  outAboutSafety.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  
  // Add new page
  doc.addPage();
  yPos = 40;
  
  // Online Safety
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Online Safety', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const onlineSafety = [
    '• Not everybody online is who they say they are',
    '• Never post personal information like your address or phone number',
    '• Think before posting - most people can download and share it',
    '• Keep privacy settings high',
    '• Never meet up with people you\'ve only met online',
    '• Tell a trusted adult if something worries you online',
    '• This includes sexting, pornography and cyberbullying'
  ];
  onlineSafety.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  // Safety with Images
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Safety with Images and Messages', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const imageSafety = [
    '• Never feel pressured to send pictures of yourself',
    '• Talk it over with someone you trust before making decisions',
    '• Don\'t say or do anything online you wouldn\'t do in person',
    '• Never give out passwords or security information',
    '• Know how to change privacy settings and find report/delete buttons',
    '• Download the Zipit app to help with tricky DM conversations'
  ];
  imageSafety.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 15;
  
  // Creating Safety Plan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Creating Your Safety Plan', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const safetyPlan = [
    '• Identify safe routes to places you go regularly',
    '• List trusted adults you can talk to',
    '• Know emergency numbers by heart',
    '• Have a code word with family for emergencies',
    '• Keep important numbers saved in your phone',
    '• Plan what to do if you feel unsafe'
  ];
  safetyPlan.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 15;
  
  // Tips box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 22, 'F');
  doc.text('Remember:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('• Trust your instincts - they\'re usually right', 25, yPos + 10);
  doc.text('• Your safety is more important than being polite', 25, yPos + 16);
  yPos += 30;
  
  // Support Contacts
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Get Help', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Childline: 0800 1111', 25, yPos);
  yPos += 6;
  doc.text('Emergency: 999', 25, yPos);
  
  addBrandedFooter(doc, 1);
  addBrandedFooter(doc, 2);
}

function generateLookingAfterYourself(doc: jsPDF) {
  addBrandedHeader(doc, 'Looking After Yourself - Wellbeing Guide');
  
  let yPos = 55;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('This guide helps you take better care of yourself. It\'s your resource to support you in finding ways to achieve better health and wellbeing.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // What is Wellbeing
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('What is Wellbeing?', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const wellbeingText = doc.splitTextToSize('Wellbeing is the state of being comfortable, healthy and happy. It includes how satisfied you are with your life, your sense of purpose and how in control you feel.', 170);
  doc.text(wellbeingText, 20, yPos);
  yPos += wellbeingText.length * 5 + 15;
  
  // Getting Started
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Getting Started - Simple Steps', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const simpleSteps = [
    '• Be kind to yourself',
    '• Make a list of things you like to do and do one each week',
    '• Practice mindfulness - be aware without reacting',
    '• Write in a journal to process feelings',
    '• Do something creative (coloring, art, music)',
    '• Relax for at least 10 minutes each day',
    '• Drink more water',
    '• Be active - even 10 minutes of walking helps',
    '• Get some daylight every day',
    '• Stretch your body morning and night',
    '• Connect with friendly, supportive people',
    '• Keep learning new skills'
  ];
  simpleSteps.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 4;
  });
  
  // Add new page
  doc.addPage();
  yPos = 40;
  
  // Pleasurable Activities
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Pleasurable Activities to Try', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const activities = [
    'Exercise you enjoy • Sit outside and watch clouds • Play on swings',
    'Dance to loud music • Watch a box set • Visit or call a friend',
    'Go for a swim • Feed the ducks • Join a local group or class',
    'Do puzzles • Read your favorite book • Draw or paint • Take photos',
    'Get a haircut • Do some gardening • Eat something delicious',
    'Meditate • Sing or play music • Make a movie on your phone',
    'Write a bucket list • Make a scrapbook • Create a playlist'
  ];
  activities.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 15;
  
  // Mindfulness Practice
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Mindfulness Practice', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const mindfulness = doc.splitTextToSize('Two key elements: 1) Focus on this moment - your breathing, thoughts, feelings, sounds. 2) Acceptance - recognize your thoughts and feelings without judgment. Practicing mindfulness daily, even for 5-10 minutes, helps you self-soothe.', 170);
  doc.text(mindfulness, 20, yPos);
  yPos += mindfulness.length * 5 + 15;
  
  // Mood Mapping
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Mood Mapping', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const moodMapping = doc.splitTextToSize('Track your moods over time to understand patterns. Plot your energy level (vertical) and how positive you feel (horizontal). Note what affects your mood (sleep, incidents, alcohol). Over time, you\'ll learn what helps and what harms your mood.', 170);
  doc.text(moodMapping, 20, yPos);
  yPos += moodMapping.length * 5 + 15;
  
  // Journaling
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Journaling Your Journey', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const journaling = doc.splitTextToSize('Use a journal to offload troublesome thoughts and track progress. Write about feelings, poetry, stories, memories - anything you want. Be creative - draw, doodle, paint, stick quotes. It becomes a treasured companion.', 170);
  doc.text(journaling, 20, yPos);
  yPos += journaling.length * 5 + 15;
  
  // Tips box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 22, 'F');
  doc.text('Key Message:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Treat yourself as your highest priority. Like putting your oxygen', 25, yPos + 10);
  doc.text('mask on first - you can\'t help others unless you\'re strong and well.', 25, yPos + 16);
  yPos += 30;
  
  // Support
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Support', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('My CWA: 01270 250390 (24/7 helpline)', 25, yPos);
  
  addBrandedFooter(doc, 1);
  addBrandedFooter(doc, 2);
}

function generateIdentityLifeStory(doc: jsPDF) {
  addBrandedHeader(doc, 'Identity & Life Story Work');
  
  let yPos = 55;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Understanding who you are and where you come from is an important part of growing up. This guide helps you explore your identity and create your life story.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // Understanding Identity
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Understanding Identity', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const identityParts = [
    '• Your name and what it means',
    '• Your family background and culture',
    '• Your interests and hobbies',
    '• Your values and beliefs',
    '• Your strengths and talents',
    '• Your goals and dreams',
    '• Your experiences and memories',
    '• All of these things together make you unique and special'
  ];
  identityParts.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  // Exploring Your Story
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Exploring Your Story', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const storyElements = [
    '• Where you were born',
    '• Important people in your life',
    '• Significant events and memories',
    '• Places you\'ve lived',
    '• Schools you\'ve attended',
    '• Friends you\'ve made',
    '• Challenges you\'ve overcome',
    '• Achievements you\'re proud of',
    '• It\'s okay if parts of your story are difficult or unclear'
  ];
  storyElements.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 4;
  });
  
  // Add new page
  doc.addPage();
  yPos = 40;
  
  // Creating Life Story Book
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Creating Your Life Story Book', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const lifeStoryBook = [
    'A life story book helps organize your memories and experiences. Include:',
    '',
    '• Photos of yourself at different ages',
    '• Pictures of important people',
    '• Drawings or artwork',
    '• Written memories',
    '• Certificates and awards',
    '• Letters or cards',
    '• Maps of places you\'ve lived',
    '• Timeline of important events',
    '• You can add to it over time'
  ];
  lifeStoryBook.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  // Understanding Feelings
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Understanding Your Feelings About Your Story', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const feelings = doc.splitTextToSize('It\'s normal to have mixed feelings about your story. You might feel proud of things you\'ve overcome, sad about difficult times, angry about things that happened, confused about missing pieces, happy about good memories, grateful for people who helped. All of these feelings are valid and okay.', 170);
  doc.text(feelings, 20, yPos);
  yPos += feelings.length * 5 + 15;
  
  // Building Positive Sense of Self
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Building a Positive Sense of Self', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const positiveSelf = [
    '• Focus on your strengths and positive qualities',
    '• Remember times you showed courage',
    '• Celebrate your achievements, big and small',
    '• Surround yourself with supportive people',
    '• Practice self-compassion',
    '• Set goals for your future',
    '• Remember that your past doesn\'t define your future'
  ];
  positiveSelf.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 15;
  
  // Tips box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 22, 'F');
  doc.text('Remember:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('• Your story is unique and valuable', 25, yPos + 10);
  doc.text('• It\'s okay to ask questions about your past', 25, yPos + 16);
  
  addBrandedFooter(doc, 1);
  addBrandedFooter(doc, 2);
}

function generateBuildingResilience(doc: jsPDF) {
  addBrandedHeader(doc, 'Building Resilience Workbook');
  
  let yPos = 55;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = doc.splitTextToSize('Resilience is the ability to bounce back from difficult situations. It\'s not about avoiding problems, but learning how to cope with and overcome them.', 170);
  doc.text(intro, 20, yPos);
  yPos += intro.length * 6 + 15;
  
  // What is Resilience
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('What is Resilience?', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const resilienceMeans = [
    '• Being able to cope with stress and adversity',
    '• Bouncing back from setbacks',
    '• Learning from difficulties',
    '• Growing stronger through challenges',
    '• Maintaining hope during hard times',
    '• Adapting to change',
    '• Everyone can build resilience - it\'s a skill you can learn'
  ];
  resilienceMeans.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;
  
  // Building Blocks
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Building Blocks of Resilience', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const buildingBlocks = [
    'Connection - Having supportive relationships',
    'Self-care - Taking care of your physical and mental health',
    'Purpose - Having goals and things that matter to you',
    'Hope - Maintaining optimism about the future',
    'Healthy thinking - Challenging negative thoughts',
    'Self-awareness - Understanding your emotions',
    'Problem-solving - Finding ways to address challenges',
    'Self-regulation - Managing your emotions and behavior'
  ];
  buildingBlocks.forEach(item => {
    const lines = doc.splitTextToSize(item, 165);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 5;
  });
  
  // Add new page
  doc.addPage();
  yPos = 40;
  
  // Developing Coping Skills
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Developing Coping Skills', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(200, 255, 200);
  doc.rect(20, yPos - 3, 170, 6, 'F');
  doc.setFontSize(11);
  doc.text('Healthy Coping Strategies:', 25, yPos + 2);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const healthyCoping = [
    '• Talking to someone you trust',
    '• Physical exercise',
    '• Creative expression (art, music, writing)',
    '• Mindfulness and relaxation',
    '• Setting and achieving small goals',
    '• Helping others',
    '• Spending time in nature',
    '• Maintaining routines'
  ];
  healthyCoping.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(255, 200, 200);
  doc.rect(20, yPos - 3, 170, 6, 'F');
  doc.text('Unhealthy Coping to Avoid:', 25, yPos + 2);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const unhealthyCoping = [
    '• Substance use',
    '• Self-harm',
    '• Isolation',
    '• Avoidance',
    '• Excessive screen time'
  ];
  unhealthyCoping.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 15;
  
  // Learning from Setbacks
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Learning from Setbacks', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const setbackSteps = [
    '• Acknowledge your feelings',
    '• Identify what you can control',
    '• Break problems into smaller parts',
    '• Try different solutions',
    '• Ask for help when needed',
    '• Reflect on what worked and what didn\'t',
    '• Celebrate small wins',
    '• Remember past successes'
  ];
  setbackSteps.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  yPos += 15;
  
  // Tips box
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(BRAND_COLORS.background);
  doc.rect(20, yPos - 5, 170, 28, 'F');
  doc.text('Remember:', 25, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('• Resilience grows stronger with practice', 25, yPos + 10);
  doc.text('• Small steps lead to big changes', 25, yPos + 16);
  doc.text('• It\'s okay to ask for help - that\'s being resilient!', 25, yPos + 22);
  
  addBrandedFooter(doc, 1);
  addBrandedFooter(doc, 2);
}

export async function POST(request: NextRequest) {
  try {
    // P0-03: Require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { resourceId, resourceTitle }: ResourceRequest = await request.json();
    
    // Create PDF
    const doc = new jsPDF();
    
    // Generate appropriate content based on resource ID
    switch (resourceId) {
      // Existing resources
      case 'welcome-pack':
        generateWelcomePack(doc);
        break;
      case 'daily-routine':
        generateDailyRoutinePlanner(doc);
        break;
      case 'feelings-chart':
        generateFeelingsChart(doc);
        break;
      case 'goal-setting':
        generateGoalSetting(doc);
        break;
      case 'rights-guide':
        generateRightsGuide(doc);
        break;
      
      // NEW: Wellbeing resources
      case 'breathing-exercises':
        generateBreathingExercises(doc);
        break;
      case 'sleep-guide':
        generateSleepGuide(doc);
        break;
      case 'mindfulness-intro':
        generateMindfulnessIntro(doc);
        break;
      
      // NEW: Mental health resources
      case 'anxiety-management':
        generateAnxietyManagement(doc);
        break;
      case 'depression-support':
        generateDepressionSupport(doc);
        break;
      case 'trauma-healing':
        generateTraumaHealing(doc);
        break;
      
      // NEW: Life skills resources
      case 'money-basics':
        generateMoneyBasics(doc);
        break;
      case 'cooking-basics':
        generateCookingBasics(doc);
        break;
      case 'job-readiness':
        generateJobReadiness(doc);
        break;
      
      // NEW: Education resources
      case 'study-skills':
        generateStudySkills(doc);
        break;
      case 'achievement-tracker':
        generateAchievementTracker(doc);
        break;
      
      // NEW: App/Multimedia resources
      case 'headspace-app':
        generateHeadspaceApp(doc);
        break;
      case 'calm-app':
        generateCalmApp(doc);
        break;
      case 'khan-academy':
        generateKhanAcademy(doc);
        break;
      case 'bbc-bitesize':
        generateBBCBitesize(doc);
        break;
      case 'instagram-safety':
        generateInstagramSafety(doc);
        break;
      case 'tiktok-safety':
        generateTikTokSafety(doc);
        break;
      case 'youtube-learning':
        generateYoutubeLearning(doc);
        break;
      case 'spotify-wellbeing':
        generateSpotifyWellbeing(doc);
        break;
      
      // NEW COMPREHENSIVE RESOURCES FROM PDFs
      case 'emotional-regulation-toolkit':
        generateEmotionalRegulationToolkit(doc);
        break;
      case 'healthy-relationships-guide':
        generateHealthyRelationshipsGuide(doc);
        break;
      case 'dating-safety-guide':
        generateDatingSafetyGuide(doc);
        break;
      case 'personal-safety-guide':
        generatePersonalSafetyGuide(doc);
        break;
      case 'looking-after-yourself':
        generateLookingAfterYourself(doc);
        break;
      case 'identity-life-story':
        generateIdentityLifeStory(doc);
        break;
      case 'building-resilience':
        generateBuildingResilience(doc);
        break;
      
      default:
        // Generic template for any remaining resources
        addBrandedHeader(doc, resourceTitle);
        let yPos = 55;
        doc.setFontSize(12);
        doc.text('This resource is being prepared for you.', 20, yPos);
        addBrandedFooter(doc, 1);
    }
    
    // Get PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resourceId}.pdf"`,
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
