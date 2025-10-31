import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Save, Plus, Edit2, Trash2, AlertTriangle, User, Briefcase, GraduationCap, Award, BookOpen, Lightbulb, Video, Globe, RefreshCw, AlertCircle } from 'lucide-react';
import { getProfileData, saveProfileData } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Default structures
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
    youtube: { url: '', description: '', content: '' }
  },
  seo: {
    title: '',
    description: '',
    keywords: ''
  }
};

const defaultEducationData = {
  degree: '',
  institution: '',
  year: '',
  focus: ''
};

const defaultPositionData = {
  title: '',
  institution: '',
  department: '',
  location: '',
  period: '',
  duration: '',
  description: ''
};

const defaultProjectData = {
  title: '',
  description: '',
  status: 'Ongoing',
  funding: ''
};

const defaultCourseData = {
  code: '',
  name: '',
  level: 'Undergraduate',
  description: ''
};

const defaultAchievementData = {
  title: '',
  organization: '',
  year: new Date().getFullYear(),
  description: ''
};

const COURSE_LEVEL_OPTIONS = ['Undergraduate', 'Postgraduate', 'Undergraduate/Postgraduate'];
const PROJECT_STATUS_OPTIONS = ['Ongoing', 'Completed', 'Planned'];

// Helper functions
const isValidUrl = (url: string): boolean => {
  if (!url) return true; // Empty is valid
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidEmail = (email: string): boolean => {
  if (!email) return true; // Empty is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation functions
const validateProfileData = (data: typeof defaultProfileData) => {
  const errors: string[] = [];
  
  // Personal info validation
  if (!data.personalInfo.name?.trim()) errors.push('Name is required');
  if (!data.personalInfo.email?.trim()) errors.push('Email is required');
  else if (!isValidEmail(data.personalInfo.email)) errors.push('Invalid email format');
  
  // Social links validation
  if (data.socialLinks.website && !isValidUrl(data.socialLinks.website)) errors.push('Invalid website URL');
  if (data.socialLinks.github && !isValidUrl(data.socialLinks.github)) errors.push('Invalid GitHub URL');
  if (data.socialLinks.linkedin && !isValidUrl(data.socialLinks.linkedin)) errors.push('Invalid LinkedIn URL');
  if (data.socialLinks.youtube && !isValidUrl(data.socialLinks.youtube)) errors.push('Invalid YouTube URL');
  
  // About validation
  if (!data.about.biography?.trim()) errors.push('Biography is required');
  
  // SEO validation
  if (!data.seo.title?.trim()) errors.push('SEO title is required');
  if (!data.seo.description?.trim()) errors.push('SEO description is required');
  
  return errors;
};

const validateEducationData = (data: typeof defaultEducationData) => {
  const errors: string[] = [];
  if (!data.degree?.trim()) errors.push('Degree is required');
  if (!data.institution?.trim()) errors.push('Institution is required');
  return errors;
};

const validatePositionData = (data: typeof defaultPositionData) => {
  const errors: string[] = [];
  if (!data.title?.trim()) errors.push('Position title is required');
  if (!data.institution?.trim()) errors.push('Institution is required');
  if (!data.description?.trim()) errors.push('Description is required');
  return errors;
};

const validateProjectData = (data: typeof defaultProjectData) => {
  const errors: string[] = [];
  if (!data.title?.trim()) errors.push('Project title is required');
  if (!data.description?.trim()) errors.push('Project description is required');
  return errors;
};

const validateCourseData = (data: typeof defaultCourseData) => {
  const errors: string[] = [];
  if (!data.code?.trim()) errors.push('Course code is required');
  if (!data.name?.trim()) errors.push('Course name is required');
  if (!data.description?.trim()) errors.push('Course description is required');
  return errors;
};

const validateAchievementData = (data: typeof defaultAchievementData) => {
  const errors: string[] = [];
  if (!data.title?.trim()) errors.push('Achievement title is required');
  if (!data.organization?.trim()) errors.push('Organization is required');
  if (!data.year || data.year < 1900 || data.year > new Date().getFullYear() + 10) {
    errors.push('Invalid year');
  }
  return errors;
};

const ProfileEditor = () => {
  const [profile, setProfile] = useState(defaultProfileData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Dialog states
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);
  
  // Editing items
  const [editingEducation, setEditingEducation] = useState<typeof defaultEducationData | null>(null);
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
  const [editingPosition, setEditingPosition] = useState<typeof defaultPositionData | null>(null);
  const [editingPositionIndex, setEditingPositionIndex] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<typeof defaultProjectData | null>(null);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [editingCourse, setEditingCourse] = useState<typeof defaultCourseData | null>(null);
  const [editingCourseIndex, setEditingCourseIndex] = useState<number | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<typeof defaultAchievementData | null>(null);
  const [editingAchievementIndex, setEditingAchievementIndex] = useState<number | null>(null);
  
  // Item validation errors
  const [educationValidationErrors, setEducationValidationErrors] = useState<string[]>([]);
  const [positionValidationErrors, setPositionValidationErrors] = useState<string[]>([]);
  const [projectValidationErrors, setProjectValidationErrors] = useState<string[]>([]);
  const [courseValidationErrors, setCourseValidationErrors] = useState<string[]>([]);
  const [achievementValidationErrors, setAchievementValidationErrors] = useState<string[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const data = await getProfileData();
      
      // Check if data is empty or undefined
      if (!data || Object.keys(data).length === 0) {
        setLoadError(true);
        setIsLoading(false);
        return;
      }
      
      // Normalize data to ensure all fields exist
      setProfile({
        ...defaultProfileData,
        ...data,
        personalInfo: { ...defaultProfileData.personalInfo, ...(data.personalInfo || {}) },
        socialLinks: { ...defaultProfileData.socialLinks, ...(data.socialLinks || {}) },
        about: { 
          ...defaultProfileData.about, 
          ...(data.about || {}),
          highlights: data.about?.highlights || []
        },
        education: Array.isArray(data.education) ? data.education : [],
        positions: Array.isArray(data.positions) ? data.positions : [],
        research: {
          ...defaultProfileData.research,
          ...(data.research || {}),
          interests: data.research?.interests || [],
          areas: data.research?.areas || [],
          projects: Array.isArray(data.research?.projects) ? data.research.projects : []
        },
        teaching: {
          ...defaultProfileData.teaching,
          ...(data.teaching || {}),
          courses: Array.isArray(data.teaching?.courses) ? data.teaching.courses : [],
          teachingMethods: data.teaching?.teachingMethods || [],
          students: {
            current: { phd: 0, masters: 0, ...(data.teaching?.students?.current || {}) },
            graduated: { phd: 0, masters: 0, ...(data.teaching?.students?.graduated || {}) },
            reach: data.teaching?.students?.reach || ''
          }
        },
        achievements: Array.isArray(data.achievements) ? data.achievements : [],
        contentCreation: {
          blog: { url: '', description: '', sections: [], ...(data.contentCreation?.blog || {}) },
          github: { url: '', repositories: [], description: '', ...(data.contentCreation?.github || {}) },
          youtube: { url: '', description: '', content: '', ...(data.contentCreation?.youtube || {}) }
        },
        seo: {
          ...defaultProfileData.seo,
          ...(data.seo || {}),
          keywords: typeof data.seo?.keywords === 'string' ? data.seo.keywords : (data.seo?.keywords || []).join(', ')
        }
      } as typeof defaultProfileData);
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    // Validate all data
    const errors = validateProfileData(profile);
    setValidationErrors(errors);

    if (errors.length > 0) {
      setMessage('Please fix validation errors before saving');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      // Convert keywords string to array for saving
      const dataToSave = {
        ...profile,
        seo: {
          ...profile.seo,
          keywords: profile.seo.keywords.split(',').map(k => k.trim()).filter(Boolean)
        },
        // Filter empty arrays
        about: {
          ...profile.about,
          highlights: profile.about.highlights.filter(h => h.trim())
        },
        research: {
          ...profile.research,
          interests: profile.research.interests.filter(i => i.trim()),
          areas: profile.research.areas.filter(a => a.trim()),
          projects: profile.research.projects
        },
        teaching: {
          ...profile.teaching,
          teachingMethods: profile.teaching.teachingMethods.filter(m => m.trim()),
          courses: profile.teaching.courses
        },
        contentCreation: {
          ...profile.contentCreation,
          blog: {
            ...profile.contentCreation.blog,
            sections: profile.contentCreation.blog.sections.filter(s => s.trim())
          },
          github: {
            ...profile.contentCreation.github,
            repositories: profile.contentCreation.github.repositories.filter(r => r.trim())
          }
        }
      };
      
      const result = await saveProfileData(dataToSave);
      setMessage(result.message);
    } catch (error) {
      setMessage('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Basic field handlers
  const handlePersonalInfoChange = (field: string, value: string) => {
    setProfile({ 
      ...profile, 
      personalInfo: { ...profile.personalInfo, [field]: value }
    });
  };

  const handleSocialLinkChange = (field: string, value: string) => {
    setProfile({ 
      ...profile, 
      socialLinks: { ...profile.socialLinks, [field]: value }
    });
  };

  const handleAboutChange = (field: string, value: string) => {
    setProfile({
      ...profile,
      about: { ...profile.about, [field]: value }
    });
  };

  const handleResearchChange = (field: string, value: string) => {
    setProfile({
      ...profile,
      research: { ...profile.research, [field]: value }
    });
  };

  const handleTeachingChange = (field: string, value: string) => {
    setProfile({
      ...profile,
      teaching: { ...profile.teaching, [field]: value }
    });
  };

  const handleStudentsChange = (category: 'current' | 'graduated', field: 'phd' | 'masters', value: string) => {
    setProfile({
      ...profile,
      teaching: {
        ...profile.teaching,
        students: {
          ...profile.teaching.students,
          [category]: {
            ...profile.teaching.students[category],
            [field]: parseInt(value) || 0
          }
        }
      }
    });
  };

  const handleContentCreationChange = (section: 'blog' | 'github' | 'youtube', field: string, value: string) => {
    setProfile({
      ...profile,
      contentCreation: {
        ...profile.contentCreation,
        [section]: {
          ...profile.contentCreation[section],
          [field]: value
        }
      }
    });
  };

  const handleSEOChange = (field: string, value: string) => {
    setProfile({
      ...profile,
      seo: { ...profile.seo, [field]: value }
    });
  };

  // Array field handlers
  const handleArrayFieldChange = (path: string, value: string) => {
    const items = value.split('\n').map(item => item.trim()).filter(Boolean);
    const pathParts = path.split('.');
    
    if (pathParts[0] === 'about') {
      setProfile({
        ...profile,
        about: { ...profile.about, [pathParts[1]]: items }
      });
    } else if (pathParts[0] === 'research') {
      setProfile({
        ...profile,
        research: { ...profile.research, [pathParts[1]]: items }
      });
    } else if (pathParts[0] === 'teaching') {
      setProfile({
        ...profile,
        teaching: { ...profile.teaching, [pathParts[1]]: items }
      });
    } else if (pathParts[0] === 'contentCreation') {
      setProfile({
        ...profile,
        contentCreation: {
          ...profile.contentCreation,
          [pathParts[1]]: {
            ...profile.contentCreation[pathParts[1] as keyof typeof profile.contentCreation],
            [pathParts[2]]: items
          }
        }
      });
    }
  };

  // Education handlers
  const handleAddEducation = () => {
    setEditingEducation({ ...defaultEducationData });
    setEditingEducationIndex(null);
    setEducationValidationErrors([]);
    setIsEducationDialogOpen(true);
  };

  const handleEditEducation = (index: number) => {
    setEditingEducation({ ...profile.education[index] });
    setEditingEducationIndex(index);
    setEducationValidationErrors([]);
    setIsEducationDialogOpen(true);
  };

  const handleSaveEducation = () => {
    if (!editingEducation) return;
    
    const errors = validateEducationData(editingEducation);
    setEducationValidationErrors(errors);
    
    if (errors.length > 0) return;

    const updatedEducation = [...profile.education];
    if (editingEducationIndex !== null) {
      updatedEducation[editingEducationIndex] = editingEducation;
    } else {
      updatedEducation.push(editingEducation);
    }

    setProfile({ ...profile, education: updatedEducation });
    setIsEducationDialogOpen(false);
    setEditingEducation(null);
    setEditingEducationIndex(null);
  };

  const handleDeleteEducation = (index: number) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      const updatedEducation = profile.education.filter((_, i) => i !== index);
      setProfile({ ...profile, education: updatedEducation });
    }
  };

  // Position handlers
  const handleAddPosition = () => {
    setEditingPosition({ ...defaultPositionData });
    setEditingPositionIndex(null);
    setPositionValidationErrors([]);
    setIsPositionDialogOpen(true);
  };

  const handleEditPosition = (index: number) => {
    setEditingPosition({ ...profile.positions[index] });
    setEditingPositionIndex(index);
    setPositionValidationErrors([]);
    setIsPositionDialogOpen(true);
  };

  const handleSavePosition = () => {
    if (!editingPosition) return;
    
    const errors = validatePositionData(editingPosition);
    setPositionValidationErrors(errors);
    
    if (errors.length > 0) return;

    const updatedPositions = [...profile.positions];
    if (editingPositionIndex !== null) {
      updatedPositions[editingPositionIndex] = editingPosition;
    } else {
      updatedPositions.push(editingPosition);
    }

    setProfile({ ...profile, positions: updatedPositions });
    setIsPositionDialogOpen(false);
    setEditingPosition(null);
    setEditingPositionIndex(null);
  };

  const handleDeletePosition = (index: number) => {
    if (confirm('Are you sure you want to delete this position?')) {
      const updatedPositions = profile.positions.filter((_, i) => i !== index);
      setProfile({ ...profile, positions: updatedPositions });
    }
  };

  // Project handlers
  const handleAddProject = () => {
    setEditingProject({ ...defaultProjectData });
    setEditingProjectIndex(null);
    setProjectValidationErrors([]);
    setIsProjectDialogOpen(true);
  };

  const handleEditProject = (index: number) => {
    setEditingProject({ ...profile.research.projects[index] });
    setEditingProjectIndex(index);
    setProjectValidationErrors([]);
    setIsProjectDialogOpen(true);
  };

  const handleSaveProject = () => {
    if (!editingProject) return;
    
    const errors = validateProjectData(editingProject);
    setProjectValidationErrors(errors);
    
    if (errors.length > 0) return;

    const updatedProjects = [...profile.research.projects];
    if (editingProjectIndex !== null) {
      updatedProjects[editingProjectIndex] = editingProject;
    } else {
      updatedProjects.push(editingProject);
    }

    setProfile({
      ...profile,
      research: { ...profile.research, projects: updatedProjects }
    });
    setIsProjectDialogOpen(false);
    setEditingProject(null);
    setEditingProjectIndex(null);
  };

  const handleDeleteProject = (index: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = profile.research.projects.filter((_, i) => i !== index);
      setProfile({
        ...profile,
        research: { ...profile.research, projects: updatedProjects }
      });
    }
  };

  // Course handlers
  const handleAddCourse = () => {
    setEditingCourse({ ...defaultCourseData });
    setEditingCourseIndex(null);
    setCourseValidationErrors([]);
    setIsCourseDialogOpen(true);
  };

  const handleEditCourse = (index: number) => {
    setEditingCourse({ ...profile.teaching.courses[index] });
    setEditingCourseIndex(index);
    setCourseValidationErrors([]);
    setIsCourseDialogOpen(true);
  };

  const handleSaveCourse = () => {
    if (!editingCourse) return;
    
    const errors = validateCourseData(editingCourse);
    setCourseValidationErrors(errors);
    
    if (errors.length > 0) return;

    const updatedCourses = [...profile.teaching.courses];
    if (editingCourseIndex !== null) {
      updatedCourses[editingCourseIndex] = editingCourse;
    } else {
      updatedCourses.push(editingCourse);
    }

    setProfile({
      ...profile,
      teaching: { ...profile.teaching, courses: updatedCourses }
    });
    setIsCourseDialogOpen(false);
    setEditingCourse(null);
    setEditingCourseIndex(null);
  };

  const handleDeleteCourse = (index: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      const updatedCourses = profile.teaching.courses.filter((_, i) => i !== index);
      setProfile({
        ...profile,
        teaching: { ...profile.teaching, courses: updatedCourses }
      });
    }
  };

  // Achievement handlers
  const handleAddAchievement = () => {
    setEditingAchievement({ ...defaultAchievementData });
    setEditingAchievementIndex(null);
    setAchievementValidationErrors([]);
    setIsAchievementDialogOpen(true);
  };

  const handleEditAchievement = (index: number) => {
    setEditingAchievement({ ...profile.achievements[index] });
    setEditingAchievementIndex(index);
    setAchievementValidationErrors([]);
    setIsAchievementDialogOpen(true);
  };

  const handleSaveAchievement = () => {
    if (!editingAchievement) return;
    
    const errors = validateAchievementData(editingAchievement);
    setAchievementValidationErrors(errors);
    
    if (errors.length > 0) return;

    const updatedAchievements = [...profile.achievements];
    if (editingAchievementIndex !== null) {
      updatedAchievements[editingAchievementIndex] = editingAchievement;
    } else {
      updatedAchievements.push(editingAchievement);
    }

    setProfile({ ...profile, achievements: updatedAchievements });
    setIsAchievementDialogOpen(false);
    setEditingAchievement(null);
    setEditingAchievementIndex(null);
  };

  const handleDeleteAchievement = (index: number) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      const updatedAchievements = profile.achievements.filter((_, i) => i !== index);
      setProfile({ ...profile, achievements: updatedAchievements });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner message="Loading profile data..." />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Failed to Load Data</h3>
                <p className="text-sm text-muted-foreground">
                  Unable to load profile data from Database. This could be due to a network issue or the data hasn't been created yet.
                </p>
              </div>
              <Button onClick={loadData} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Loading Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.includes('success') ? 'default' : 'destructive'}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Please fix the following errors:</div>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="teaching">Teaching</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Personal Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={profile.personalInfo.name}
                    onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                    className={!profile.personalInfo.name.trim() ? 'border-red-500' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={profile.personalInfo.designation}
                    onChange={(e) => handlePersonalInfoChange('designation', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={profile.personalInfo.institution}
                    onChange={(e) => handlePersonalInfoChange('institution', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profile.personalInfo.department}
                    onChange={(e) => handlePersonalInfoChange('department', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.personalInfo.location}
                    onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    className={!profile.personalInfo.email.trim() || !isValidEmail(profile.personalInfo.email) ? 'border-red-500' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={profile.personalInfo.tagline}
                    onChange={(e) => handlePersonalInfoChange('tagline', e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="office">Office</Label>
                  <Input
                    id="office"
                    value={profile.personalInfo.office}
                    onChange={(e) => handlePersonalInfoChange('office', e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="officeHours">Office Hours</Label>
                  <Input
                    id="officeHours"
                    value={profile.personalInfo.officeHours}
                    onChange={(e) => handlePersonalInfoChange('officeHours', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.socialLinks.website}
                    onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={profile.socialLinks.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profile.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={profile.socialLinks.youtube}
                    onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                    placeholder="https://youtube.com/@channel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={profile.socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={profile.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={profile.socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="biography">Biography *</Label>
                <Textarea
                  id="biography"
                  value={profile.about.biography}
                  onChange={(e) => handleAboutChange('biography', e.target.value)}
                  rows={10}
                  className={!profile.about.biography.trim() ? 'border-red-500' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  value={profile.about.mission}
                  onChange={(e) => handleAboutChange('mission', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Summary</Label>
                <Input
                  id="experience"
                  value={profile.about.experience}
                  onChange={(e) => handleAboutChange('experience', e.target.value)}
                  placeholder="18+ years of teaching experience"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlights">Highlights (one per line)</Label>
                <Textarea
                  id="highlights"
                  value={profile.about.highlights.join('\n')}
                  onChange={(e) => handleArrayFieldChange('about.highlights', e.target.value)}
                  rows={5}
                  placeholder="Enter each highlight on a new line"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Academic Positions ({profile.positions.length})
                </span>
                <Button onClick={handleAddPosition} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Position
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.positions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No positions added yet</p>
              ) : (
                <div className="space-y-4">
                  {profile.positions.map((position, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{position.title}</h4>
                            <p className="text-sm text-muted-foreground">{position.institution}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditPosition(index)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeletePosition(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{position.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education ({profile.education.length})
                </span>
                <Button onClick={handleAddEducation} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.education.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No education entries added yet</p>
              ) : (
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{edu.degree}</h4>
                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                            {edu.year && <p className="text-sm text-muted-foreground">{edu.year}</p>}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditEducation(index)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteEducation(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        {edu.focus && <p className="text-sm">{edu.focus}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements ({profile.achievements.length})
              </CardTitle>
              <Button onClick={handleAddAchievement} size="sm" className="absolute top-6 right-6">
                <Plus className="mr-2 h-4 w-4" />
                Add Achievement
              </Button>
            </CardHeader>
            <CardContent>
              {profile.achievements.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No achievements added yet</p>
              ) : (
                <div className="space-y-4">
                  {profile.achievements.map((achievement, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.organization} • {achievement.year}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditAchievement(index)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteAchievement(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm">{achievement.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Research Tab */}
        <TabsContent value="research" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Research Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="researchOverview">Research Overview</Label>
                <Textarea
                  id="researchOverview"
                  value={profile.research.overview}
                  onChange={(e) => handleResearchChange('overview', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Research Interests (one per line)</Label>
                <Textarea
                  id="interests"
                  value={profile.research.interests.join('\n')}
                  onChange={(e) => handleArrayFieldChange('research.interests', e.target.value)}
                  rows={6}
                  placeholder="Enter each interest on a new line"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areas">Research Areas (one per line)</Label>
                <Textarea
                  id="areas"
                  value={profile.research.areas.join('\n')}
                  onChange={(e) => handleArrayFieldChange('research.areas', e.target.value)}
                  rows={5}
                  placeholder="Enter each area on a new line"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Research Projects ({profile.research.projects.length})</span>
                <Button onClick={handleAddProject} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.research.projects.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No projects added yet</p>
              ) : (
                <div className="space-y-4">
                  {profile.research.projects.map((project, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{project.title}</h4>
                            <p className="text-sm text-muted-foreground">{project.status} • {project.funding}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditProject(index)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm">{project.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teaching Tab */}
        <TabsContent value="teaching" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Teaching Philosophy & Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="philosophy">Teaching Philosophy</Label>
                <Textarea
                  id="philosophy"
                  value={profile.teaching.philosophy}
                  onChange={(e) => handleTeachingChange('philosophy', e.target.value)}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teachingMethods">Teaching Methods (one per line)</Label>
                <Textarea
                  id="teachingMethods"
                  value={profile.teaching.teachingMethods.join('\n')}
                  onChange={(e) => handleArrayFieldChange('teaching.teachingMethods', e.target.value)}
                  rows={6}
                  placeholder="Enter each method on a new line"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Courses Taught ({profile.teaching.courses.length})</span>
                <Button onClick={handleAddCourse} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Course
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.teaching.courses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No courses added yet</p>
              ) : (
                <div className="space-y-4">
                  {profile.teaching.courses.map((course, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{course.code}</span>
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{course.level}</span>
                            </div>
                            <h4 className="font-semibold text-lg">{course.name}</h4>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditCourse(index)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{course.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Creation Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Content Creation Platforms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Blog</h4>
                <div className="space-y-2">
                  <Label htmlFor="blogUrl">Blog URL</Label>
                  <Input
                    id="blogUrl"
                    value={profile.contentCreation.blog.url}
                    onChange={(e) => handleContentCreationChange('blog', 'url', e.target.value)}
                    placeholder="https://blog.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blogDescription">Blog Description</Label>
                  <Textarea
                    id="blogDescription"
                    value={profile.contentCreation.blog.description}
                    onChange={(e) => handleContentCreationChange('blog', 'description', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blogSections">Blog Sections (one per line)</Label>
                  <Textarea
                    id="blogSections"
                    value={profile.contentCreation.blog.sections.join('\n')}
                    onChange={(e) => handleArrayFieldChange('contentCreation.blog.sections', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">GitHub</h4>
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    value={profile.contentCreation.github.url}
                    onChange={(e) => handleContentCreationChange('github', 'url', e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubDescription">GitHub Description</Label>
                  <Textarea
                    id="githubDescription"
                    value={profile.contentCreation.github.description}
                    onChange={(e) => handleContentCreationChange('github', 'description', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubRepos">Repository Names (one per line)</Label>
                  <Textarea
                    id="githubRepos"
                    value={profile.contentCreation.github.repositories.join('\n')}
                    onChange={(e) => handleArrayFieldChange('contentCreation.github.repositories', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">YouTube</h4>
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">YouTube URL</Label>
                  <Input
                    id="youtubeUrl"
                    value={profile.contentCreation.youtube.url}
                    onChange={(e) => handleContentCreationChange('youtube', 'url', e.target.value)}
                    placeholder="https://youtube.com/@channel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeDescription">YouTube Description</Label>
                  <Textarea
                    id="youtubeDescription"
                    value={profile.contentCreation.youtube.description}
                    onChange={(e) => handleContentCreationChange('youtube', 'description', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeContent">YouTube Content Description</Label>
                  <Textarea
                    id="youtubeContent"
                    value={profile.contentCreation.youtube.content}
                    onChange={(e) => handleContentCreationChange('youtube', 'content', e.target.value)}
                    rows={2}
                    placeholder="40+ tutorial videos covering..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title *</Label>
                <Input
                  id="seoTitle"
                  value={profile.seo.title}
                  onChange={(e) => handleSEOChange('title', e.target.value)}
                  className={!profile.seo.title.trim() ? 'border-red-500' : ''}
                  placeholder="Your Name - Title | Organization"
                />
                <p className="text-xs text-muted-foreground">Character count: {profile.seo.title.length} (recommended: 50-60)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description *</Label>
                <Textarea
                  id="seoDescription"
                  value={profile.seo.description}
                  onChange={(e) => handleSEOChange('description', e.target.value)}
                  rows={3}
                  className={!profile.seo.description.trim() ? 'border-red-500' : ''}
                  placeholder="Brief description of your profile and expertise"
                />
                <p className="text-xs text-muted-foreground">Character count: {profile.seo.description.length} (recommended: 150-160)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoKeywords">SEO Keywords (comma-separated)</Label>
                <Textarea
                  id="seoKeywords"
                  value={profile.seo.keywords}
                  onChange={(e) => handleSEOChange('keywords', e.target.value)}
                  rows={3}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end sticky bottom-4 bg-background/95 backdrop-blur-sm p-4 border rounded-lg shadow-lg">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      {/* Dialogs */}
      {renderEducationDialog()}
      {renderPositionDialog()}
      {renderProjectDialog()}
      {renderCourseDialog()}
      {renderAchievementDialog()}
    </div>
  );

  // Dialog render functions
  function renderEducationDialog() {
    if (!editingEducation) return null;

    return (
      <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEducationIndex !== null ? 'Edit Education' : 'Add Education'}</DialogTitle>
          </DialogHeader>

          {educationValidationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {educationValidationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eduDegree">Degree *</Label>
              <Input
                id="eduDegree"
                value={editingEducation.degree}
                onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                placeholder="Master of Computer Applications (MCA)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eduInstitution">Institution *</Label>
              <Input
                id="eduInstitution"
                value={editingEducation.institution}
                onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                placeholder="University Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eduYear">Year</Label>
              <Input
                id="eduYear"
                value={editingEducation.year}
                onChange={(e) => setEditingEducation({ ...editingEducation, year: e.target.value })}
                placeholder="2020"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eduFocus">Focus/Specialization</Label>
              <Input
                id="eduFocus"
                value={editingEducation.focus}
                onChange={(e) => setEditingEducation({ ...editingEducation, focus: e.target.value })}
                placeholder="Computer Applications and Software Engineering"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEducationDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEducation}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  function renderPositionDialog() {
    if (!editingPosition) return null;

    return (
      <Dialog open={isPositionDialogOpen} onOpenChange={setIsPositionDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPositionIndex !== null ? 'Edit Position' : 'Add Position'}</DialogTitle>
          </DialogHeader>

          {positionValidationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {positionValidationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="posTitle">Position Title *</Label>
              <Input
                id="posTitle"
                value={editingPosition.title}
                onChange={(e) => setEditingPosition({ ...editingPosition, title: e.target.value })}
                placeholder="Assistant Professor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="posInstitution">Institution *</Label>
              <Input
                id="posInstitution"
                value={editingPosition.institution}
                onChange={(e) => setEditingPosition({ ...editingPosition, institution: e.target.value })}
                placeholder="K.S. Rangasamy College of Technology"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="posDepartment">Department</Label>
              <Input
                id="posDepartment"
                value={editingPosition.department}
                onChange={(e) => setEditingPosition({ ...editingPosition, department: e.target.value })}
                placeholder="MCA Department"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="posLocation">Location</Label>
              <Input
                id="posLocation"
                value={editingPosition.location}
                onChange={(e) => setEditingPosition({ ...editingPosition, location: e.target.value })}
                placeholder="Tiruchengode"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="posPeriod">Period</Label>
              <Input
                id="posPeriod"
                value={editingPosition.period}
                onChange={(e) => setEditingPosition({ ...editingPosition, period: e.target.value })}
                placeholder="Present / Previous Role"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="posDuration">Duration</Label>
              <Input
                id="posDuration"
                value={editingPosition.duration}
                onChange={(e) => setEditingPosition({ ...editingPosition, duration: e.target.value })}
                placeholder="6 years / Current"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="posDescription">Description *</Label>
              <Textarea
                id="posDescription"
                value={editingPosition.description}
                onChange={(e) => setEditingPosition({ ...editingPosition, description: e.target.value })}
                rows={4}
                placeholder="Describe your role and responsibilities..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsPositionDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePosition}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  function renderProjectDialog() {
    if (!editingProject) return null;

    return (
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProjectIndex !== null ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>

          {projectValidationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {projectValidationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projTitle">Project Title *</Label>
              <Input
                id="projTitle"
                value={editingProject.title}
                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                placeholder="Research project title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projDescription">Description *</Label>
              <Textarea
                id="projDescription"
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                rows={4}
                placeholder="Describe the research project..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projStatus">Status</Label>
              <select
                id="projStatus"
                value={editingProject.status}
                onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {PROJECT_STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projFunding">Funding Source</Label>
              <Input
                id="projFunding"
                value={editingProject.funding}
                onChange={(e) => setEditingProject({ ...editingProject, funding: e.target.value })}
                placeholder="Educational Research Initiative"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProject}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  function renderCourseDialog() {
    if (!editingCourse) return null;

    return (
      <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourseIndex !== null ? 'Edit Course' : 'Add Course'}</DialogTitle>
          </DialogHeader>

          {courseValidationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {courseValidationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code *</Label>
              <Input
                id="courseCode"
                value={editingCourse.code}
                onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
                placeholder="MCA-C"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name *</Label>
              <Input
                id="courseName"
                value={editingCourse.name}
                onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                placeholder="C for Beginners"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseLevel">Level</Label>
              <select
                id="courseLevel"
                value={editingCourse.level}
                onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {COURSE_LEVEL_OPTIONS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseDescription">Description *</Label>
              <Textarea
                id="courseDescription"
                value={editingCourse.description}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                rows={4}
                placeholder="Describe the course content and objectives..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsCourseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCourse}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  function renderAchievementDialog() {
    if (!editingAchievement) return null;

    return (
      <Dialog open={isAchievementDialogOpen} onOpenChange={setIsAchievementDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAchievementIndex !== null ? 'Edit Achievement' : 'Add Achievement'}</DialogTitle>
          </DialogHeader>

          {achievementValidationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {achievementValidationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="achTitle">Achievement Title *</Label>
              <Input
                id="achTitle"
                value={editingAchievement.title}
                onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                placeholder="18+ Years of Teaching Excellence"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="achOrganization">Organization *</Label>
              <Input
                id="achOrganization"
                value={editingAchievement.organization}
                onChange={(e) => setEditingAchievement({ ...editingAchievement, organization: e.target.value })}
                placeholder="Organization or Institution"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="achYear">Year *</Label>
              <Input
                id="achYear"
                type="number"
                value={editingAchievement.year}
                onChange={(e) => setEditingAchievement({ ...editingAchievement, year: parseInt(e.target.value) || new Date().getFullYear() })}
                placeholder="2025"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="achDescription">Description</Label>
              <Textarea
                id="achDescription"
                value={editingAchievement.description}
                onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                rows={4}
                placeholder="Describe the achievement..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsAchievementDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAchievement}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
};

export default ProfileEditor;
