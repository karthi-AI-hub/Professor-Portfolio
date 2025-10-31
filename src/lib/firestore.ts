import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

const defaultProfileData = {
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

export const getProfileData = async () => {
  try {
    const docRef = doc(db, 'content', 'profile');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn('Profile data not found. Using default empty data.');
      return defaultProfileData;
    }
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
};

export const saveProfileData = async (data: any) => {
  try {
    const docRef = doc(db, 'content', 'profile');
    await setDoc(docRef, data);
    return { success: true, message: 'Profile saved successfully!' };
  } catch (error) {
    console.error('Error saving profile data:', error);
    return { success: false, message: 'Failed to save profile.' };
  }
};

// Classroom data operations
const defaultClassroomData = {
  title: '',
  description: '',
  githubLink: '',
  githubNote: '',
  courses: []
};

export const getClassroomData = async () => {
  try {
    const docRef = doc(db, 'content', 'classroom');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn('Classroom data not found in Firestore. Using default empty data.');
      return defaultClassroomData;
    }
  } catch (error) {
    console.error('Error fetching classroom data:', error);
    throw error;
  }
};

export const saveClassroomData = async (data: any) => {
  try {
    const docRef = doc(db, 'content', 'classroom');
    await setDoc(docRef, data);
    return { success: true, message: 'Classroom data saved successfully!' };
  } catch (error) {
    console.error('Error saving classroom data:', error);
    return { success: false, message: 'Failed to save classroom data.' };
  }
};

// BrainPop data operations
const defaultBrainPopData = {
  title: '',
  tagline: '',
  description: '',
  author: '',
  categories: []
};

export const getBrainPopData = async () => {
  try {
    const docRef = doc(db, 'content', 'brainpop');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn('BrainPop data not found in Firestore. Using default empty data.');
      return defaultBrainPopData;
    }
  } catch (error) {
    console.error('Error fetching brainpop data:', error);
    throw error;
  }
};

export const saveBrainPopData = async (data: any) => {
  try {
    const docRef = doc(db, 'content', 'brainpop');
    await setDoc(docRef, data);
    return { success: true, message: 'BrainPop data saved successfully!' };
  } catch (error) {
    console.error('Error saving brainpop data:', error);
    return { success: false, message: 'Failed to save brainpop data.' };
  }
};

// TechieBites data operations
const defaultTechieBitesData = {
  title: '',
  description: '',
  posts: []
};

export const getTechieBitesData = async () => {
  try {
    const docRef = doc(db, 'content', 'techiebites');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn('TechieBites data not found in Firestore. Using default empty data.');
      return defaultTechieBitesData;
    }
  } catch (error) {
    console.error('Error fetching techiebites data:', error);
    throw error;
  }
};

export const saveTechieBitesData = async (data: any) => {
  try {
    const docRef = doc(db, 'content', 'techiebites');
    await setDoc(docRef, data);
    return { success: true, message: 'TechieBites data saved successfully!' };
  } catch (error) {
    console.error('Error saving techiebites data:', error);
    return { success: false, message: 'Failed to save techiebites data.' };
  }
};

// TimePass data operations
const defaultTimePassData = {
  title: '',
  description: '',
  entries: []
};

export const getTimePassData = async () => {
  try {
    const docRef = doc(db, 'content', 'timepass');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn('TimePass data not found in Firestore. Using default empty data.');
      return defaultTimePassData;
    }
  } catch (error) {
    console.error('Error fetching timepass data:', error);
    throw error;
  }
};

export const saveTimePassData = async (data: any) => {
  try {
    const docRef = doc(db, 'content', 'timepass');
    await setDoc(docRef, data);
    return { success: true, message: 'TimePass data saved successfully!' };
  } catch (error) {
    console.error('Error saving timepass data:', error);
    return { success: false, message: 'Failed to save timepass data.' };
  }
};

// General content data operations
const defaultContentData = {
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

export const getContentData = async () => {
  try {
    const docRef = doc(db, 'content', 'general');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn('Content data not found. Using default empty data.');
      return defaultContentData;
    }
  } catch (error) {
    console.error('Error fetching content data:', error);
    throw error;
  }
};

export const saveContentData = async (data: any) => {
  try {
    const docRef = doc(db, 'content', 'general');
    await setDoc(docRef, data);
    return { success: true, message: 'Content data saved successfully!' };
  } catch (error) {
    console.error('Error saving content data:', error);
    return { success: false, message: 'Failed to save content data.' };
  }
};
