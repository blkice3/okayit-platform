
import { LocationData, QuizQuestion } from './types';

export const locationData: Record<string, LocationData> = {
  bedroom: {
    id: 'bedroom',
    name: 'bedroom',
    title: 'Bedroom - Safe Sleep & Dignity',
    description: 'Learn about safe sleep practices and maintaining dignity in night-time routines',
    icon: 'Bed',
    color: '#FF6B9D',
    bgGradient: 'from-pink-400 to-purple-500',
    learningOutcomes: [
      'Understand safe sleep practices for different age groups',
      'Recognize the importance of privacy and dignity',
      'Know when to seek help or report concerns'
    ],
    activities: [
      {
        id: 'bedroom-quiz',
        type: 'quiz',
        title: 'Safe Sleep Knowledge Check',
        description: 'Test your understanding of safe sleep practices',
        points: 20,
        content: {
          questions: [
            {
              id: '1',
              question: 'What is the most important aspect of promoting dignity in bedtime routines?',
              type: 'multiple-choice',
              options: [
                'Making sure everyone goes to bed at the same time',
                'Respecting individual privacy and personal preferences',
                'Having staff check on young people every hour',
                'Ensuring all bedroom doors remain open'
              ],
              correctAnswer: 1,
              explanation: 'Respecting individual privacy and personal preferences is crucial for maintaining dignity while ensuring safety.',
              points: 5
            },
            {
              id: '2',
              question: 'Young people aged 16-18 should have the same bedtime restrictions as those aged 8-12.',
              type: 'true-false',
              correctAnswer: false,
              explanation: 'Older young people should have age-appropriate flexibility in their bedtime routines while maintaining safety.',
              points: 5
            },
            {
              id: '3',
              question: 'If a young person has trouble sleeping, what should be the first response?',
              type: 'multiple-choice',
              options: [
                'Give them medication immediately',
                'Let them stay up all night',
                'Listen to their concerns and offer appropriate support',
                'Tell them to just try harder'
              ],
              correctAnswer: 2,
              explanation: 'A trauma-informed approach means listening and providing appropriate emotional support first.',
              points: 5
            },
            {
              id: '4',
              question: 'What does "safe sleep environment" mean in a care home?',
              type: 'multiple-choice',
              options: [
                'Locked doors and windows',
                'Secure, comfortable spaces that respect privacy and individual needs',
                'Shared bedrooms for all residents',
                'Staff supervision throughout the night'
              ],
              correctAnswer: 1,
              explanation: 'Safe sleep environments balance security with comfort, privacy, and individual developmental needs.',
              points: 5
            }
          ]
        }
      },
      {
        id: 'bedroom-scenario',
        type: 'scenario',
        title: 'Night-time Scenario Challenge',
        description: 'How would you handle this situation?',
        points: 15,
        content: {
          scenario: 'A 15-year-old has been having nightmares and is afraid to sleep alone. They ask if they can sleep with their bedroom light on and door slightly open.',
          question: 'What is the best response?',
          options: [
            'Tell them they need to get used to sleeping in the dark',
            'Work with them to find solutions that help them feel safe while maintaining appropriate boundaries',
            'Let them sleep in the communal area instead',
            'Give them sleeping medication'
          ],
          correctAnswer: 1,
          explanation: 'Trauma-informed care means working collaboratively to find solutions that address the young person\'s needs while maintaining safety.',
          followUp: 'This approach shows understanding of trauma responses while maintaining appropriate care standards.'
        }
      },
      {
        id: 'bedroom-video',
        type: 'video',
        title: 'Promoting Dignity in Care',
        description: 'Watch this explainer video about maintaining dignity in night-time routines',
        points: 10,
        content: {
          videoUrl: '/videos/bedroom-dignity.mp4',
          duration: '3:45',
          keyPoints: [
            'Individual privacy rights',
            'Age-appropriate flexibility',
            'Trauma-informed approaches',
            'Balancing safety and independence'
          ]
        }
      }
    ]
  },
  
  'fire-exit': {
    id: 'fire-exit',
    name: 'fire-exit',
    title: 'Fire Exit - Emergency Preparedness',
    description: 'Learn about fire safety procedures and emergency response protocols',
    icon: 'Flame',
    color: '#FF4757',
    bgGradient: 'from-red-400 to-orange-500',
    learningOutcomes: [
      'Know the fire evacuation procedures',
      'Understand different types of fire safety equipment',
      'Be able to respond appropriately in emergency situations'
    ],
    activities: [
      {
        id: 'fire-drill-scenario',
        type: 'scenario',
        title: 'Fire Emergency Response',
        description: 'What would you do in a fire emergency?',
        points: 25,
        content: {
          scenario: 'The fire alarm sounds at 2 AM. You are a care worker on night duty with 8 young people in the building, ages 10-17.',
          question: 'What is your immediate priority?',
          options: [
            'Call the fire brigade first',
            'Wake up the young people and begin evacuation following the established procedure',
            'Check where the fire is before doing anything else',
            'Gather important documents and belongings'
          ],
          correctAnswer: 1,
          explanation: 'In a fire emergency, immediate evacuation following established procedures is the priority to ensure everyone\'s safety.',
          followUp: 'Remember: Get everyone out safely first, then call emergency services from the assembly point.'
        }
      },
      {
        id: 'fire-safety-quiz',
        type: 'quiz',
        title: 'Fire Safety Knowledge',
        description: 'Test your fire safety knowledge',
        points: 20,
        content: {
          questions: [
            {
              id: '1',
              question: 'How often should fire drills be conducted in a children\'s care home?',
              type: 'multiple-choice',
              options: [
                'Once a year',
                'Every 6 months',
                'Monthly or as required by local fire authority',
                'Only when new residents arrive'
              ],
              correctAnswer: 2,
              explanation: 'Regular fire drills ensure everyone knows the procedures and can evacuate safely.',
              points: 5
            },
            {
              id: '2',
              question: 'What does PASS stand for when using a fire extinguisher?',
              type: 'multiple-choice',
              options: [
                'Point, Aim, Squeeze, Sweep',
                'Pull, Aim, Squeeze, Sweep',
                'Pull, Alert, Squeeze, Stop',
                'Point, Alert, Start, Stop'
              ],
              correctAnswer: 1,
              explanation: 'PASS: Pull the pin, Aim at the base of the fire, Squeeze the handle, Sweep side to side.',
              points: 5
            },
            {
              id: '3',
              question: 'If a young person refuses to evacuate during a fire drill, you should use reasonable force to make them leave.',
              type: 'true-false',
              correctAnswer: false,
              explanation: 'While safety is paramount, use de-escalation techniques first. If necessary, call for additional support rather than using force.',
              points: 5
            },
            {
              id: '4',
              question: 'Where should everyone gather after evacuating the building?',
              type: 'multiple-choice',
              options: [
                'In the car park',
                'At the designated assembly point',
                'Across the street',
                'Wherever is convenient'
              ],
              correctAnswer: 1,
              explanation: 'The designated assembly point ensures everyone can be accounted for safely.',
              points: 5
            }
          ]
        }
      }
    ]
  },

  kitchen: {
    id: 'kitchen',
    name: 'kitchen',
    title: 'Kitchen - Hygiene & Cultural Inclusion',
    description: 'Explore food safety, hygiene practices, and celebrating cultural diversity through food',
    icon: 'ChefHat',
    color: '#32D74B',
    bgGradient: 'from-green-400 to-blue-500',
    learningOutcomes: [
      'Understand food hygiene standards',
      'Learn about cultural dietary requirements',
      'Know how to create inclusive meal experiences'
    ],
    activities: [
      {
        id: 'hygiene-game',
        type: 'game',
        title: 'Hygiene Heroes Challenge',
        description: 'Complete the food safety checklist',
        points: 25,
        content: {
          gameType: 'checklist',
          tasks: [
            { id: '1', task: 'Wash hands for 20 seconds with soap', points: 5, completed: false },
            { id: '2', task: 'Check food temperatures before serving', points: 5, completed: false },
            { id: '3', task: 'Store raw and cooked foods separately', points: 5, completed: false },
            { id: '4', task: 'Clean and sanitize work surfaces', points: 5, completed: false },
            { id: '5', task: 'Check expiry dates on all ingredients', points: 5, completed: false }
          ],
          timeLimit: 300 // 5 minutes
        }
      },
      {
        id: 'cultural-food-quiz',
        type: 'quiz',
        title: 'Cultural Food Awareness',
        description: 'Learn about diverse dietary needs and preferences',
        points: 20,
        content: {
          questions: [
            {
              id: '1',
              question: 'Why is it important to understand different cultural dietary requirements?',
              type: 'multiple-choice',
              options: [
                'It\'s not really important',
                'To ensure all young people feel respected and included',
                'Only for religious reasons',
                'To make cooking more complicated'
              ],
              correctAnswer: 1,
              explanation: 'Understanding dietary requirements shows respect for cultural and religious beliefs, making everyone feel valued.',
              points: 5
            },
            {
              id: '2',
              question: 'Halal dietary requirements only apply to meat products.',
              type: 'true-false',
              correctAnswer: false,
              explanation: 'Halal requirements can affect many food ingredients and preparation methods, not just meat.',
              points: 5
            },
            {
              id: '3',
              question: 'What should you do if you\'re unsure about a young person\'s dietary requirements?',
              type: 'multiple-choice',
              options: [
                'Guess based on their appearance',
                'Ask them or check their care plan respectfully',
                'Give them whatever everyone else is having',
                'Assume they don\'t have any requirements'
              ],
              correctAnswer: 1,
              explanation: 'Always check care plans or ask respectfully to ensure dietary needs are met properly.',
              points: 5
            },
            {
              id: '4',
              question: 'Food allergies and intolerances are the same thing.',
              type: 'true-false',
              correctAnswer: false,
              explanation: 'Allergies can be life-threatening, while intolerances cause discomfort. Both need proper management.',
              points: 5
            }
          ]
        }
      }
    ]
  },

  'chill-room': {
    id: 'chill-room',
    name: 'chill-room',
    title: 'Chill Room - Mindfulness & Wellbeing',
    description: 'Discover mindfulness techniques and emotional regulation strategies',
    icon: 'Heart',
    color: '#5856D6',
    bgGradient: 'from-purple-400 to-pink-500',
    learningOutcomes: [
      'Learn basic mindfulness techniques',
      'Understand emotional regulation strategies',
      'Know how to create calming environments'
    ],
    activities: [
      {
        id: 'mindfulness-video',
        type: 'video',
        title: 'Mindful Moments Practice',
        description: 'Follow along with this guided mindfulness session',
        points: 15,
        content: {
          videoUrl: '/videos/mindfulness-practice.mp4',
          duration: '5:00',
          keyPoints: [
            'Basic breathing techniques',
            'Body scan relaxation',
            'Grounding exercises',
            'Creating safe mental spaces'
          ]
        }
      },
      {
        id: 'wellbeing-quiz',
        type: 'quiz',
        title: 'Emotional Wellbeing Understanding',
        description: 'Test your knowledge about supporting emotional wellbeing',
        points: 20,
        content: {
          questions: [
            {
              id: '1',
              question: 'What is the first step in helping someone who seems distressed?',
              type: 'multiple-choice',
              options: [
                'Tell them to calm down',
                'Listen without judgment and validate their feelings',
                'Give them advice immediately',
                'Leave them alone to sort it out'
              ],
              correctAnswer: 1,
              explanation: 'Active listening and validation help create a safe space for the person to express their feelings.',
              points: 5
            },
            {
              id: '2',
              question: 'Mindfulness techniques can help with anxiety and stress management.',
              type: 'true-false',
              correctAnswer: true,
              explanation: 'Research shows mindfulness can be effective for managing anxiety, stress, and improving emotional regulation.',
              points: 5
            },
            {
              id: '3',
              question: 'Which of these is NOT a good way to create a calming environment?',
              type: 'multiple-choice',
              options: [
                'Soft lighting and comfortable seating',
                'Loud music and bright colors',
                'Plants or nature sounds',
                'Familiar, comforting objects'
              ],
              correctAnswer: 1,
              explanation: 'Loud music and bright colors can be overstimulating rather than calming.',
              points: 5
            },
            {
              id: '4',
              question: 'How can you tell if a mindfulness technique is working for someone?',
              type: 'multiple-choice',
              options: [
                'They stop talking immediately',
                'Their breathing becomes more regular and they appear more relaxed',
                'They fall asleep',
                'They become very quiet'
              ],
              correctAnswer: 1,
              explanation: 'Signs of relaxation include steadier breathing, relaxed posture, and decreased visible tension.',
              points: 5
            }
          ]
        }
      },
      {
        id: 'reflection-activity',
        type: 'reflection',
        title: 'Personal Wellbeing Reflection',
        description: 'Think about your own wellbeing practices',
        points: 10,
        content: {
          prompts: [
            'What helps you feel calm when you\'re stressed?',
            'How do you know when someone needs emotional support?',
            'What would make you feel safe and supported in a difficult time?'
          ],
          guidance: 'Take a moment to reflect on these questions. There are no right or wrong answers - this is about understanding yourself and others better.'
        }
      }
    ]
  },

  'entrance-hall': {
    id: 'entrance-hall',
    name: 'entrance-hall',
    title: 'Entrance Hall - Values & Safeguarding',
    description: 'Learn about our care home values and safeguarding principles',
    icon: 'Home',
    color: '#FF9F0A',
    bgGradient: 'from-yellow-400 to-orange-500',
    learningOutcomes: [
      'Understand the care home\'s core values',
      'Learn key safeguarding principles',
      'Know how to report concerns'
    ],
    activities: [
      {
        id: 'welcome-video',
        type: 'video',
        title: 'Welcome to Our Care Home',
        description: 'Meet our values and learn what makes us special',
        points: 15,
        content: {
          videoUrl: '/videos/welcome-values.mp4',
          duration: '4:30',
          keyPoints: [
            'Our mission and vision',
            'Respect, safety, and inclusion',
            'Young person-centered care',
            'Community and belonging'
          ]
        }
      },
      {
        id: 'values-quiz',
        type: 'quiz',
        title: 'Values and Safeguarding Knowledge',
        description: 'Test your understanding of our core principles',
        points: 25,
        content: {
          questions: [
            {
              id: '1',
              question: 'What is the most important principle in safeguarding?',
              type: 'multiple-choice',
              options: [
                'Following rules exactly',
                'The welfare of the child is paramount',
                'Keeping detailed records',
                'Involving parents in everything'
              ],
              correctAnswer: 1,
              explanation: 'The Children Act 1989 establishes that the child\'s welfare is the paramount consideration.',
              points: 5
            },
            {
              id: '2',
              question: 'If you have a concern about a young person\'s welfare, you should wait to see if things improve before reporting it.',
              type: 'true-false',
              correctAnswer: false,
              explanation: 'Concerns should be reported promptly. Early intervention can prevent more serious problems.',
              points: 5
            },
            {
              id: '3',
              question: 'Who can you report safeguarding concerns to?',
              type: 'multiple-choice',
              options: [
                'Only the manager',
                'Any member of staff, the manager, or external agencies like social services',
                'Only the police',
                'Only external authorities'
              ],
              correctAnswer: 1,
              explanation: 'There are multiple reporting routes to ensure concerns are heard and acted upon.',
              points: 5
            },
            {
              id: '4',
              question: 'What does "person-centered care" mean?',
              type: 'multiple-choice',
              options: [
                'Everyone gets exactly the same treatment',
                'Care is tailored to each individual\'s needs, wishes, and circumstances',
                'Young people make all the decisions',
                'Staff decide what\'s best for young people'
              ],
              correctAnswer: 1,
              explanation: 'Person-centered care respects individual needs while maintaining appropriate safeguards.',
              points: 5
            },
            {
              id: '5',
              question: 'Our care home values include respect, safety, inclusion, and:',
              type: 'multiple-choice',
              options: [
                'Compliance',
                'Control',
                'Empowerment',
                'Efficiency'
              ],
              correctAnswer: 2,
              explanation: 'Empowering young people to have a voice in their care is fundamental to positive outcomes.',
              points: 5
            }
          ]
        }
      }
    ]
  },

  office: {
    id: 'office',
    name: 'office',
    title: 'Office - Meet the Team',
    description: 'Learn about staff roles, responsibilities, and how our team supports young people',
    icon: 'Users',
    color: '#007AFF',
    bgGradient: 'from-blue-400 to-purple-500',
    learningOutcomes: [
      'Understand different staff roles and responsibilities',
      'Know who to approach for different types of support',
      'Learn about accountability and leadership structure'
    ],
    activities: [
      {
        id: 'team-roles-quiz',
        type: 'quiz',
        title: 'Understanding Team Roles',
        description: 'Learn about who does what in our care team',
        points: 25,
        content: {
          questions: [
            {
              id: '1',
              question: 'Who is responsible for the overall management and safety of the care home?',
              type: 'multiple-choice',
              options: [
                'Any member of staff',
                'The Registered Manager',
                'The newest staff member',
                'External inspectors'
              ],
              correctAnswer: 1,
              explanation: 'The Registered Manager has legal responsibility for the operation and standards of the care home.',
              points: 5
            },
            {
              id: '2',
              question: 'What is the role of a Key Worker?',
              type: 'multiple-choice',
              options: [
                'To lock and unlock doors',
                'To be the main point of contact and advocate for specific young people',
                'To handle all the paperwork',
                'To supervise other staff members'
              ],
              correctAnswer: 1,
              explanation: 'Key Workers build special relationships with assigned young people and coordinate their care.',
              points: 5
            },
            {
              id: '3',
              question: 'All staff members have the same level of responsibility for safeguarding.',
              type: 'true-false',
              correctAnswer: true,
              explanation: 'Every staff member has a duty to safeguard and promote the welfare of young people.',
              points: 5
            },
            {
              id: '4',
              question: 'If you need help with education or training opportunities, who would you speak to first?',
              type: 'multiple-choice',
              options: [
                'The cook',
                'Your Key Worker or the Education Coordinator',
                'The cleaner',
                'Any random staff member'
              ],
              correctAnswer: 1,
              explanation: 'Key Workers and Education Coordinators specialize in supporting young people\'s development.',
              points: 5
            },
            {
              id: '5',
              question: 'What does accountability mean in a care home setting?',
              type: 'multiple-choice',
              options: [
                'Blaming people when things go wrong',
                'Taking responsibility for your actions and decisions',
                'Avoiding difficult situations',
                'Only managers need to be accountable'
              ],
              correctAnswer: 1,
              explanation: 'Accountability means being responsible and transparent about decisions and actions.',
              points: 5
            }
          ]
        }
      },
      {
        id: 'support-scenario',
        type: 'scenario',
        title: 'Getting the Right Support',
        description: 'Choose the best person to help in different situations',
        points: 20,
        content: {
          scenario: 'You\'re struggling with your college coursework and feeling overwhelmed about your future career options.',
          question: 'Who would be the best person to speak to first?',
          options: [
            'The night security guard',
            'Your Key Worker or Education Support Worker',
            'The maintenance person',
            'Wait and hope it gets better'
          ],
          correctAnswer: 1,
          explanation: 'Key Workers and Education Support Workers are trained to help with educational and career concerns.',
          followUp: 'Don\'t hesitate to ask for help - that\'s what the team is here for!'
        }
      }
    ]
  }
};
