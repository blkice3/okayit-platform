

export interface HomeContext {
  id: string;
  name: string;
  fullName: string;
  description: string;
  location: string;
  welcomeVideoUrl: string;
  theme: {
    primary: string;
    secondary: string;
    gradient: string;
  };
}

export const HOME_CONTEXTS: HomeContext[] = [
  {
    id: 'claudius',
    name: 'Claudius',
    fullName: 'Claudius Road',
    description: 'A caring home in North Hykeham, Lincoln for young people aged 8-18',
    location: 'North Hykeham, Lincoln',
    welcomeVideoUrl: 'https://www.youtube.com/embed/ICLP515py7U',
    theme: {
      primary: 'purple',
      secondary: 'pink',
      gradient: 'from-purple-600 to-pink-600'
    }
  },
  {
    id: 'winchester',
    name: 'Winchester',
    fullName: 'Winchester Close',
    description: 'A small family home in Bracebridge Heath, Lincoln for young people aged 8-18',
    location: 'Bracebridge Heath, Lincoln',
    welcomeVideoUrl: 'https://www.youtube.com/embed/kvgA2gZ5BLc',
    theme: {
      primary: 'blue',
      secondary: 'cyan',
      gradient: 'from-blue-600 to-indigo-600'
    }
  },
  {
    id: 'kingsnorth',
    name: 'Kingsnorth',
    fullName: 'Kingsnorth',
    description: 'A supportive care home in Newark for young people aged 8-18',
    location: 'Newark, Nottinghamshire',
    welcomeVideoUrl: '/kingsnorth-welcome.mp4',
    theme: {
      primary: 'green',
      secondary: 'emerald',
      gradient: 'from-emerald-600 to-green-600'
    }
  }
];

export const getHomeContext = (homeId: string): HomeContext | undefined => {
  const key = String(homeId || '').toLowerCase().replace(/^home-/, '');
  return HOME_CONTEXTS.find(home => home.id === key);
};
