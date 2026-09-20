
export interface User {
  id: string;
  name: string;
  age?: number;
  email?: string;
}

export interface TourSession {
  id: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  totalScore: number;
  locationProgress: LocationProgress[];
}

export interface LocationProgress {
  id: string;
  sessionId: string;
  locationName: string;
  completed: boolean;
  score: number;
  timeSpent: number;
  quizAnswers?: any;
  startedAt: Date;
  completedAt?: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'scenario';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

export interface LocationData {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  activities: Activity[];
  learningOutcomes: string[];
}

export interface Activity {
  id: string;
  type: 'quiz' | 'scenario' | 'game' | 'video' | 'reflection';
  title: string;
  description: string;
  content: any;
  points: number;
}

export interface Certificate {
  id: string;
  userId: string;
  sessionId: string;
  issueDate: Date;
  completionDate: Date;
  totalScore: number;
  locations: any;
}

export const LOCATIONS = [
  'bedroom',
  'fire-exit', 
  'kitchen',
  'chill-room',
  'entrance-hall',
  'office'
] as const;

export type LocationName = typeof LOCATIONS[number];
