import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { 
  getProfileData, 
  getClassroomData, 
  getBrainPopData, 
  getTechieBitesData, 
  getTimePassData,
  getContentData 
} from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const profileDataFallback = {
  personalInfo: {
    name: '',
    title: '',
    designation: '',
    institution: '',
    department: '',
    location: '',
    photo: '',
    tagline: '',
    email: '',
    phone: '',
    office: '',
    officeHours: ''
  },
  socialLinks: {
    website: '',
    github: '',
    linkedin: '',
    youtube: '',
    facebook: '',
    twitter: '',
    instagram: ''
  },
  about: {
    biography: '',
    mission: '',
    experience: '',
    highlights: []
  },
  education: [],
  positions: [],
  research: {
    interests: [],
    overview: '',
    areas: [],
    projects: []
  },
  teaching: {
    philosophy: '',
    courses: [],
    teachingMethods: [],
    students: {
      current: { phd: 0, masters: 0 },
      graduated: { phd: 0, masters: 0 },
      reach: ''
    }
  },
  achievements: [],
  contentCreation: {
    blog: { url: '', description: '', sections: [] },
    github: { url: '', repositories: [], description: '' },
    youtube: { url: '', description: '', content: [] }
  },
  seo: {
    title: '',
    description: '',
    keywords: []
  }
};

const classroomDataFallback = {
  title: '',
  description: '',
  githubLink: '',
  githubNote: '',
  courses: []
};

const brainpopDataFallback = {
  title: '',
  tagline: '',
  description: '',
  author: '',
  categories: []
};

const techiebitesDataFallback = {
  title: '',
  description: '',
  posts: []
};

const timepassDataFallback = {
  title: '',
  description: '',
  entries: []
};

const contentDataFallback = {
  site: {
    title: '',
    tagline: '',
    description: '',
    url: '',
    author: '',
    founded: '',
    lastUpdated: ''
  },
  personal: {
    name: '',
    title: '',
    department: '',
    institution: '',
    location: '',
    tagline: '',
    photo: '',
    email: '',
    website: '',
    github: '',
    youtube: ''
  },
  about: {
    biography: '',
    mission: '',
    experience: '',
    specialization: [],
    professionalJourney: []
  },
  navigation: {
    main: []
  },
  sections: {},
  statistics: {
    teachingExperience: '',
    institutionsServed: 0,
    courses: 0,
    videoTutorials: '',
    articles: 0,
    quizzes: 0,
    githubRepos: '',
    studentsReached: ''
  },
  features: {},
  testimonials: [],
  contact: {
    email: '',
    institution: '',
    department: '',
    location: '',
    availability: ''
  },
  seo: {
    title: '',
    description: '',
    keywords: [],
    author: '',
    ogImage: '',
    twitterCard: ''
  },
  theme: {
    primaryColor: '',
    secondaryColor: '',
    accentColor: '',
    backgroundColor: '',
    textColor: ''
  },
  footer: {
    copyright: '',
    links: []
  }
};

interface DataContextType {
  profileData: typeof profileDataFallback;
  classroomData: typeof classroomDataFallback;
  brainpopData: typeof brainpopDataFallback;
  techiebitesData: typeof techiebitesDataFallback;
  timepassData: typeof timepassDataFallback;
  contentData: typeof contentDataFallback;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialLoad, setInitialLoad] = useState(true);
  
  const profile = useFirestoreData(() => getProfileData(), profileDataFallback);
  const classroom = useFirestoreData(() => getClassroomData(), classroomDataFallback);
  const brainpop = useFirestoreData(() => getBrainPopData(), brainpopDataFallback);
  const techiebites = useFirestoreData(() => getTechieBitesData(), techiebitesDataFallback);
  const timepass = useFirestoreData(() => getTimePassData(), timepassDataFallback);
  const content = useFirestoreData(() => getContentData(), contentDataFallback);

  const loading = 
    profile.loading || 
    classroom.loading || 
    brainpop.loading || 
    techiebites.loading || 
    timepass.loading || 
    content.loading;

  useEffect(() => {
    if (!loading && initialLoad) {
      const timer = setTimeout(() => {
        setInitialLoad(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, initialLoad]);

  const value: DataContextType = {
    profileData: profile.data as typeof profileDataFallback,
    classroomData: classroom.data as typeof classroomDataFallback,
    brainpopData: brainpop.data as typeof brainpopDataFallback,
    techiebitesData: techiebites.data as typeof techiebitesDataFallback,
    timepassData: timepass.data as typeof timepassDataFallback,
    contentData: content.data as typeof contentDataFallback,
    loading,
  };

  // Show full-page loading spinner on initial load
  if (initialLoad && loading) {
    return <LoadingSpinner variant="full" message="Loading Portfolio..." />;
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};