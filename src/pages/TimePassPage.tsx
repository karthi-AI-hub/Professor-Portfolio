import { SEO } from '@/components/SEO';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Sparkles, Play, ExternalLink, Brain, Puzzle, Calculator, 
  Video, Zap, Star, ChevronDown,
  X, Youtube
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const categoryIcons = {
  'Fun with numbers': Calculator,
  'Puzzle Games': Puzzle,
};

const typeColors = {
  'Math Trick': 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  'Puzzle Game': 'bg-blue-500/20 text-blue-600 border-blue-500/30',
};

const TimePassPage = () => {
  const { timepassData, loading } = useData();
  const [selectedEntry, setSelectedEntry] = useState<typeof timepassData.entries[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const timepass = timepassData;
  const categories = [...new Set(timepass.entries.map(entry => entry.category))];
  
  const filteredEntries = selectedCategory 
    ? timepass.entries.filter(entry => entry.category === selectedCategory)
    : timepass.entries;

  const featuredEntries = timepass.entries.filter(entry => entry.featured);
  const videoEntries = timepass.entries.filter(entry => entry.videos && entry.videos.length > 0);
  
  if (loading) {
    return (
      <>
        <SEO 
          title="TimePass - Fun with Math & Puzzles | Dr. Kiruthika Kuppusaamy"
          description="Explore mathematical tricks, brain teasers, and puzzle-solving techniques. Learn the magic behind numbers with engaging video tutorials."
          keywords="Math Tricks, Brain Teasers, Number Puzzles, Brainvita Solutions, Mathematical Magic, Puzzle Games"
        />
        <div className="min-h-screen bg-background">
          <Header />
          <main className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" message="Loading puzzles..." />
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const openEntryModal = (entry: typeof timepassData.entries[0]) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  const closeEntryModal = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedEntry(null), 300);
  };

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, idx) => (
      <p key={idx} className="mb-4 last:mb-0 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  return (
    <>
      <SEO 
        title="TimePass - Fun with Math & Puzzles | Dr. Kiruthika Kuppusaamy"
        description="Explore mathematical tricks, brain teasers, and puzzle-solving techniques. Learn the magic behind numbers with engaging video tutorials."
        keywords="Math Tricks, Brain Teasers, Number Puzzles, Brainvita Solutions, Mathematical Magic, Puzzle Games"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <section className="pt-28 pb-0 relative overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src="/background.png" 
                alt="Background" 
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
            </div>
            
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-glow/20 rounded-full blur-3xl" />
            </div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />

            <div className="container-custom relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
              >
                {/* Featured Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-8"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Brain Teasers & Math Magic</span>
                </motion.div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
                  Time
                  <span className="block bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
                    Pass
                  </span>
                </h1>
                
                <div className="w-48 h-1.5 bg-gradient-to-r from-primary via-accent to-primary-glow rounded-full mx-auto mb-8" />
                
                <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed mb-10 max-w-3xl mx-auto">
                  {timepass.description}
                </p>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3">
                      <Puzzle className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{timepass.entries.length}</div>
                    <div className="text-sm text-foreground/60">Puzzles</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl mx-auto mb-3">
                      <Calculator className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{categories.length}</div>
                    <div className="text-sm text-foreground/60">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{videoEntries.length}</div>
                    <div className="text-sm text-foreground/60">With Videos</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl mx-auto mb-3">
                      <Zap className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{featuredEntries.length}</div>
                    <div className="text-sm text-foreground/60">Featured</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Enhanced Content Section */}
          <section className="section-padding bg-gradient-to-b from-background to-background/95">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Explore <span className="text-primary">Brain Games</span>
                </h2>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                  Challenge your mind with mathematical tricks, puzzles, and brain teasers
                </p>
              </motion.div>

              {/* Category Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap gap-3 justify-center mb-12"
              >
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  All Puzzles
                </Button>
                {categories.map((category) => {
                  const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Puzzle;
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="rounded-full"
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {category}
                    </Button>
                  );
                })}
              </motion.div>

              {/* Puzzles Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {filteredEntries.map((entry, index) => {
                  const CategoryIcon = categoryIcons[entry.category as keyof typeof categoryIcons] || Puzzle;
                  
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group"
                    >
                      <Card className="h-full border-2 border-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-2xl transition-all duration-500 card-hover overflow-hidden">
                        <CardContent className="p-0">
                          {/* Entry Header */}
                          <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/2 border-b border-primary/10">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <Badge className={`${typeColors[entry.type as keyof typeof typeColors] || 'bg-gray-500/20 text-gray-600'} text-xs font-medium`}>
                                {entry.type}
                              </Badge>
                              {entry.featured && (
                                <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              <div className="flex items-center gap-1 text-xs text-foreground/60">
                                <CategoryIcon className="h-3 w-3" />
                                {entry.category}
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                              {entry.title}
                            </h3>
                          </div>

                          {/* Entry Body */}
                          <div className="p-6">
                            <div className="mb-4">
                              <p className="text-foreground/70 leading-relaxed line-clamp-3">
                                {entry.content.split('\n')[0]}
                              </p>
                            </div>

                            {/* Videos Preview */}
                            {entry.videos && entry.videos.length > 0 && (
                              <div className="mb-4 flex items-center gap-2 text-sm text-foreground/60">
                                <Youtube className="h-4 w-4 text-primary" />
                                <span>{entry.videos.length} video solution{entry.videos.length > 1 ? 's' : ''} available</span>
                              </div>
                            )}

                            {/* Action Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEntryModal(entry)}
                              className="rounded-full group/btn"
                            >
                              <Brain className="mr-2 h-3 w-3 group-hover/btn:scale-110 transition-transform" />
                              Explore Solution
                              <ChevronDown className="ml-2 h-3 w-3 group-hover/btn:translate-y-0.5 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Empty State */}
              {filteredEntries.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Puzzle className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">No puzzles found</h3>
                  <p className="text-foreground/70 mb-6">Try selecting a different category</p>
                  <Button onClick={() => setSelectedCategory(null)}>
                    View All Puzzles
                  </Button>
                </motion.div>
              )}
            </div>
          </section>

          {/* Puzzle Detail Modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              {selectedEntry && (
                <>
                  <DialogHeader>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge className={`${typeColors[selectedEntry.type as keyof typeof typeColors] || 'bg-gray-500/20 text-gray-600'} text-xs font-medium`}>
                        {selectedEntry.type}
                      </Badge>
                      {selectedEntry.featured && (
                        <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs font-medium">
                        {selectedEntry.category === 'Fun with numbers' ? (
                          <Calculator className="h-3 w-3 mr-1" />
                        ) : (
                          <Puzzle className="h-3 w-3 mr-1" />
                        )}
                        {selectedEntry.category}
                      </Badge>
                    </div>
                    <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground leading-tight pr-8">
                      {selectedEntry.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-foreground/60 pt-2">
                      Explore the solution and learn the technique behind this puzzle
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-6">
                    {/* Full Content */}
                    <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6 mb-6">
                      <div className="prose prose-sm md:prose-base max-w-none">
                        <div className="text-foreground/80 leading-relaxed space-y-4">
                          {formatContent(selectedEntry.content)}
                        </div>
                      </div>
                    </div>

                    {/* Video Solutions */}
                    {selectedEntry.videos && selectedEntry.videos.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                          <Youtube className="h-5 w-5 text-primary" />
                          Video Solutions
                        </h3>
                        <div className="space-y-3">
                          {selectedEntry.videos.map((video, idx) => (
                            <Button
                              key={idx}
                              asChild
                              variant="outline"
                              size="lg"
                              className="w-full justify-start border-primary/30 hover:border-primary hover:bg-primary/5 group/video h-auto py-4"
                            >
                              <a 
                                href={video.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-4"
                              >
                                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg group-hover/video:bg-primary/20 transition-colors flex-shrink-0">
                                  <Play className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="font-medium text-foreground group-hover/video:text-primary transition-colors">
                                    {video.title}
                                  </div>
                                  <div className="text-xs text-foreground/60 mt-1">
                                    Watch on YouTube
                                  </div>
                                </div>
                                <ExternalLink className="h-4 w-4 text-foreground/50 group-hover/video:text-primary transition-colors flex-shrink-0" />
                              </a>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Close Button */}
                    <div className="mt-8 pt-6 border-t border-primary/10 flex justify-end">
                      <Button
                        variant="outline"
                        onClick={closeEntryModal}
                        className="rounded-full"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Close
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TimePassPage;