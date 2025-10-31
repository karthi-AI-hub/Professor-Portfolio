import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Plus, Pencil, Trash2, X, AlertTriangle, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getTechieBitesData, saveTechieBitesData } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const defaultTechieBitesData = {
  title: 'TechieBites',
  description: '',
  posts: []
};

const defaultPostData = {
  id: '',
  title: '',
  date: new Date().toISOString().split('T')[0],
  excerpt: '',
  content: '',
  category: 'Technology Trends',
  featured: false,
  author: ''
};

const CATEGORY_OPTIONS = [
  'Artificial Intelligence',
  'Career Development',
  'Cybersecurity',
  'Digital Tools',
  'Electric Vehicles',
  'Fun with Math',
  'Hardware',
  'Language & Communication',
  'Programming',
  'Technology Trends'
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

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Validation Functions
const validateTechieBitesData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!data.description?.trim()) {
    errors.push('Description is required');
  }
  
  return errors;
};

const validatePostData = (post: any): string[] => {
  const errors: string[] = [];
  
  if (!post.id?.trim()) {
    errors.push('Post ID is required');
  } else if (!isValidSlug(post.id)) {
    errors.push('Post ID must be in kebab-case format (e.g., "my-article-title")');
  }
  
  if (!post.title?.trim()) {
    errors.push('Post title is required');
  }
  
  if (!post.date?.trim()) {
    errors.push('Date is required');
  } else if (!isValidDate(post.date)) {
    errors.push('Date must be a valid date');
  }
  
  if (!post.excerpt?.trim()) {
    errors.push('Excerpt is required');
  }
  
  if (!post.content?.trim()) {
    errors.push('Content is required');
  }
  
  if (!post.category?.trim()) {
    errors.push('Category is required');
  }
  
  return errors;
};

const TechieBitesEditor = () => {
  const [data, setData] = useState(defaultTechieBitesData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [message, setMessage] = useState('');
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [postValidationErrors, setPostValidationErrors] = useState<string[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const firestoreData = await getTechieBitesData();
      
      // Check if data is empty or undefined
      if (!firestoreData || Object.keys(firestoreData).length === 0) {
        setLoadError(true);
        setIsLoading(false);
        return;
      }
      
      // Normalize data with null-safe handling
      const normalizedData = {
        title: firestoreData.title || defaultTechieBitesData.title,
        description: firestoreData.description || '',
        posts: Array.isArray(firestoreData.posts) ? firestoreData.posts.map((post: any) => ({
          id: post.id || '',
          title: post.title || '',
          date: post.date || new Date().toISOString().split('T')[0],
          excerpt: post.excerpt || '',
          content: post.content || '',
          category: post.category || 'Technology Trends',
          featured: post.featured || false,
          author: post.author || ''
        })) : []
      };
      
      setData(normalizedData);
      
      // Validate loaded data
      const errors = validateTechieBitesData(normalizedData);
      setValidationErrors(errors);
    } catch (error) {
      console.error('Error loading techiebites data:', error);
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
    const errors = validateTechieBitesData(data);
    
    // Validate all posts
    data.posts.forEach((post: any, index: number) => {
      const postErrors = validatePostData(post);
      if (postErrors.length > 0) {
        errors.push(`Post ${index + 1} (${post.title || 'Untitled'}): ${postErrors.join(', ')}`);
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      setIsSaving(false);
      setMessage('Please fix validation errors before saving');
      return;
    }

    try {
      const result = await saveTechieBitesData(data);
      setMessage(result.message);
      setValidationErrors([]);
    } catch (error) {
      setMessage('Failed to save techiebites data.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPost = (post: any, index: number) => {
    setEditingPost({ ...post, index });
    setIsDialogOpen(true);
  };

  const handleSavePost = () => {
    if (!editingPost) return;

    // Validate post data
    const errors = validatePostData(editingPost);
    
    if (errors.length > 0) {
      setPostValidationErrors(errors);
      return;
    }

    // Auto-generate ID from title if empty
    const finalPost = {
      ...editingPost,
      id: editingPost.id || generateSlug(editingPost.title),
      // Sanitize data
      title: editingPost.title.trim(),
      excerpt: editingPost.excerpt.trim(),
      content: editingPost.content.trim(),
      category: editingPost.category.trim(),
      author: editingPost.author?.trim() || ''
    };

    const newPosts = [...data.posts];
    if (editingPost.index !== undefined) {
      newPosts[editingPost.index] = finalPost;
    } else {
      newPosts.push(finalPost);
    }
    
    setData({ ...data, posts: newPosts });
    setIsDialogOpen(false);
    setEditingPost(null);
    setPostValidationErrors([]);
  };

  const handleDeletePost = (index: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const newPosts = data.posts.filter((_, i) => i !== index);
      setData({ ...data, posts: newPosts });
    }
  };

  const handleAddNew = () => {
    setEditingPost({ ...defaultPostData });
    setPostValidationErrors([]);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner message="Loading articles..." />
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
                  Unable to load TechieBites data from Database. This could be due to a network issue or the data hasn't been created yet.
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="posts">
            Posts ({data.posts.length})
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
              placeholder="TechieBites"
              required
              className={!data.title ? 'border-red-300' : ''}
            />
            <p className="text-xs text-muted-foreground">Main title for the TechieBites section</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              rows={4}
              value={data.description || ''}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="Some of the Information related to IT field will be posted in Techie Bites..."
              required
              className={!data.description ? 'border-red-300' : ''}
            />
            <p className="text-xs text-muted-foreground">Brief overview of the TechieBites section</p>
          </div>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {data.posts.length} article{data.posts.length !== 1 ? 's' : ''} • {data.posts.filter((p: any) => p.featured).length} featured
            </p>
            <Button onClick={handleAddNew} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Article
            </Button>
          </div>

          <div className="grid gap-4">
            {data.posts.map((post, index) => (
              <Card key={index} className="border-2 hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2">
                        {post.featured && (
                          <Sparkles className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{post.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium text-primary">{post.category}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                        {post.author && (
                          <>
                            <span>•</span>
                            <span>{post.author}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="text-foreground/60">ID: {post.id}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditPost(post, index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeletePost(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data.posts.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No articles yet. Click "Add Article" to create your first post.</p>
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

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost?.index !== undefined ? 'Edit Article' : 'Add New Article'}
            </DialogTitle>
            <DialogDescription>
              Update all article information including metadata and content
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <>
              {postValidationErrors.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">Please fix these errors:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {postValidationErrors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={editingPost.id || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="my-article-slug"
                      required
                      className={!editingPost.id || !isValidSlug(editingPost.id) ? 'border-red-300' : ''}
                    />
                    {editingPost.id && !isValidSlug(editingPost.id) && (
                      <p className="text-xs text-red-500">ID must be in kebab-case format (e.g., "my-article-title")</p>
                    )}
                    <p className="text-xs text-muted-foreground">Unique identifier in kebab-case (lowercase with hyphens)</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={editingPost.title || ''}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setEditingPost({ 
                          ...editingPost, 
                          title: newTitle,
                          // Auto-generate ID from title if ID is empty
                          id: editingPost.id || generateSlug(newTitle)
                        });
                      }}
                      placeholder="ChatGPT vs Gemini vs Copilot"
                      required
                      className={!editingPost.title ? 'border-red-300' : ''}
                    />
                    <p className="text-xs text-muted-foreground">Article title (will auto-generate ID if empty)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={editingPost.category || 'Technology Trends'} 
                        onValueChange={(value) => setEditingPost({ ...editingPost, category: value })}
                      >
                        <SelectTrigger className={!editingPost.category ? 'border-red-300' : ''}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Article category</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={editingPost.date || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                        required
                        className={!editingPost.date || !isValidDate(editingPost.date) ? 'border-red-300' : ''}
                      />
                      <p className="text-xs text-muted-foreground">Publication date</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Author</Label>
                    <Input
                      value={editingPost.author || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      placeholder="G.Pavithran, I B.E AIML and K.Kiruthika, Technical Trainer"
                    />
                    <p className="text-xs text-muted-foreground">Author name(s) - optional</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        Featured Article
                      </Label>
                      <Switch
                        checked={editingPost.featured || false}
                        onCheckedChange={(checked) => setEditingPost({ ...editingPost, featured: checked })}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Mark as featured to highlight this article</p>
                  </div>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Excerpt <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      rows={3}
                      value={editingPost.excerpt || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      placeholder="A brief summary of the article..."
                      required
                      className={!editingPost.excerpt ? 'border-red-300' : ''}
                    />
                    <p className="text-xs text-muted-foreground">
                      Brief summary (1-2 sentences) • {editingPost.excerpt?.length || 0} characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Full Content <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      rows={16}
                      value={editingPost.content || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      placeholder="The complete article content...

Use line breaks to separate paragraphs.

You can write multiple paragraphs here."
                      required
                      className={!editingPost.content ? 'border-red-300' : ''}
                    />
                    <p className="text-xs text-muted-foreground">
                      Full article content • {editingPost.content?.length || 0} characters • ~{Math.ceil((editingPost.content?.split(/\s+/).length || 0) / 200)} min read
                    </p>
                  </div>
                </TabsContent>

                <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSavePost}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Article
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

export default TechieBitesEditor;