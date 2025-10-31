import { SEO } from '@/components/SEO';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Code2, Code, Binary, Calculator, Github, ExternalLink, BookOpen, FileText, ChevronRight, PlayCircle, BarChart3, Users, Clock, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const iconMap = {
  Code2,
  Code,
  Binary,
  Calculator,
};

const ClassroomPage = () => {
  const { classroomData, loading } = useData();
  
  const coursesCount = classroomData.courses?.length || 0;
  const totalVideoLessons = classroomData.courses?.reduce((total, course) => {
    const videoCount = course.materials?.filter(m => m.type === 'Video').length || 0;
    const sectionVideos = (course as any).sections?.reduce((sectionTotal: number, section: any) => {
      return sectionTotal + (section.materials?.filter((m: any) => m.video).length || 0);
    }, 0) || 0;
    return total + videoCount + sectionVideos;
  }, 0) || 0;
  
  const stats = [
    { icon: BookOpen, label: "Courses", value: coursesCount.toString() },
    { icon: Users, label: "Students", value: "500+" },
    { icon: PlayCircle, label: "Video Lessons", value: `${totalVideoLessons}+` },
    { icon: Award, label: "Skill Levels", value: "3" },
  ];
  
  if (loading) {
    return (
      <>
        <SEO 
          title="Classroom - Programming Courses & Tutorials | Dr. Kiruthika Kuppusaamy"
          description="Comprehensive programming courses in C, Python, C#, and Mathematics. Learn with practical examples, code repositories, and video tutorials."
          keywords="C Programming Tutorial, Python Course, C# Programming, Allied Mathematics, Programming for Beginners, Coding Courses"
        />
        <div className="min-h-screen bg-background">
          <Header />
          <main className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" message="Loading courses..." />
          </main>
          <Footer />
        </div>
      </>
    );
  }
  
  return (
    <>
      <SEO 
        title="Classroom - Programming Courses & Tutorials | Dr. Kiruthika Kuppusaamy"
        description="Comprehensive programming courses in C, Python, C#, and Mathematics. Learn with practical examples, code repositories, and video tutorials."
        keywords="C Programming Tutorial, Python Course, C# Programming, Allied Mathematics, Programming for Beginners, Coding Courses"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Enhanced Hero Section */}
          <section className="pt-24 pb-16 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src="/background.png" 
                alt="Background" 
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
            </div>
            
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="container-custom relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-8"
                >
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-primary">Interactive Learning Platform</span>
                </motion.div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
                  Learn & Build with
                  <span className="block bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                    Confidence
                  </span>
                </h1>
                
                <div className="w-48 h-1.5 bg-gradient-to-r from-primary via-primary-glow to-accent rounded-full mx-auto mb-8" />
                
                <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed mb-10 max-w-3xl mx-auto">
                  {classroomData.description}
                </p>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
                >
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-foreground/60">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
                
                {/* GitHub Link */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="inline-flex items-center gap-4 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/40"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                    <Github className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-foreground/60 mb-1">All course materials on GitHub</p>
                    <Button asChild variant="link" size="sm" className="text-primary p-0 h-auto font-semibold">
                      <a href={classroomData.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        {classroomData.githubLink}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Enhanced Courses Grid */}
          <section className="section-padding bg-gradient-to-b from-background to-background/95">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  Comprehensive <span className="text-primary">Course Catalog</span>
                </h2>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                  Structured learning paths with practical examples, video tutorials, and hands-on projects
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-8">
                {classroomData.courses.map((course, index) => {
                  const IconComponent = iconMap[course.icon as keyof typeof iconMap];
                  const materialsCount = course.materials?.length || 0;
                  const quizzesCount = course.quizzes?.length || 0;
                  const sectionsCount = (course as any).sections?.length || 0;
                  const videoCount = course.materials?.filter(m => m.type === 'Video').length || 0;
                  
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group"
                    >
                      <Card className="h-full border-2 border-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-2xl transition-all duration-500 card-hover cursor-pointer overflow-hidden">
                        <CardContent className="p-0">
                          {/* Course Header */}
                          <div className="p-8 pb-6 bg-gradient-to-r from-primary/5 to-primary/2 border-b border-primary/10">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110">
                                  <IconComponent className="h-7 w-7 text-primary" />
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="inline-flex items-center gap-1 bg-background/80 rounded-full px-3 py-1">
                                  <PlayCircle className="h-3 w-3 text-primary" />
                                  <span className="text-xs font-medium text-foreground">{videoCount} videos</span>
                                </div>
                              </div>
                            </div>
                            
                            <h3 className="text-2xl font-semibold text-foreground mb-2 line-clamp-1">
                              {course.title}
                            </h3>
                            <p className="text-foreground/70 leading-relaxed line-clamp-2">
                              {course.summary}
                            </p>
                          </div>

                          <div className="p-8">
                            <div className="grid grid-cols-4 gap-3 mb-6">
                              <div className="text-center p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                                <FileText className="h-4 w-4 text-primary mx-auto mb-2" />
                                <div className="text-lg font-bold text-foreground">{materialsCount}</div>
                                <div className="text-xs text-foreground/60">Materials</div>
                              </div>
                              {quizzesCount > 0 && (
                                <div className="text-center p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                                  <BookOpen className="h-4 w-4 text-primary mx-auto mb-2" />
                                  <div className="text-lg font-bold text-foreground">{quizzesCount}</div>
                                  <div className="text-xs text-foreground/60">Quizzes</div>
                                </div>
                              )}
                              {sectionsCount > 0 && (
                                <div className="text-center p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                                  <BarChart3 className="h-4 w-4 text-primary mx-auto mb-2" />
                                  <div className="text-lg font-bold text-foreground">{sectionsCount}</div>
                                  <div className="text-xs text-foreground/60">Sections</div>
                                </div>
                              )}
                              <div className="text-center p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                                <Code2 className="h-4 w-4 text-primary mx-auto mb-2" />
                                <div className="text-lg font-bold text-foreground">{course.topics.length}</div>
                                <div className="text-xs text-foreground/60">Topics</div>
                              </div>
                            </div>

                            {/* Featured Topics */}
                            <div className="mb-6">
                              <h4 className="text-sm font-semibold text-foreground/80 mb-3">Key Topics Covered:</h4>
                              <div className="flex flex-wrap gap-2">
                                {course.topics.slice(0, 4).map((topic, topicIndex) => (
                                  <span
                                    key={topicIndex}
                                    className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                                  >
                                    {topic}
                                  </span>
                                ))}
                                {course.topics.length > 4 && (
                                  <span className="inline-block px-3 py-1 bg-background text-foreground/60 text-xs font-medium rounded-full border">
                                    +{course.topics.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* CTA Button */}
                            <Button asChild className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group/btn h-12 text-base font-semibold">
                              <Link to={`/classroom/${course.slug}`}>
                                <BookOpen className="mr-3 h-5 w-5" />
                                Explore Course
                                <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ClassroomPage;