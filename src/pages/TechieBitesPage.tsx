import { SEO } from '@/components/SEO';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Cpu, Calendar, User, BookOpen, Clock, Tag, Sparkles, ArrowRight, X
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

const categoryColors = {
  'Artificial Intelligence': 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  'Career Development': 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  'Cybersecurity': 'bg-red-500/20 text-red-600 border-red-500/30',
  'Digital Tools': 'bg-green-500/20 text-green-600 border-green-500/30',
  'Electric Vehicles': 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
  'Fun with Math': 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
  'Hardware': 'bg-orange-500/20 text-orange-600 border-orange-500/30',
  'Language & Communication': 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30',
  'Programming': 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30',
  'Technology Trends': 'bg-pink-500/20 text-pink-600 border-pink-500/30',
};

const TechieBitesPage = () => {
  const { techiebitesData, loading } = useData();
  const [selectedPost, setSelectedPost] = useState<typeof techiebitesData.posts[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const featuredPosts = techiebitesData.posts.filter(post => post.featured);
  const categories = [...new Set(techiebitesData.posts.map(post => post.category))];
  
  const filteredPosts = selectedCategory 
    ? techiebitesData.posts.filter(post => post.category === selectedCategory)
    : techiebitesData.posts;
  
  if (loading) {
    return (
      <>
        <SEO 
          title="TechieBites - Tech Insights & Articles | Dr. Kiruthika Kuppusaamy"
          description="Technology articles, AI insights, and analysis on emerging trends including ChatGPT, Gemini, Copilot, Electric Vehicles, and engineering education."
          keywords="AI Chatbots Comparison, ChatGPT vs Gemini, Technology Trends, Electric Vehicles, Engineering Education, Tech Articles"
        />
        <div className="min-h-screen bg-background">
          <Header />
          <main className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" message="Loading tech articles..." />
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const openPostModal = (post: typeof techiebitesData.posts[0]) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const closePostModal = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedPost(null), 300);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <>
      <SEO 
        title="TechieBites - Tech Insights & Articles | Dr. Kiruthika Kuppusaamy"
        description="Technology articles, AI insights, and analysis on emerging trends including ChatGPT, Gemini, Copilot, Electric Vehicles, and engineering education."
        keywords="AI Chatbots Comparison, ChatGPT vs Gemini, Technology Trends, Electric Vehicles, Engineering Education, Tech Articles"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Enhanced Hero Section */}
          <section className="pt-28 pb-20 relative overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src="/background.png" 
                alt="Background" 
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
            </div>
            
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
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
                  className="inline-flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2 mb-8"
                >
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Tech Insights & Analysis</span>
                </motion.div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
                  Techie
                  <span className="block bg-gradient-to-r from-accent via-primary to-primary-glow bg-clip-text text-transparent">
                    Bites
                  </span>
                </h1>
                
                <div className="w-48 h-1.5 bg-gradient-to-r from-accent via-primary to-primary-glow rounded-full mx-auto mb-8" />
                
                <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed mb-10 max-w-3xl mx-auto">
                  {techiebitesData.description}
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
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{techiebitesData.posts.length}</div>
                    <div className="text-sm text-foreground/60">Articles</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl mx-auto mb-3">
                      <Tag className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{categories.length}</div>
                    <div className="text-sm text-foreground/60">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{featuredPosts.length}</div>
                    <div className="text-sm text-foreground/60">Featured</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl mx-auto mb-3">
                      <Cpu className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">2023+</div>
                    <div className="text-sm text-foreground/60">Latest Tech</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Category Filter */}
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
                  Explore <span className="text-primary">Tech Categories</span>
                </h2>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                  Browse through curated technology insights across different domains
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
                  All Articles
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </motion.div>

              {/* Articles Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <Card className="h-full border-2 border-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-2xl transition-all duration-500 card-hover overflow-hidden">
                      <CardContent className="p-0">
                        {/* Article Header */}
                        <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/2 border-b border-primary/10">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Badge className={`${categoryColors[post.category as keyof typeof categoryColors] || 'bg-gray-500/20 text-gray-600'} text-xs font-medium`}>
                              {post.category}
                            </Badge>
                            {post.featured && (
                              <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(post.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getReadingTime(post.content)} min read
                            </div>
                            {post.author && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {post.author}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Article Body */}
                        <div className="p-6">
                          <p className="text-foreground/70 leading-relaxed mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPostModal(post)}
                            className="rounded-full group/btn"
                          >
                            <BookOpen className="mr-2 h-3 w-3 group-hover/btn:scale-110 transition-transform" />
                            Read More
                            <ArrowRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {filteredPosts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Cpu className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">No articles found</h3>
                  <p className="text-foreground/70 mb-6">Try selecting a different category</p>
                  <Button onClick={() => setSelectedCategory(null)}>
                    View All Articles
                  </Button>
                </motion.div>
              )}
            </div>
          </section>
          {/* Article Detail Modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              {selectedPost && (
                <>
                  <DialogHeader>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge className={`${categoryColors[selectedPost.category as keyof typeof categoryColors] || 'bg-gray-500/20 text-gray-600'} text-xs font-medium`}>
                        {selectedPost.category}
                      </Badge>
                      {selectedPost.featured && (
                        <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground leading-tight pr-8">
                      {selectedPost.title}
                    </DialogTitle>
                    <DialogDescription className="flex flex-wrap items-center gap-4 text-sm text-foreground/60 pt-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {formatDate(selectedPost.date)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {getReadingTime(selectedPost.content)} min read
                      </div>
                      {selectedPost.author && (
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          {selectedPost.author}
                        </div>
                      )}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-6">
                    {/* Excerpt Section */}
                    <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4 mb-6">
                      <p className="text-foreground/80 font-medium italic leading-relaxed">
                        {selectedPost.excerpt}
                      </p>
                    </div>

                    {/* Full Content */}
                    <div className="prose prose-sm md:prose-base max-w-none">
                      <div className="text-foreground/80 leading-relaxed space-y-4">
                        {selectedPost.content.split('\n').map((paragraph, idx) => (
                          paragraph.trim() && (
                            <p key={idx} className="text-base leading-relaxed">
                              {paragraph}
                            </p>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Close Button */}
                    <div className="mt-8 pt-6 border-t border-primary/10 flex justify-end">
                      <Button
                        variant="outline"
                        onClick={closePostModal}
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

export default TechieBitesPage;