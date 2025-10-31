import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Plus, Pencil, Trash2, X, AlertTriangle, RefreshCw, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getClassroomData, saveClassroomData } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const defaultClassroomData = {
  title: 'Classroom',
  description: '',
  githubLink: '',
  githubNote: '',
  courses: []
};

const defaultCourseData = {
  id: '',
  title: '',
  slug: '',
  summary: '',
  description: '',
  icon: 'Code2',
  topics: [],
  materials: [],
  quizzes: [],
  link: ''
};

const ICON_OPTIONS = ['Code2', 'Code', 'Binary', 'Calculator'];
const MATERIAL_TYPES = ['Video', 'PDF', 'GitHub', 'PPT'];

// Validation functions
const isValidUrl = (url: string): boolean => {
  if (!url) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const ClassroomEditor = () => {
  const [data, setData] = useState(defaultClassroomData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courseValidationErrors, setCourseValidationErrors] = useState<string[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const firestoreData = await getClassroomData();
      
      // Check if data is empty or undefined
      if (!firestoreData || Object.keys(firestoreData).length === 0) {
        setLoadError(true);
        setIsLoading(false);
        return;
      }
      
      // Ensure data has default values for null/undefined fields
      const normalizedData = {
        title: firestoreData.title || defaultClassroomData.title,
        description: firestoreData.description || '',
        githubLink: firestoreData.githubLink || '',
        githubNote: firestoreData.githubNote || '',
        courses: (firestoreData.courses || []).map((course: any) => ({
          ...defaultCourseData,
          ...course,
          topics: course.topics || [],
          materials: course.materials || [],
          quizzes: course.quizzes || []
        }))
      };
      setData(normalizedData);
    } catch (error) {
      console.error('Error loading classroom data:', error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Validate general classroom data
  const validateClassroomData = (): string[] => {
    const errors: string[] = [];
    
    if (!data.title || data.title.trim() === '') {
      errors.push('Title is required');
    }
    
    if (!data.description || data.description.trim() === '') {
      errors.push('Description is required');
    }
    
    if (data.githubLink && !isValidUrl(data.githubLink)) {
      errors.push('GitHub Link must be a valid URL');
    }
    
    return errors;
  };

  // Validate course data
  const validateCourseData = (course: any): string[] => {
    const errors: string[] = [];
    
    if (!course.id || course.id.trim() === '') {
      errors.push('Course ID is required');
    }
    
    if (!course.title || course.title.trim() === '') {
      errors.push('Course Title is required');
    }
    
    if (!course.slug || course.slug.trim() === '') {
      errors.push('Course Slug is required');
    } else if (!isValidSlug(course.slug)) {
      errors.push('Course Slug must be lowercase with hyphens (e.g., "c-for-beginners")');
    }
    
    if (!course.summary || course.summary.trim() === '') {
      errors.push('Course Summary is required');
    }
    
    if (!course.description || course.description.trim() === '') {
      errors.push('Course Description is required');
    }
    
    if (!course.icon || course.icon.trim() === '') {
      errors.push('Course Icon is required');
    }
    
    // Validate materials
    if (course.materials && course.materials.length > 0) {
      course.materials.forEach((material: any, index: number) => {
        if (!material.title || material.title.trim() === '') {
          errors.push(`Material #${index + 1}: Title is required`);
        }
        if (!material.type || material.type.trim() === '') {
          errors.push(`Material #${index + 1}: Type is required`);
        }
        if (!material.url || material.url.trim() === '') {
          errors.push(`Material #${index + 1}: URL is required`);
        } else if (!isValidUrl(material.url)) {
          errors.push(`Material #${index + 1}: URL must be valid`);
        }
      });
    }
    
    // Validate quizzes
    if (course.quizzes && course.quizzes.length > 0) {
      course.quizzes.forEach((quiz: any, index: number) => {
        if (!quiz.title || quiz.title.trim() === '') {
          errors.push(`Quiz #${index + 1}: Title is required`);
        }
        if (!quiz.url || quiz.url.trim() === '') {
          errors.push(`Quiz #${index + 1}: URL is required`);
        } else if (!isValidUrl(quiz.url)) {
          errors.push(`Quiz #${index + 1}: URL must be valid`);
        }
      });
    }
    
    return errors;
  };

  const handleSave = async () => {
    // Validate general data
    const errors = validateClassroomData();
    
    // Validate all courses
    data.courses.forEach((course, index) => {
      const courseErrors = validateCourseData(course);
      if (courseErrors.length > 0) {
        errors.push(`Course "${course.title || index + 1}": ${courseErrors.join(', ')}`);
      }
    });
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      setMessage('Please fix validation errors before saving');
      return;
    }
    
    setValidationErrors([]);
    setIsSaving(true);
    setMessage('');

    try {
      const result = await saveClassroomData(data);
      setMessage(result.message);
    } catch (error) {
      setMessage('Failed to save classroom data.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCourse = (course: any, index: number) => {
    setEditingCourse({ ...course, index });
    setIsDialogOpen(true);
  };

  const handleSaveCourse = () => {
    if (!editingCourse) return;
    
    // Validate course before saving
    const errors = validateCourseData(editingCourse);
    if (errors.length > 0) {
      setCourseValidationErrors(errors);
      return;
    }
    
    setCourseValidationErrors([]);
    
    // Auto-generate slug if not provided
    if (!editingCourse.slug && editingCourse.title) {
      editingCourse.slug = generateSlug(editingCourse.title);
    }
    
    // Auto-generate ID if not provided
    if (!editingCourse.id && editingCourse.slug) {
      editingCourse.id = editingCourse.slug;
    }
    
    // Ensure arrays are not null/undefined
    const sanitizedCourse = {
      ...editingCourse,
      topics: editingCourse.topics || [],
      materials: (editingCourse.materials || []).filter((m: any) => m.title && m.url),
      quizzes: (editingCourse.quizzes || []).filter((q: any) => q.title && q.url)
    };
    
    const newCourses = [...data.courses];
    if (editingCourse.index !== undefined) {
      newCourses[editingCourse.index] = sanitizedCourse;
    } else {
      newCourses.push(sanitizedCourse);
    }
    setData({ ...data, courses: newCourses });
    setIsDialogOpen(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (index: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      const newCourses = data.courses.filter((_, i) => i !== index);
      setData({ ...data, courses: newCourses });
    }
  };

  const handleAddNew = () => {
    setCourseValidationErrors([]);
    setEditingCourse({
      ...defaultCourseData,
      id: `course-${Date.now()}`
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner message="Loading classroom data..." />
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
                  Unable to load classroom data from Database. This could be due to a network issue or the data hasn't been created yet.
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
            <div className="font-semibold mb-2">Validation Errors:</div>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="courses">Courses ({data.courses.length})</TabsTrigger>
        </TabsList>

        {/* General Info Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Classroom Information</CardTitle>
              <CardDescription>Edit the main classroom page details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-1">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={data.title || ''}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Classroom"
                  required
                  className={!data.title ? 'border-red-300' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-1">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={data.description || ''}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  placeholder="Teaching resources, tutorials, and comprehensive programming courses..."
                  required
                  className={!data.description ? 'border-red-300' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubLink">GitHub Link</Label>
                <Input
                  id="githubLink"
                  type="url"
                  value={data.githubLink || ''}
                  onChange={(e) => setData({ ...data, githubLink: e.target.value })}
                  placeholder="https://github.com/username"
                  className={data.githubLink && !isValidUrl(data.githubLink) ? 'border-red-300' : ''}
                />
                {data.githubLink && !isValidUrl(data.githubLink) && (
                  <p className="text-xs text-red-500">Please enter a valid URL</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubNote">GitHub Note</Label>
                <Input
                  id="githubNote"
                  value={data.githubNote || ''}
                  onChange={(e) => setData({ ...data, githubNote: e.target.value })}
                  placeholder="All course materials, code examples, and projects are available on GitHub..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Manage all courses and their content
            </p>
            <Button onClick={handleAddNew} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </div>

          <div className="grid gap-4">
            {data.courses.map((course, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription className="mt-1">{course.summary}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditCourse(course, index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteCourse(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Topics:</span> {course.topics?.length || 0}
                    </div>
                    <div>
                      <span className="font-medium">Materials:</span> {course.materials?.length || 0}
                    </div>
                    <div>
                      <span className="font-medium">Quizzes:</span> {course.quizzes?.length || 0}
                    </div>
                    <div>
                      <span className="font-medium">Icon:</span> {course.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end sticky bottom-4 bg-background p-4 border-t">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCourse?.index !== undefined ? 'Edit Course' : 'Add New Course'}
            </DialogTitle>
            <DialogDescription>
              Update all course information including topics, materials, and quizzes
            </DialogDescription>
          </DialogHeader>
          {editingCourse && (
            <>
              {courseValidationErrors.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">Please fix these errors:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {courseValidationErrors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="topics">Topics</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={editingCourse.id || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="c-for-beginners"
                      required
                      className={!editingCourse.id ? 'border-red-300' : ''}
                    />
                    <p className="text-xs text-muted-foreground">Unique identifier (lowercase with hyphens)</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={editingCourse.title || ''}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setEditingCourse({ 
                          ...editingCourse, 
                          title: newTitle,
                          // Auto-generate slug if not manually set
                          slug: editingCourse.slug || generateSlug(newTitle)
                        });
                      }}
                      placeholder="C for Beginners"
                      required
                      className={!editingCourse.title ? 'border-red-300' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={editingCourse.slug || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="c-for-beginners"
                      required
                      className={!editingCourse.slug || !isValidSlug(editingCourse.slug) ? 'border-red-300' : ''}
                    />
                    {editingCourse.slug && !isValidSlug(editingCourse.slug) && (
                      <p className="text-xs text-red-500">Slug must be lowercase with hyphens (no spaces or special characters)</p>
                    )}
                    <p className="text-xs text-muted-foreground">URL-friendly version (e.g., "c-for-beginners")</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Icon <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={editingCourse.icon || 'Code2'} 
                      onValueChange={(value) => setEditingCourse({ ...editingCourse, icon: value })}
                    >
                      <SelectTrigger className={!editingCourse.icon ? 'border-red-300' : ''}>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map(icon => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Visual icon for the course card</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Summary <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      rows={2}
                      value={editingCourse.summary || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, summary: e.target.value })}
                      placeholder="Master the fundamentals of C programming..."
                      required
                      className={!editingCourse.summary ? 'border-red-300' : ''}
                    />
                    <p className="text-xs text-muted-foreground">Brief overview (1-2 sentences)</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      rows={4}
                      value={editingCourse.description || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      placeholder="C is a general purpose high level language..."
                      required
                      className={!editingCourse.description ? 'border-red-300' : ''}
                    />
                    <p className="text-xs text-muted-foreground">Detailed course description</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Link</Label>
                    <Input
                      value={editingCourse.link || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, link: e.target.value })}
                      placeholder="/classroom/c-programming"
                    />
                    <p className="text-xs text-muted-foreground">Internal navigation link (optional)</p>
                  </div>
                </TabsContent>

              {/* Topics Tab */}
              <TabsContent value="topics" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Topics ({editingCourse.topics?.length || 0})</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const topics = editingCourse.topics || [];
                      setEditingCourse({ ...editingCourse, topics: [...topics, ''] });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Topic
                  </Button>
                </div>
                {(editingCourse.topics || []).some((t: string) => !t.trim()) && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Some topics are empty. Please fill in all topics or remove empty ones.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {(editingCourse.topics || []).map((topic: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={topic}
                        onChange={(e) => {
                          const newTopics = [...editingCourse.topics];
                          newTopics[index] = e.target.value;
                          setEditingCourse({ ...editingCourse, topics: newTopics });
                        }}
                        placeholder="Structure of C"
                        className={!topic.trim() ? 'border-red-300' : ''}
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const newTopics = editingCourse.topics.filter((_: string, i: number) => i !== index);
                          setEditingCourse({ ...editingCourse, topics: newTopics });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Materials Tab */}
              <TabsContent value="materials" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Materials ({editingCourse.materials?.length || 0})</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const materials = editingCourse.materials || [];
                      setEditingCourse({ ...editingCourse, materials: [...materials, { title: '', type: 'PDF', url: '' }] });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {(editingCourse.materials || []).map((material: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="pt-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <Label className="text-sm flex items-center gap-1">
                            Material #{index + 1} <span className="text-red-500">*</span>
                          </Label>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const newMaterials = editingCourse.materials.filter((_: any, i: number) => i !== index);
                              setEditingCourse({ ...editingCourse, materials: newMaterials });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="C Programming Lecture 1"
                            value={material.title || ''}
                            onChange={(e) => {
                              const newMaterials = [...editingCourse.materials];
                              newMaterials[index] = { ...material, title: e.target.value };
                              setEditingCourse({ ...editingCourse, materials: newMaterials });
                            }}
                            required
                            className={!material.title ? 'border-red-300' : ''}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            Type <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={material.type || 'PDF'}
                            onValueChange={(value) => {
                              const newMaterials = [...editingCourse.materials];
                              newMaterials[index] = { ...material, type: value };
                              setEditingCourse({ ...editingCourse, materials: newMaterials });
                            }}
                          >
                            <SelectTrigger className={!material.type ? 'border-red-300' : ''}>
                              <SelectValue placeholder="Select material type" />
                            </SelectTrigger>
                            <SelectContent>
                              {MATERIAL_TYPES.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            URL <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="url"
                            placeholder="https://example.com/material.pdf"
                            value={material.url || ''}
                            onChange={(e) => {
                              const newMaterials = [...editingCourse.materials];
                              newMaterials[index] = { ...material, url: e.target.value };
                              setEditingCourse({ ...editingCourse, materials: newMaterials });
                            }}
                            required
                            className={!material.url || (material.url && !isValidUrl(material.url)) ? 'border-red-300' : ''}
                          />
                          {material.url && !isValidUrl(material.url) && (
                            <p className="text-xs text-red-500">Please enter a valid URL starting with http:// or https://</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Quizzes Tab */}
              <TabsContent value="quizzes" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Quizzes ({editingCourse.quizzes?.length || 0})</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const quizzes = editingCourse.quizzes || [];
                      setEditingCourse({ ...editingCourse, quizzes: [...quizzes, { title: '', url: '' }] });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Quiz
                  </Button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {(editingCourse.quizzes || []).map((quiz: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="pt-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <Label className="text-sm flex items-center gap-1">
                            Quiz #{index + 1} <span className="text-red-500">*</span>
                          </Label>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const newQuizzes = editingCourse.quizzes.filter((_: any, i: number) => i !== index);
                              setEditingCourse({ ...editingCourse, quizzes: newQuizzes });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="Chapter 1 Quiz"
                            value={quiz.title || ''}
                            onChange={(e) => {
                              const newQuizzes = [...editingCourse.quizzes];
                              newQuizzes[index] = { ...quiz, title: e.target.value };
                              setEditingCourse({ ...editingCourse, quizzes: newQuizzes });
                            }}
                            required
                            className={!quiz.title ? 'border-red-300' : ''}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            URL <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="url"
                            placeholder="https://example.com/quiz"
                            value={quiz.url || ''}
                            onChange={(e) => {
                              const newQuizzes = [...editingCourse.quizzes];
                              newQuizzes[index] = { ...quiz, url: e.target.value };
                              setEditingCourse({ ...editingCourse, quizzes: newQuizzes });
                            }}
                            required
                            className={!quiz.url || (quiz.url && !isValidUrl(quiz.url)) ? 'border-red-300' : ''}
                          />
                          {quiz.url && !isValidUrl(quiz.url) && (
                            <p className="text-xs text-red-500">Please enter a valid URL starting with http:// or https://</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

                <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCourse}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Course
                  </Button>
                </div>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassroomEditor;
