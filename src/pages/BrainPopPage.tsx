import { SEO } from '@/components/SEO';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Brain, ExternalLink, BookOpen, Lightbulb, Target, 
  Trophy, Code, Coffee, Shield, ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import brainpopData from '@/data/brainpop.json';

const quizTypeColors = {
  'Scrambled Words': 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  'Crossword': 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  'Visual Puzzle': 'bg-green-500/20 text-green-600 border-green-500/30',
  'Coding Puzzle': 'bg-orange-500/20 text-orange-600 border-orange-500/30',
  'Mixed Quiz': 'bg-pink-500/20 text-pink-600 border-pink-500/30',
  'Multiple Choice': 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30',
  'Word Search': 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30',
};

const categoryIcons = {
  'C Programming': Code,
  'General': Lightbulb,
  'Python Programming': Coffee,
};

const BrainPopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = brainpopData.categories;
  const allQuizzes = categories.flatMap(cat => 
    cat.quizzes.map(quiz => ({ ...quiz, category: cat.title }))
  );
  
  const filteredQuizzes = selectedCategory 
    ? allQuizzes.filter(quiz => quiz.category === selectedCategory)
    : allQuizzes;

  const totalQuizzes = allQuizzes.length;

  return (
    <>
      <SEO 
        title="Brain Pops - Educational Quizzes & Puzzles | Dr. Kiruthika Kuppusamy"
        description="Brain-challenging quizzes, puzzles, and educational games to reinforce programming and computer science concepts. C Programming, Python, and Cybersecurity quizzes."
        keywords="Programming Quizzes, C Programming Puzzles, Python Quizzes, Cybersecurity Word Search, Coding Challenges, Educational Games, Brain Teasers"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Enhanced Hero Section */}
          <section className="pt-24 pb-12 relative overflow-hidden">
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
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Educational Quizzes & Puzzles</span>
                </motion.div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
                  Brain
                  <span className="block bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
                    Pops
                  </span>
                </h1>
                
                <div className="w-48 h-1.5 bg-gradient-to-r from-primary via-accent to-primary-glow rounded-full mx-auto mb-8" />
                
                <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed mb-4 max-w-3xl mx-auto font-semibold">
                  {brainpopData.tagline}
                </p>
                
                <p className="text-lg text-foreground/70 mb-2 italic">
                  {brainpopData.author}
                </p>

                <p className="text-lg text-foreground/70 mb-10 max-w-3xl mx-auto">
                  {brainpopData.description}
                </p>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{totalQuizzes}</div>
                    <div className="text-sm text-foreground/60">Quizzes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl mx-auto mb-3">
                      <Target className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{categories.length}</div>
                    <div className="text-sm text-foreground/60">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">14</div>
                    <div className="text-sm text-foreground/60">Programming</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl mx-auto mb-3">
                      <Shield className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">4</div>
                    <div className="text-sm text-foreground/60">Security</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Quizzes Section */}
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
                  Challenge Your <span className="text-primary">Brain</span>
                </h2>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                  Test your knowledge with interactive quizzes and puzzles
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
                  All Quizzes ({totalQuizzes})
                </Button>
                {categories.map((category) => {
                  const IconComponent = categoryIcons[category.title as keyof typeof categoryIcons] || BookOpen;
                  const count = category.quizzes.length;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.title ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.title)}
                      className="rounded-full"
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {category.title} ({count})
                    </Button>
                  );
                })}
              </motion.div>

              {/* Quizzes Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz, index) => {
                  const CategoryIcon = categoryIcons[quiz.category as keyof typeof categoryIcons] || BookOpen;
                  
                  return (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group"
                    >
                      <Card className="h-full border-2 border-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-2xl transition-all duration-500 card-hover overflow-hidden">
                        <CardContent className="p-0">
                          {/* Quiz Header */}
                          <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/2 border-b border-primary/10">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <Badge className={`${quizTypeColors[quiz.type as keyof typeof quizTypeColors] || 'bg-gray-500/20 text-gray-600'} text-xs font-medium`}>
                                {quiz.type}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-foreground/60">
                                <CategoryIcon className="h-3 w-3" />
                                {quiz.category}
                              </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                              {quiz.title}
                            </h3>
                          </div>

                          {/* Quiz Body */}
                          <div className="p-6">
                            <p className="text-sm text-foreground/70 leading-relaxed mb-4 line-clamp-3">
                              {quiz.description}
                            </p>

                            {/* Action Button */}
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full rounded-full group/btn border-primary/30 hover:border-primary hover:bg-primary/20 hover:text-primary"
                            >
                              <a 
                                href={quiz.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                              >
                                <ExternalLink className="h-3 w-3 group-hover/btn:scale-110 transition-transform" />
                                Take Quiz
                                <ChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Empty State */}
              {filteredQuizzes.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">No quizzes found</h3>
                  <p className="text-foreground/70 mb-6">Try selecting a different category</p>
                  <Button onClick={() => setSelectedCategory(null)}>
                    View All Quizzes
                  </Button>
                </motion.div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BrainPopPage;