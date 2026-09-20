import { PrismaClient, UserRole, AccountStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');
  
  // ============================================
  // CARE HOMES
  // ============================================
  
  const careHomes = [
    { id: 'home-claudius', name: 'claudius', displayName: 'Claudius House' },
    { id: 'home-winchester', name: 'winchester', displayName: 'Winchester House' },
    { id: 'home-kingsnorth', name: 'kingsnorth', displayName: 'Kingsnorth House' },
  ];

  for (const home of careHomes) {
    await prisma.careHome.upsert({
      where: { id: home.id },
      update: { displayName: home.displayName },
      create: home,
    });
  }
  console.log(`✅ Seeded ${careHomes.length} care homes`);

  // ============================================
  // ADMIN ACCOUNTS (legacy AdminUser table — kept for backwards compat)
  // ============================================
  
  // Seed password is read from the environment so no real credential ships in source.
  // Set SEED_ADMIN_PASSWORD in your .env before running `yarn prisma db seed`.
  const adminPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!', 12);
  
  const adminAccounts = [
    {
      id: 'admin-main',
      email: 'admin@okayit.uk',
      password: adminPassword,
      name: 'OKAYiT Admin',
      role: 'admin',
      home: 'all',
      isActive: true
    },
    {
      id: 'admin-emma',
      email: 'e.hempsall@positiveindependence.co.uk',
      password: adminPassword,
      name: 'Emma Hempsall',
      role: 'admin',
      home: 'all',
      isActive: true
    },
    {
      id: 'admin-claudius',
      email: 'claudius@okayit.online',
      password: adminPassword,
      name: 'Claudius Manager',
      role: 'manager',
      home: 'claudius',
      isActive: true
    },
    {
      id: 'admin-winchester',
      email: 'winchester@okayit.online',
      password: adminPassword,
      name: 'Winchester Manager',
      role: 'manager',
      home: 'winchester',
      isActive: true
    },
    {
      id: 'admin-kingsnorth',
      email: 'kingsnorth@okayit.online',
      password: adminPassword,
      name: 'Kingsnorth Manager',
      role: 'manager',
      home: 'kingsnorth',
      isActive: true
    }
  ];
  
  for (const admin of adminAccounts) {
    await prisma.adminUser.upsert({
      where: { id: admin.id },
      update: { ...admin },
      create: { ...admin }
    });
  }
  
  console.log(`✅ Seeded ${adminAccounts.length} legacy admin accounts`);

  // ============================================
  // NEW USER TABLE (Phase 3 — RBAC accounts)
  // ============================================

  const homeMap: Record<string, string> = {
    claudius: 'home-claudius',
    winchester: 'home-winchester',
    kingsnorth: 'home-kingsnorth',
  };

  const newUsers = [
    {
      id: 'user-super-admin',
      email: 'admin@okayit.uk',
      password: adminPassword,
      displayName: 'OKAYiT Admin',
      role: UserRole.SUPER_ADMIN,
      status: AccountStatus.ACTIVE,
      careHomeId: null as string | null,
    },

    {
      id: 'user-claudius-admin',
      email: 'claudius@okayit.online',
      password: adminPassword,
      displayName: 'Claudius Manager',
      role: UserRole.HOME_ADMIN,
      status: AccountStatus.ACTIVE,
      careHomeId: homeMap.claudius,
    },
    {
      id: 'user-winchester-admin',
      email: 'winchester@okayit.online',
      password: adminPassword,
      displayName: 'Winchester Manager',
      role: UserRole.HOME_ADMIN,
      status: AccountStatus.ACTIVE,
      careHomeId: homeMap.winchester,
    },
    {
      id: 'user-kingsnorth-admin',
      email: 'kingsnorth@okayit.online',
      password: adminPassword,
      displayName: 'Kingsnorth Manager',
      role: UserRole.HOME_ADMIN,
      status: AccountStatus.ACTIVE,
      careHomeId: homeMap.kingsnorth,
    },
  ];

  for (const user of newUsers) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { displayName: user.displayName, password: user.password, status: user.status },
      create: user,
    });
  }
  console.log(`✅ Seeded ${newUsers.length} new RBAC user accounts`);

  // Promote Emma Hempsall to SUPER_ADMIN (may already exist with a different id)
  await prisma.user.upsert({
    where: { email: 'e.hempsall@positiveindependence.co.uk' },
    update: { role: UserRole.SUPER_ADMIN, status: AccountStatus.ACTIVE, careHomeId: null, displayName: 'Emma Hempsall' },
    create: {
      email: 'e.hempsall@positiveindependence.co.uk',
      password: adminPassword,
      displayName: 'Emma Hempsall',
      role: UserRole.SUPER_ADMIN,
      status: AccountStatus.ACTIVE,
      careHomeId: null,
    },
  });
  console.log('✅ Emma Hempsall promoted to SUPER_ADMIN');
  
  // ============================================
  // STAFF PROFILES - PROFESSIONAL TEAM MEMBERS
  // ============================================
  
  const staffMembers = [
    // ========== CLAUDIUS HOUSE ==========
    {
      id: 'claudius-emily',
      name: 'Emily',
      role: 'Registered Manager',
      shift: 'day',
      home: 'claudius',
      photo: '',
      description: 'Emily leads Claudius House with a warm, approachable style. She ensures every young person feels heard and valued, working closely with the team to maintain high standards of care. With extensive experience in residential care, she is passionate about creating a safe, nurturing environment where young people can thrive.',
      interests: ['Team leadership', 'Youth development', 'Quality improvement', 'Staff mentoring'],
      funFact: 'Loves organizing team activities and celebrations',
      favoriteQuote: 'Every young person deserves a champion',
      whenToTalkTo: 'Available during office hours for any concerns or questions about your care',
      contact: 'Available via main office',
      color: 'from-purple-500 to-pink-500',
      displayOrder: 1,
      isActive: true
    },
    {
      id: 'claudius-christina',
      name: 'Christina',
      role: 'Deputy Manager',
      shift: 'day',
      home: 'claudius',
      photo: '',
      description: 'Christina works alongside Emily to ensure smooth daily operations at Claudius House. She coordinates care planning, supervises staff, and maintains strong relationships with external agencies. Her attention to detail and calm approach make her an excellent problem-solver.',
      interests: ['Care coordination', 'Staff development', 'Building partnerships', 'Creating opportunities'],
      funFact: 'Known for always having a solution ready',
      favoriteQuote: 'Teamwork makes the dream work',
      whenToTalkTo: 'Available for care plan reviews and coordination with schools or social services',
      contact: 'Contact through staff team',
      color: 'from-blue-500 to-purple-500',
      displayOrder: 2,
      isActive: true
    },
    {
      id: 'claudius-holly',
      name: 'Holly',
      role: 'Team Leader',
      shift: 'day',
      home: 'claudius',
      photo: '',
      description: 'Holly brings energy and creativity to her role, supervising the care team and ensuring consistent, high-quality support for all young people. She is passionate about making the home feel welcoming and helping young people build life skills.',
      interests: ['Creative activities', 'Life skills coaching', 'Building confidence', 'Fun outings'],
      funFact: 'Organizes the best movie nights and themed dinners',
      favoriteQuote: 'Small steps lead to big changes',
      whenToTalkTo: 'Great for activity planning, life skills support, and day-to-day questions',
      contact: 'Available during day shifts',
      color: 'from-cyan-500 to-blue-500',
      displayOrder: 3,
      isActive: true
    },
    {
      id: 'claudius-steven',
      name: 'Steven',
      role: 'Care Support Worker',
      shift: 'day',
      home: 'claudius',
      photo: '',
      description: 'Steven provides consistent, reliable support to young people at Claudius House. He is patient, approachable, and skilled at building trust. Steven enjoys helping young people with homework, cooking together, and talking through challenges.',
      interests: ['Sports and fitness', 'Cooking', 'Education support', 'Building relationships'],
      funFact: 'Can teach you how to cook a perfect pasta dish',
      favoriteQuote: 'Consistency builds trust',
      whenToTalkTo: 'Good for practical support, homework help, or just a friendly chat',
      contact: 'Available during day shifts',
      color: 'from-green-500 to-cyan-500',
      displayOrder: 4,
      isActive: true
    },
    {
      id: 'claudius-rebecca',
      name: 'Rebecca',
      role: 'Care Support Worker',
      shift: 'day',
      home: 'claudius',
      photo: '',
      description: 'Rebecca is a compassionate and attentive support worker who focuses on emotional wellbeing. She creates a safe space for young people to express their feelings and works with them to develop coping strategies. Her calm presence is reassuring during difficult times.',
      interests: ['Mental health', 'Art therapy', 'Mindfulness', 'Emotional support'],
      funFact: 'Keeps a collection of calming music playlists',
      favoriteQuote: 'Your feelings are valid',
      whenToTalkTo: 'Perfect for emotional support and wellbeing check-ins',
      contact: 'Available during day shifts',
      color: 'from-pink-500 to-rose-500',
      displayOrder: 5,
      isActive: true
    },
    {
      id: 'claudius-tessa',
      name: 'Tessa',
      role: 'Care Support Worker',
      shift: 'day',
      home: 'claudius',
      photo: '',
      description: 'Tessa brings enthusiasm and a positive attitude to every shift. She loves getting to know each young person as an individual and supporting them to achieve their goals. Tessa is great at encouraging participation in activities and helping young people try new things.',
      interests: ['Youth engagement', 'Creative projects', 'Music', 'Encouraging independence'],
      funFact: 'Always knows the latest trends and music',
      favoriteQuote: 'You are capable of amazing things',
      whenToTalkTo: 'Great for trying new activities and building confidence',
      contact: 'Available during day shifts',
      color: 'from-amber-500 to-orange-500',
      displayOrder: 6,
      isActive: true
    },
    {
      id: 'claudius-keith',
      name: 'Keith',
      role: 'Support Worker & Digital Manager',
      shift: 'day',
      home: 'claudius',
      photo: '',
      description: 'Keith combines direct care support with digital innovation. He manages the OKAYiT platform and ensures technology enhances the care experience. Keith is tech-savvy and patient, helping young people develop digital skills while providing everyday support.',
      interests: ['Technology', 'Digital literacy', 'Gaming', 'Problem-solving'],
      funFact: 'Built this very platform you are using',
      favoriteQuote: 'Technology should empower, not overwhelm',
      whenToTalkTo: 'Perfect for tech help, digital skills, or platform questions',
      contact: 'Available during day shifts',
      color: 'from-indigo-500 to-purple-500',
      displayOrder: 7,
      isActive: true
    },
    {
      id: 'claudius-jordan',
      name: 'Jordan',
      role: 'Care Support Worker',
      shift: 'day',
      home: 'claudius',
      photo: '',
      description: 'Jordan is a dedicated support worker with a focus on building strong, trusting relationships. Jordan is approachable, non-judgmental, and skilled at helping young people navigate challenges. With a background in youth work, Jordan understands the importance of consistency and advocacy.',
      interests: ['Youth advocacy', 'Sports', 'Social activities', 'Life coaching'],
      funFact: 'Loves playing board games and outdoor activities',
      favoriteQuote: 'Your voice matters',
      whenToTalkTo: 'Great for advocacy support and social activities',
      contact: 'Available during day shifts',
      color: 'from-teal-500 to-green-500',
      displayOrder: 8,
      isActive: true
    },
    
    // ========== WINCHESTER CLOSE ==========
    {
      id: 'winchester-maria',
      name: 'Maria',
      role: 'Team Leader',
      shift: 'day',
      home: 'winchester',
      photo: '',
      description: 'Maria leads the Winchester Close team with dedication and compassion. She ensures the home runs smoothly and that every young person receives personalized support. Maria is experienced in coordinating with schools, social workers, and families to create the best outcomes.',
      interests: ['Team coordination', 'Partnership working', 'Creating stability', 'Supporting transitions'],
      funFact: 'Known for her excellent organizational skills',
      favoriteQuote: 'Together we achieve more',
      whenToTalkTo: 'Available for care planning and coordinating external support',
      contact: 'Available during day shifts',
      color: 'from-violet-500 to-purple-500',
      displayOrder: 1,
      isActive: true
    },
    {
      id: 'winchester-clara',
      name: 'Clara',
      role: 'Care Support Worker',
      shift: 'day',
      home: 'winchester',
      photo: '',
      description: 'Clara provides warm, consistent care at Winchester Close. She is excellent at helping young people feel comfortable and building their confidence. Clara loves cooking with young people and helping them learn practical skills for independent living.',
      interests: ['Cooking', 'Life skills', 'Building confidence', 'Creating routines'],
      funFact: 'Makes the best homemade pizza',
      favoriteQuote: 'Small wins lead to big victories',
      whenToTalkTo: 'Perfect for life skills support and practical help',
      contact: 'Available during day shifts',
      color: 'from-rose-500 to-pink-500',
      displayOrder: 2,
      isActive: true
    },
    {
      id: 'winchester-sophie',
      name: 'Sophie',
      role: 'Care Support Worker',
      shift: 'day',
      home: 'winchester',
      photo: '',
      description: 'Sophie is a caring and patient support worker who excels at creating a calm, supportive environment. She is great at listening without judgment and helping young people work through difficult emotions. Sophie is trained in trauma-informed care.',
      interests: ['Trauma-informed care', 'Emotional support', 'Creative expression', 'Mindfulness'],
      funFact: 'Keeps a mindfulness garden at the home',
      favoriteQuote: 'Healing happens at your own pace',
      whenToTalkTo: 'Excellent for emotional support and processing feelings',
      contact: 'Available during day shifts',
      color: 'from-sky-500 to-blue-500',
      displayOrder: 3,
      isActive: true
    },
    {
      id: 'winchester-leah',
      name: 'Leah',
      role: 'Care Support Worker',
      shift: 'day',
      home: 'winchester',
      photo: '',
      description: 'Leah brings positivity and energy to Winchester Close. She is passionate about helping young people discover their strengths and interests. Leah loves organizing activities and outings, and is great at helping young people try new experiences.',
      interests: ['Activities coordination', 'Building interests', 'Encouraging participation', 'Community engagement'],
      funFact: 'Always has a fun activity idea up her sleeve',
      favoriteQuote: 'Every day is a new opportunity',
      whenToTalkTo: 'Great for activity planning and trying new things',
      contact: 'Available during day shifts',
      color: 'from-emerald-500 to-green-500',
      displayOrder: 4,
      isActive: true
    },
    {
      id: 'winchester-shaun',
      name: 'Shaun',
      role: 'Care Support Worker',
      shift: 'day',
      home: 'winchester',
      photo: '',
      description: 'Shaun is a supportive and reliable member of the Winchester Close team. He is skilled at building rapport with young people and helping them develop important life skills. Shaun is particularly good at supporting education and helping with homework.',
      interests: ['Education support', 'Sports', 'Life skills', 'Building independence'],
      funFact: 'Former youth football coach',
      favoriteQuote: 'Practice makes progress',
      whenToTalkTo: 'Perfect for education support and sports activities',
      contact: 'Available during day shifts',
      color: 'from-blue-500 to-indigo-500',
      displayOrder: 5,
      isActive: true
    },
    {
      id: 'winchester-amelia',
      name: 'Amelia',
      role: 'Care Support Worker',
      shift: 'day',
      home: 'winchester',
      photo: '',
      description: 'Amelia is a compassionate support worker who focuses on building strong, trusting relationships with young people. She is an excellent listener and creates a safe space for young people to express themselves. Amelia is trained in supporting young people with anxiety and low mood.',
      interests: ['Mental health support', 'Creative therapies', 'Building resilience', 'Peer support'],
      funFact: 'Loves crafting and creative projects',
      favoriteQuote: 'You are stronger than you think',
      whenToTalkTo: 'Excellent for mental health support and creative expression',
      contact: 'Available during day shifts',
      color: 'from-fuchsia-500 to-pink-500',
      displayOrder: 6,
      isActive: true
    },
    
    // ========== KINGSNORTH CARE HOME ==========
    {
      id: 'kingsnorth-daniel',
      name: 'Daniel',
      role: 'Team Leader',
      shift: 'day',
      home: 'kingsnorth',
      photo: '',
      description: 'Daniel leads the Kingsnorth team with professionalism and heart. He ensures high-quality care delivery and works closely with young people to support their individual goals. Daniel has extensive experience in residential care and is committed to creating positive outcomes.',
      interests: ['Leadership', 'Goal setting', 'Youth development', 'Creating opportunities'],
      funFact: 'Organized the first Kingsnorth talent show',
      favoriteQuote: 'Lead by example',
      whenToTalkTo: 'Available for care planning and goal setting',
      contact: 'Available during day shifts',
      color: 'from-purple-500 to-indigo-500',
      displayOrder: 1,
      isActive: true
    },
    {
      id: 'kingsnorth-grace',
      name: 'Grace',
      role: 'Care Support Worker',
      shift: 'day',
      home: 'kingsnorth',
      photo: '',
      description: 'Grace provides compassionate, person-centered support at Kingsnorth. She is skilled at helping young people feel safe and valued. Grace excels at supporting emotional regulation and helping young people develop healthy coping strategies.',
      interests: ['Emotional wellbeing', 'Self-care', 'Creative activities', 'Building confidence'],
      funFact: 'Creates personalized self-care kits for young people',
      favoriteQuote: 'Self-care is not selfish',
      whenToTalkTo: 'Perfect for wellbeing support and self-care guidance',
      contact: 'Available during day shifts',
      color: 'from-pink-500 to-purple-500',
      displayOrder: 2,
      isActive: true
    },
    
    // ========== ALL HOMES ==========
    {
      id: 'all-isaac',
      name: 'Isaac',
      role: 'Care Support Worker',
      shift: 'day',
      home: 'all',
      photo: '',
      description: 'Isaac works across all three homes, bringing flexibility and diverse experience to the team. He is adaptable, friendly, and excellent at building connections with young people quickly. Isaac is passionate about promoting equality, diversity, and inclusion in care.',
      interests: ['Cross-home support', 'Cultural diversity', 'Music', 'Building connections'],
      funFact: 'Speaks three languages',
      favoriteQuote: 'Diversity is our strength',
      whenToTalkTo: 'Available across all homes for flexible support',
      contact: 'Contact through any home',
      color: 'from-orange-500 to-red-500',
      displayOrder: 1,
      isActive: true
    }
  ];

  // Upsert all staff members
  for (const staff of staffMembers) {
    await prisma.staffMember.upsert({
      where: { id: staff.id },
      update: staff,
      create: staff,
    });
  }
  
  console.log(`✅ Successfully seeded ${staffMembers.length} staff members`);
  
  // Optional: Seed anonymous metrics for demo purposes
  const today = new Date().toISOString().split('T')[0];
  
  try {
    await prisma.anonymousMetrics.upsert({
      where: {
        metricType_metricName_date: {
          metricType: 'page_view',
          metricName: 'homepage',
          date: today,
        },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        metricType: 'page_view',
        metricName: 'homepage',
        date: today,
        count: 1,
      },
    });
  } catch (error) {
    console.log('⚠️  Metrics seed skipped');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
