import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Plus, Pencil, Trash2, X, AlertTriangle, FolderOpen, Trophy, RefreshCw, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBrainPopData, saveBrainPopData } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const defaultBrainPopData = {
  title: 'BrainPop',
  tagline: '',
  author: '',
  description: '',
  categories: []
};

const defaultCategoryData = {
  id: '',
  title: '',
  quizzes: []
};

const defaultQuizData = {
  id: '',
  title: '',
  description: '',
  url: '',
  type: 'Multiple Choice'
};

const QUIZ_TYPE_OPTIONS = [
  'Scrambled Words',
  'Crossword',
  'Visual Puzzle',
  'Coding Puzzle',
  'Mixed Quiz',
  'Multiple Choice',
  'Word Search'
];

// Helper Functions
const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Validation Functions
const validateBrainPopData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!data.tagline?.trim()) {
    errors.push('Tagline is required');
  }
  
  if (!data.author?.trim()) {
    errors.push('Author is required');
  }
  
  if (!data.description?.trim()) {
    errors.push('Description is required');
  }
  
  if (!data.categories || data.categories.length === 0) {
    errors.push('At least one category is required');
  }
  
  return errors;
};

const validateCategoryData = (category: any): string[] => {
  const errors: string[] = [];
  
  if (!category.id?.trim()) {
    errors.push('Category ID is required');
  } else if (!isValidSlug(category.id)) {
    errors.push('Category ID must be in kebab-case format (e.g., "c-programming")');
  }
  
  if (!category.title?.trim()) {
    errors.push('Category title is required');
  }
  
  return errors;
};

const validateQuizData = (quiz: any): string[] => {
  const errors: string[] = [];
  
  if (!quiz.id?.trim()) {
    errors.push('Quiz ID is required');
  } else if (!isValidSlug(quiz.id)) {
    errors.push('Quiz ID must be in kebab-case format (e.g., "scrambled-words-1")');
  }
  
  if (!quiz.title?.trim()) {
    errors.push('Quiz title is required');
  }
  
  if (!quiz.description?.trim()) {
    errors.push('Description is required');
  }
  
  if (!quiz.url?.trim()) {
    errors.push('URL is required');
  } else if (!isValidUrl(quiz.url)) {
    errors.push('URL must be a valid URL starting with http:// or https://');
  }
  
  if (!quiz.type?.trim()) {
    errors.push('Quiz type is required');
  }
  
  return errors;
};

const BrainPopEditor = () => {
  const [data, setData] = useState(defaultBrainPopData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [message, setMessage] = useState('');
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number>(-1);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [quizValidationErrors, setQuizValidationErrors] = useState<string[]>([]);
  const [categoryValidationErrors, setCategoryValidationErrors] = useState<string[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const firestoreData = await getBrainPopData();
      
      // Check if data is empty or undefined
      if (!firestoreData || Object.keys(firestoreData).length === 0) {
        setLoadError(true);
        setIsLoading(false);
        return;
      }
      
      // Normalize data with null-safe handling
      const normalizedData = {
        title: firestoreData.title || defaultBrainPopData.title,
        tagline: firestoreData.tagline || '',
        author: firestoreData.author || '',
        description: firestoreData.description || '',
        categories: Array.isArray(firestoreData.categories) ? firestoreData.categories.map((cat: any) => ({
          id: cat.id || '',
          title: cat.title || '',
          quizzes: Array.isArray(cat.quizzes) ? cat.quizzes.map((quiz: any) => ({
            id: quiz.id || '',
            title: quiz.title || '',
            description: quiz.description || '',
            url: quiz.url || '',
            type: quiz.type || 'Multiple Choice'
          })) : []
        })) : []
      };
      
      setData(normalizedData);
      
      // Validate loaded data
      const errors = validateBrainPopData(normalizedData);
      setValidationErrors(errors);
    } catch (error) {
      console.error('Error loading brainpop data:', error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    // Validate all data before saving
    const errors = validateBrainPopData(data);
    
    // Validate all categories
    data.categories.forEach((category: any, catIndex: number) => {
      const catErrors = validateCategoryData(category);
      if (catErrors.length > 0) {
        errors.push(`Category ${catIndex + 1} (${category.title || 'Untitled'}): ${catErrors.join(', ')}`);
      }
      
      // Validate all quizzes in category
      category.quizzes.forEach((quiz: any, quizIndex: number) => {
        const quizErrors = validateQuizData(quiz);
        if (quizErrors.length > 0) {
          errors.push(`Category "${category.title}" - Quiz ${quizIndex + 1} (${quiz.title || 'Untitled'}): ${quizErrors.join(', ')}`);
        }
      });
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      setIsSaving(false);
      setMessage('Please fix validation errors before saving');
      return;
    }

    try {
      const result = await saveBrainPopData(data);
      setMessage(result.message);
      setValidationErrors([]);
    } catch (error) {
      setMessage('Failed to save brainpop data.');
    } finally {
      setIsSaving(false);
    }
  };

  // Category Management
  const handleAddCategory = () => {
    setEditingCategory({ ...defaultCategoryData });
    setCategoryValidationErrors([]);
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: any, index: number) => {
    setEditingCategory({ ...category, index });
    setCategoryValidationErrors([]);
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!editingCategory) return;

    // Validate category data
    const errors = validateCategoryData(editingCategory);
    
    if (errors.length > 0) {
      setCategoryValidationErrors(errors);
      return;
    }

    // Auto-generate ID from title if empty
    const finalCategory = {
      ...editingCategory,
      id: editingCategory.id || generateSlug(editingCategory.title),
      title: editingCategory.title.trim(),
      quizzes: editingCategory.quizzes || []
    };

    const newCategories = [...data.categories];
    if (editingCategory.index !== undefined) {
      newCategories[editingCategory.index] = finalCategory;
    } else {
      newCategories.push(finalCategory);
    }
    
    setData({ ...data, categories: newCategories });
    setIsCategoryDialogOpen(false);
    setEditingCategory(null);
    setCategoryValidationErrors([]);
  };

  const handleDeleteCategory = (index: number) => {
    const category = data.categories[index];
    if (confirm(`Are you sure you want to delete the category "${category.title}" and all its ${category.quizzes.length} quiz(zes)?`)) {
      const newCategories = data.categories.filter((_, i) => i !== index);
      setData({ ...data, categories: newCategories });
    }
  };

  // Quiz Management
  const handleAddQuiz = (categoryIndex: number) => {
    setEditingCategoryIndex(categoryIndex);
    setEditingQuiz({ ...defaultQuizData });
    setQuizValidationErrors([]);
    setIsQuizDialogOpen(true);
  };

  const handleEditQuiz = (categoryIndex: number, quiz: any, quizIndex: number) => {
    setEditingCategoryIndex(categoryIndex);
    setEditingQuiz({ ...quiz, quizIndex });
    setQuizValidationErrors([]);
    setIsQuizDialogOpen(true);
  };

  const handleSaveQuiz = () => {
    if (!editingQuiz || editingCategoryIndex < 0) return;

    // Validate quiz data
    const errors = validateQuizData(editingQuiz);
    
    if (errors.length > 0) {
      setQuizValidationErrors(errors);
      return;
    }

    // Auto-generate ID from title if empty
    const finalQuiz = {
      ...editingQuiz,
      id: editingQuiz.id || generateSlug(editingQuiz.title),
      title: editingQuiz.title.trim(),
      description: editingQuiz.description.trim(),
      url: editingQuiz.url.trim(),
      type: editingQuiz.type.trim()
    };

    const newCategories = [...data.categories];
    const category = newCategories[editingCategoryIndex];
    
    if (editingQuiz.quizIndex !== undefined) {
      category.quizzes[editingQuiz.quizIndex] = finalQuiz;
    } else {
      category.quizzes.push(finalQuiz);
    }
    
    setData({ ...data, categories: newCategories });
    setIsQuizDialogOpen(false);
    setEditingQuiz(null);
    setEditingCategoryIndex(-1);
    setQuizValidationErrors([]);
  };

  const handleDeleteQuiz = (categoryIndex: number, quizIndex: number) => {
    const quiz = data.categories[categoryIndex].quizzes[quizIndex];
    if (confirm(`Are you sure you want to delete the quiz "${quiz.title}"?`)) {
      const newCategories = [...data.categories];
      newCategories[categoryIndex].quizzes = newCategories[categoryIndex].quizzes.filter((_, i) => i !== quizIndex);
      setData({ ...data, categories: newCategories });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner message="Loading quizzes..." />
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
                  Unable to load BrainPop data from Database. This could be due to a network issue or the data hasn't been created yet.
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

  const totalQuizzes = data.categories.reduce((sum: number, cat: any) => sum + (cat.quizzes?.length || 0), 0);

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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="categories">
            Categories ({data.categories.length})
          </TabsTrigger>
        </TabsList>

        {/* General Info Tab */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={data.title || ''}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="BrainPop"
              required
              className={!data.title ? 'border-red-300' : ''}
            />
            <p className="text-xs text-muted-foreground">Main title for the BrainPop section</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Tagline <span className="text-red-500">*</span>
            </Label>
            <Input
              value={data.tagline || ''}
              onChange={(e) => setData({ ...data, tagline: e.target.value })}
              placeholder="Feeding your brain is as important as feeding your body!"
              required
              className={!data.tagline ? 'border-red-300' : ''}
            />
            <p className="text-xs text-muted-foreground">Catchy tagline for BrainPop</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Author <span className="text-red-500">*</span>
            </Label>
            <Input
              value={data.author || ''}
              onChange={(e) => setData({ ...data, author: e.target.value })}
              placeholder="by Peter Davies"
              required
              className={!data.author ? 'border-red-300' : ''}
            />
            <p className="text-xs text-muted-foreground">Attribution (e.g., "by Peter Davies")</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              rows={4}
              value={data.description || ''}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="Brain-challenging quizzes, puzzles, and educational games to reinforce programming and computer science concepts."
              required
              className={!data.description ? 'border-red-300' : ''}
            />
            <p className="text-xs text-muted-foreground">Brief overview of the BrainPop section</p>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {data.categories.length} categor{data.categories.length !== 1 ? 'ies' : 'y'} • {totalQuizzes} total quiz{totalQuizzes !== 1 ? 'zes' : ''}
            </p>
            <Button onClick={handleAddCategory} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>

          <div className="space-y-4">
            {data.categories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="border-2">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-2 flex-1">
                      <FolderOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">{category.title}</h3>
                        <p className="text-sm text-muted-foreground">ID: {category.id} • {category.quizzes.length} quiz{category.quizzes.length !== 1 ? 'zes' : ''}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditCategory(category, categoryIndex)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddQuiz(categoryIndex)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Quiz
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteCategory(categoryIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid gap-3 ml-7">
                    {category.quizzes.map((quiz, quizIndex) => (
                      <Card key={quizIndex} className="bg-muted/50 border">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-start gap-2 mb-1">
                                <Trophy className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <h4 className="font-medium text-foreground">{quiz.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground ml-6 mb-2">{quiz.description}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground ml-6">
                                <span className="font-medium text-primary">{quiz.type}</span>
                                <span>•</span>
                                <span className="truncate max-w-xs">{quiz.url}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditQuiz(categoryIndex, quiz, quizIndex)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteQuiz(categoryIndex, quizIndex)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {category.quizzes.length === 0 && (
                      <div className="text-center py-6 border-2 border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground">No quizzes yet. Click "Add Quiz" to create one.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data.categories.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No categories yet. Click "Add Category" to create your first category.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSave} disabled={isSaving}>
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

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory?.index !== undefined ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              Update category information
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <>
              {categoryValidationErrors.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">Please fix these errors:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {categoryValidationErrors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={editingCategory.id || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="c-programming"
                    required
                    className={!editingCategory.id || !isValidSlug(editingCategory.id) ? 'border-red-300' : ''}
                  />
                  {editingCategory.id && !isValidSlug(editingCategory.id) && (
                    <p className="text-xs text-red-500">ID must be in kebab-case format (e.g., "c-programming")</p>
                  )}
                  <p className="text-xs text-muted-foreground">Unique identifier in kebab-case</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={editingCategory.title || ''}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setEditingCategory({ 
                        ...editingCategory, 
                        title: newTitle,
                        id: editingCategory.id || generateSlug(newTitle)
                      });
                    }}
                    placeholder="C Programming"
                    required
                    className={!editingCategory.title ? 'border-red-300' : ''}
                  />
                  <p className="text-xs text-muted-foreground">Category title (will auto-generate ID if empty)</p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCategory}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Category
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingQuiz?.quizIndex !== undefined ? 'Edit Quiz' : 'Add New Quiz'}
            </DialogTitle>
            <DialogDescription>
              Update quiz information including type, description, and URL
            </DialogDescription>
          </DialogHeader>
          {editingQuiz && (
            <>
              {quizValidationErrors.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">Please fix these errors:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {quizValidationErrors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={editingQuiz.id || ''}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="scrambled-words-1"
                    required
                    className={!editingQuiz.id || !isValidSlug(editingQuiz.id) ? 'border-red-300' : ''}
                  />
                  {editingQuiz.id && !isValidSlug(editingQuiz.id) && (
                    <p className="text-xs text-red-500">ID must be in kebab-case format (e.g., "scrambled-words-1")</p>
                  )}
                  <p className="text-xs text-muted-foreground">Unique identifier in kebab-case</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={editingQuiz.title || ''}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setEditingQuiz({ 
                        ...editingQuiz, 
                        title: newTitle,
                        id: editingQuiz.id || generateSlug(newTitle)
                      });
                    }}
                    placeholder="#1: Scrambled Words in C Language"
                    required
                    className={!editingQuiz.title ? 'border-red-300' : ''}
                  />
                  <p className="text-xs text-muted-foreground">Quiz title (will auto-generate ID if empty)</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={editingQuiz.type || 'Multiple Choice'} 
                    onValueChange={(value) => setEditingQuiz({ ...editingQuiz, type: value })}
                  >
                    <SelectTrigger className={!editingQuiz.type ? 'border-red-300' : ''}>
                      <SelectValue placeholder="Select quiz type" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUIZ_TYPE_OPTIONS.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Quiz type/format</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    rows={3}
                    value={editingQuiz.description || ''}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, description: e.target.value })}
                    placeholder="Answer should be in CAPITAL letters only"
                    required
                    className={!editingQuiz.description ? 'border-red-300' : ''}
                  />
                  <p className="text-xs text-muted-foreground">Instructions or description for the quiz</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="url"
                    value={editingQuiz.url || ''}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, url: e.target.value })}
                    placeholder="https://forms.gle/DgjwyRFoJjiBnoKQ7"
                    required
                    className={!editingQuiz.url || (editingQuiz.url && !isValidUrl(editingQuiz.url)) ? 'border-red-300' : ''}
                  />
                  {editingQuiz.url && !isValidUrl(editingQuiz.url) && (
                    <p className="text-xs text-red-500">Please enter a valid URL starting with http:// or https://</p>
                  )}
                  <p className="text-xs text-muted-foreground">External quiz link (Google Forms, etc.)</p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsQuizDialogOpen(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveQuiz}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Quiz
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrainPopEditor;
