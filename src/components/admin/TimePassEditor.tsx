import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Plus, Pencil, Trash2, X, AlertTriangle, Star, Video, RefreshCw, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getTimePassData, saveTimePassData } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const defaultTimePassData = {
  title: 'TimePass',
  description: '',
  entries: []
};

const defaultEntryData = {
  id: '',
  title: '',
  category: 'Puzzle Games',
  type: 'Puzzle Game',
  content: '',
  featured: false,
  videos: []
};

const defaultVideoData = {
  title: '',
  url: ''
};

const CATEGORY_OPTIONS = [
  'Fun with numbers',
  'Puzzle Games'
];

const TYPE_OPTIONS = [
  'Math Trick',
  'Puzzle Game'
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

const isValidYouTubeUrl = (url: string): boolean => {
  return isValidUrl(url) && (url.includes('youtube.com') || url.includes('youtu.be'));
};

// Validation Functions
const validateTimePassData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!data.description?.trim()) {
    errors.push('Description is required');
  }
  
  return errors;
};

const validateEntryData = (entry: any): string[] => {
  const errors: string[] = [];
  
  if (!entry.id?.trim()) {
    errors.push('Entry ID is required');
  } else if (!isValidSlug(entry.id)) {
    errors.push('Entry ID must be in kebab-case format (e.g., "my-puzzle-title")');
  }
  
  if (!entry.title?.trim()) {
    errors.push('Entry title is required');
  }
  
  if (!entry.category?.trim()) {
    errors.push('Category is required');
  }
  
  if (!entry.type?.trim()) {
    errors.push('Type is required');
  }
  
  if (!entry.content?.trim()) {
    errors.push('Content is required');
  }
  
  // Validate videos if present
  if (entry.videos && entry.videos.length > 0) {
    entry.videos.forEach((video: any, index: number) => {
      if (!video.title?.trim()) {
        errors.push(`Video ${index + 1}: Title is required`);
      }
      if (!video.url?.trim()) {
        errors.push(`Video ${index + 1}: URL is required`);
      } else if (!isValidYouTubeUrl(video.url)) {
        errors.push(`Video ${index + 1}: Must be a valid YouTube URL`);
      }
    });
  }
  
  return errors;
};

const TimePassEditor = () => {
  const [data, setData] = useState(defaultTimePassData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [message, setMessage] = useState('');
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [entryValidationErrors, setEntryValidationErrors] = useState<string[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const firestoreData = await getTimePassData();
      
      // Check if data is empty or undefined
      if (!firestoreData || Object.keys(firestoreData).length === 0) {
        setLoadError(true);
        setIsLoading(false);
        return;
      }
      
      // Normalize data with null-safe handling
      const normalizedData = {
        title: firestoreData.title || defaultTimePassData.title,
        description: firestoreData.description || '',
        entries: Array.isArray(firestoreData.entries) ? firestoreData.entries.map((entry: any) => ({
          id: entry.id || '',
          title: entry.title || '',
          category: entry.category || 'Puzzle Games',
          type: entry.type || 'Puzzle Game',
          content: entry.content || '',
          featured: entry.featured || false,
          videos: Array.isArray(entry.videos) ? entry.videos.map((video: any) => ({
            title: video.title || '',
            url: video.url || ''
          })) : []
        })) : []
      };
      
      setData(normalizedData);
      
      // Validate loaded data
      const errors = validateTimePassData(normalizedData);
      setValidationErrors(errors);
    } catch (error) {
      console.error('Error loading timepass data:', error);
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
    const errors = validateTimePassData(data);
    
    // Validate all entries
    data.entries.forEach((entry: any, index: number) => {
      const entryErrors = validateEntryData(entry);
      if (entryErrors.length > 0) {
        errors.push(`Entry ${index + 1} (${entry.title || 'Untitled'}): ${entryErrors.join(', ')}`);
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      setIsSaving(false);
      setMessage('Please fix validation errors before saving');
      return;
    }

    try {
      const result = await saveTimePassData(data);
      setMessage(result.message);
      setValidationErrors([]);
    } catch (error) {
      setMessage('Failed to save timepass data.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditEntry = (entry: any, index: number) => {
    setEditingEntry({ ...entry, index });
    setEntryValidationErrors([]);
    setIsDialogOpen(true);
  };

  const handleSaveEntry = () => {
    if (!editingEntry) return;

    // Validate entry data
    const errors = validateEntryData(editingEntry);
    
    if (errors.length > 0) {
      setEntryValidationErrors(errors);
      return;
    }

    // Auto-generate ID from title if empty
    const finalEntry = {
      ...editingEntry,
      id: editingEntry.id || generateSlug(editingEntry.title),
      // Sanitize data
      title: editingEntry.title.trim(),
      content: editingEntry.content.trim(),
      category: editingEntry.category.trim(),
      type: editingEntry.type.trim(),
      // Filter out empty videos
      videos: (editingEntry.videos || []).filter((video: any) => 
        video.title?.trim() && video.url?.trim()
      )
    };

    const newEntries = [...data.entries];
    if (editingEntry.index !== undefined) {
      newEntries[editingEntry.index] = finalEntry;
    } else {
      newEntries.push(finalEntry);
    }
    
    setData({ ...data, entries: newEntries });
    setIsDialogOpen(false);
    setEditingEntry(null);
    setEntryValidationErrors([]);
  };

  const handleDeleteEntry = (index: number) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const newEntries = data.entries.filter((_, i) => i !== index);
      setData({ ...data, entries: newEntries });
    }
  };

  const handleAddNew = () => {
    setEditingEntry({ ...defaultEntryData });
    setEntryValidationErrors([]);
    setIsDialogOpen(true);
  };

  const handleAddVideo = () => {
    if (!editingEntry) return;
    const videos = editingEntry.videos || [];
    setEditingEntry({ ...editingEntry, videos: [...videos, { ...defaultVideoData }] });
  };

  const handleDeleteVideo = (videoIndex: number) => {
    if (!editingEntry) return;
    const newVideos = editingEntry.videos.filter((_: any, i: number) => i !== videoIndex);
    setEditingEntry({ ...editingEntry, videos: newVideos });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner message="Loading puzzles..." />
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
                  Unable to load TimePass data from Database. This could be due to a network issue or the data hasn't been created yet.
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
          <TabsTrigger value="entries">
            Puzzles ({data.entries.length})
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
              placeholder="TimePass"
              required
              className={!data.title ? 'border-red-300' : ''}
            />
            <p className="text-xs text-muted-foreground">Main title for the TimePass section</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              rows={4}
              value={data.description || ''}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="Brain out Games video links are posted in this page. Fun with mathematics, brain teasers, and creative problem-solving puzzles."
              required
              className={!data.description ? 'border-red-300' : ''}
            />
            <p className="text-xs text-muted-foreground">Brief overview of the TimePass section</p>
          </div>
        </TabsContent>

        {/* Entries Tab */}
        <TabsContent value="entries" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {data.entries.length} puzzle{data.entries.length !== 1 ? 's' : ''} • {data.entries.filter((e: any) => e.featured).length} featured • {data.entries.filter((e: any) => e.videos && e.videos.length > 0).length} with videos
            </p>
            <Button onClick={handleAddNew} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Puzzle
            </Button>
          </div>

          <div className="grid gap-4">
            {data.entries.map((entry, index) => (
              <Card key={index} className="border-2 hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2">
                        {entry.featured && (
                          <Star className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{entry.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{entry.content.split('\n')[0]}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium text-primary">{entry.category}</span>
                        <span>•</span>
                        <span>{entry.type}</span>
                        {entry.videos && entry.videos.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              {entry.videos.length} video{entry.videos.length > 1 ? 's' : ''}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span className="text-foreground/60">ID: {entry.id}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditEntry(entry, index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteEntry(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data.entries.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No puzzles yet. Click "Add Puzzle" to create your first entry.</p>
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
              {editingEntry?.index !== undefined ? 'Edit Puzzle' : 'Add New Puzzle'}
            </DialogTitle>
            <DialogDescription>
              Update all puzzle information including metadata, content, and video solutions
            </DialogDescription>
          </DialogHeader>
          {editingEntry && (
            <>
              {entryValidationErrors.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">Please fix these errors:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {entryValidationErrors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="videos">
                    Videos ({editingEntry.videos?.length || 0})
                  </TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={editingEntry.id || ''}
                      onChange={(e) => setEditingEntry({ ...editingEntry, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="birth-year-trick"
                      required
                      className={!editingEntry.id || !isValidSlug(editingEntry.id) ? 'border-red-300' : ''}
                    />
                    {editingEntry.id && !isValidSlug(editingEntry.id) && (
                      <p className="text-xs text-red-500">ID must be in kebab-case format (e.g., "birth-year-trick")</p>
                    )}
                    <p className="text-xs text-muted-foreground">Unique identifier in kebab-case (lowercase with hyphens)</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={editingEntry.title || ''}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setEditingEntry({ 
                          ...editingEntry, 
                          title: newTitle,
                          // Auto-generate ID from title if ID is empty
                          id: editingEntry.id || generateSlug(newTitle)
                        });
                      }}
                      placeholder="Birth Year from Mobile Number"
                      required
                      className={!editingEntry.title ? 'border-red-300' : ''}
                    />
                    <p className="text-xs text-muted-foreground">Puzzle title (will auto-generate ID if empty)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={editingEntry.category || 'Puzzle Games'} 
                        onValueChange={(value) => setEditingEntry({ ...editingEntry, category: value })}
                      >
                        <SelectTrigger className={!editingEntry.category ? 'border-red-300' : ''}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Puzzle category</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        Type <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={editingEntry.type || 'Puzzle Game'} 
                        onValueChange={(value) => setEditingEntry({ ...editingEntry, type: value })}
                      >
                        <SelectTrigger className={!editingEntry.type ? 'border-red-300' : ''}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {TYPE_OPTIONS.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Puzzle type</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-accent" />
                        Featured Puzzle
                      </Label>
                      <Switch
                        checked={editingEntry.featured || false}
                        onCheckedChange={(checked) => setEditingEntry({ ...editingEntry, featured: checked })}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Mark as featured to highlight this puzzle</p>
                  </div>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Full Content <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      rows={18}
                      value={editingEntry.content || ''}
                      onChange={(e) => setEditingEntry({ ...editingEntry, content: e.target.value })}
                      placeholder="This is a clever math-based mind-reading trick...

Use double line breaks to separate paragraphs.

You can write detailed explanations here with multiple paragraphs."
                      required
                      className={!editingEntry.content ? 'border-red-300' : ''}
                    />
                    <p className="text-xs text-muted-foreground">
                      Full puzzle content and explanation • {editingEntry.content?.length || 0} characters
                    </p>
                  </div>
                </TabsContent>

                {/* Videos Tab */}
                <TabsContent value="videos" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Video Solutions ({editingEntry.videos?.length || 0})</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddVideo}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Video
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Add YouTube video links for step-by-step solutions
                  </p>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {(editingEntry.videos || []).map((video: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <Label className="text-sm flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Video #{index + 1}
                            </Label>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteVideo(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs flex items-center gap-1">
                              Video Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              placeholder="Brainvita Solution Video 1"
                              value={video.title || ''}
                              onChange={(e) => {
                                const newVideos = [...editingEntry.videos];
                                newVideos[index] = { ...video, title: e.target.value };
                                setEditingEntry({ ...editingEntry, videos: newVideos });
                              }}
                              required
                              className={!video.title ? 'border-red-300' : ''}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs flex items-center gap-1">
                              YouTube URL <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              type="url"
                              placeholder="https://youtu.be/ckSKOmpKv0M"
                              value={video.url || ''}
                              onChange={(e) => {
                                const newVideos = [...editingEntry.videos];
                                newVideos[index] = { ...video, url: e.target.value };
                                setEditingEntry({ ...editingEntry, videos: newVideos });
                              }}
                              required
                              className={!video.url || (video.url && !isValidYouTubeUrl(video.url)) ? 'border-red-300' : ''}
                            />
                            {video.url && !isValidYouTubeUrl(video.url) && (
                              <p className="text-xs text-red-500">Please enter a valid YouTube URL (youtube.com or youtu.be)</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {(!editingEntry.videos || editingEntry.videos.length === 0) && (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No video solutions yet. Click "Add Video" to include tutorial videos.</p>
                    </div>
                  )}
                </TabsContent>

                <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEntry}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Puzzle
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

export default TimePassEditor;
