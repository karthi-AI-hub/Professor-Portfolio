import { SEO } from '@/components/SEO';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Code2, Code, Binary, Calculator, BookOpen, FileText, Github, 
  ExternalLink, ChevronLeft, PlayCircle, BarChart3, 
  Clock, Award, FolderOpen, CheckCircle, Star, Zap,
  FileCode, Presentation, Youtube, BookMarked
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import classroomData from '@/data/classroom.json';

const iconMap = {
  Code2,
  Code,
  Binary,
  Calculator,
};

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'video':
      return <Youtube className="h-4 w-4" />;
    case 'pdf':
      return <FileText className="h-4 w-4" />;
    case 'ppt':
      return <Presentation className="h-4 w-4" />;
    case 'github':
      return <FileCode className="h-4 w-4" />;
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'video':
      return 'bg-red-500/20 text-red-600 border-red-500/30';
    case 'pdf':
      return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
    case 'ppt':
      return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
    case 'github':
      return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
    default:
      return 'bg-green-500/20 text-green-600 border-green-500/30';
  }
};

const getTypeLabel = (type: string) => {
  switch (type.toLowerCase()) {
    case 'video': return 'Video Tutorial';
    case 'pdf': return 'PDF Notes';
    case 'ppt': return 'Presentation';
    case 'github': return 'Code Repository';
    default: return type;
  }
};

const CourseDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const course = classroomData.courses.find(c => c.slug === slug);

  if (!course) {
    return (
      <>
        <SEO title="Course Not Found" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">Course Not Found</h1>
            <p className="text-foreground/70 mb-6">The course you're looking for doesn't exist or has been moved.</p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/10 text-black">
              <Link to="/classroom">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Classroom
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const IconComponent = iconMap[course.icon as keyof typeof iconMap];
  const hasSections = (course as any).sections && (course as any).sections.length > 0;
  
  // Calculate course statistics
  const materialsCount = course.materials?.length || 0;
  const quizzesCount = course.quizzes?.length || 0;
  const sectionsCount = (course as any).sections?.length || 0;
  const videoCount = course.materials?.filter(m => m.type === 'Video').length || 0;
  const pdfCount = course.materials?.filter(m => m.type === 'PDF').length || 0;
  const githubCount = course.materials?.filter(m => m.type === 'GitHub').length || 0;

  // Get all materials including sections
  const getAllMaterials = () => {
    if (hasSections) {
      return (course as any).sections.flatMap((section: any) => 
        section.materials.map((material: any) => ({
          ...material,
          section: section.title,
          type: material.video ? 'Video' : material.notes ? 'PDF' : 'Link'
        }))
      );
    }
    return course.materials || [];
  };

  const allMaterials = getAllMaterials();

  return (
    <>
      <SEO 
        title={`${course.title} - Classroom | Dr. Kiruthika Kuppusaamy`}
        description={course.description}
        keywords={course.topics.join(', ')}
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
            
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="container-custom relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Back Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Button 
                    variant="ghost" 
                    className="mb-8 -ml-4 hover:bg-primary/20 hover:text-primary group transition-all duration-300 rounded-full px-4"
                    onClick={() => navigate('/classroom')}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Classroom
                  </Button>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Course Icon & Basic Info */}
                  <div className="flex-shrink-0">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="relative"
                    >
                      <div className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl border border-primary/20 shadow-lg">
                        <IconComponent className="h-20 w-20 text-primary" />
                      </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="mt-6 space-y-3"
                    >
                      <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-primary/10">
                        <FolderOpen className="h-4 w-4 text-primary" />
                        <div>
                          <div className="font-semibold text-foreground">{allMaterials.length}</div>
                          <div className="text-xs text-foreground/60">Resources</div>
                        </div>
                      </div>
                      {videoCount > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-primary/10">
                          <Youtube className="h-4 w-4 text-primary" />
                          <div>
                            <div className="font-semibold text-foreground">{videoCount}</div>
                            <div className="text-xs text-foreground/60">Videos</div>
                          </div>
                        </div>
                      )}
                      {quizzesCount > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-primary/10">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <div>
                            <div className="font-semibold text-foreground">{quizzesCount}</div>
                            <div className="text-xs text-foreground/60">Quizzes</div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Course Info */}
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                          <Star className="h-3 w-3 mr-1" />
                          Featured Course
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-foreground/60">
                          <Clock className="h-3 w-3" />
                          Self-paced Learning
                        </div>
                      </div>

                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight">
                        {course.title}
                      </h1>
                      
                      <p className="text-xl text-foreground/80 leading-relaxed mb-8 max-w-3xl">
                        {course.description}
                      </p>

                      {/* Course Highlights */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="text-center p-4 bg-background/50 rounded-xl border border-primary/10">
                          <Code2 className="h-6 w-6 text-primary mx-auto mb-2" />
                          <div className="text-lg font-bold text-foreground">{course.topics.length}</div>
                          <div className="text-xs text-foreground/60">Topics</div>
                        </div>
                        <div className="text-center p-4 bg-background/50 rounded-xl border border-primary/10">
                          <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
                          <div className="text-lg font-bold text-foreground">{pdfCount}</div>
                          <div className="text-xs text-foreground/60">PDFs</div>
                        </div>
                        <div className="text-center p-4 bg-background/50 rounded-xl border border-primary/10">
                          <Github className="h-6 w-6 text-primary mx-auto mb-2" />
                          <div className="text-lg font-bold text-foreground">{githubCount}</div>
                          <div className="text-xs text-foreground/60">Repos</div>
                        </div>
                        <div className="text-center p-4 bg-background/50 rounded-xl border border-primary/10">
                          <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                          <div className="text-lg font-bold text-foreground">{quizzesCount}</div>
                          <div className="text-xs text-foreground/60">Quizzes</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-4">
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                          <a href={classroomData.githubLink} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-5 w-5" />
                            GitHub Repository
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                          <a href="#materials">
                            <BookOpen className="mr-2 h-5 w-5" />
                            Start Learning
                          </a>
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Enhanced Course Content */}
          <section className="section-padding bg-gradient-to-b from-background to-background/95">
            <div className="container-custom">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex mb-12 bg-background/50 backdrop-blur-sm border border-primary/20 p-1 rounded-2xl">
                  <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <BookMarked className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="materials" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" id="materials">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Materials
                  </TabsTrigger>
                  {course.quizzes && course.quizzes.length > 0 && (
                    <TabsTrigger value="quizzes" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Award className="h-4 w-4 mr-2" />
                      Quizzes
                    </TabsTrigger>
                  )}
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-3xl flex items-center gap-3">
                          <Zap className="h-7 w-7 text-primary" />
                          Course Curriculum
                        </CardTitle>
                        <CardDescription className="text-lg">
                          Comprehensive coverage of {course.topics.length} essential topics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {course.topics.map((topic, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                            >
                              <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 hover:bg-background border border-primary/10 hover:border-primary/30 transition-all group">
                                <div className="flex-shrink-0 mt-1">
                                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                                    <CheckCircle className="h-3 w-3 text-primary" />
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground leading-relaxed">
                                    {topic}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs bg-primary/5">
                                      Topic {idx + 1}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Learning Path */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-3">
                          <BarChart3 className="h-6 w-6 text-primary" />
                          Learning Path
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">1</span>
                              </div>
                              <span className="font-semibold">Fundamentals & Basics</span>
                            </div>
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                              First Steps
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">2</span>
                              </div>
                              <span className="font-semibold">Core Concepts</span>
                            </div>
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                              Building Blocks
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">3</span>
                              </div>
                              <span className="font-semibold">Advanced Topics</span>
                            </div>
                            <Badge variant="secondary" className="bg-purple-500/10 text-purple-600">
                              Master Level
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">4</span>
                              </div>
                              <span className="font-semibold">Projects & Practice</span>
                            </div>
                            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">
                              Hands-on
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Materials Tab */}
                <TabsContent value="materials" className="space-y-8">
                  {hasSections ? (
                    // Render sections for Mathematics course
                    <div className="space-y-8">
                      {(course as any).sections.map((section: any, sectionIdx: number) => (
                        <motion.div
                          key={sectionIdx}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: sectionIdx * 0.1 }}
                        >
                          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
                              <CardTitle className="text-2xl flex items-center gap-3">
                                <FolderOpen className="h-6 w-6 text-primary" />
                                {section.title}
                              </CardTitle>
                              <CardDescription>
                                {section.materials.length} resources available
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                              <div className="grid gap-4">
                                {section.materials.map((material: any, matIdx: number) => (
                                  <motion.div
                                    key={matIdx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: matIdx * 0.05 }}
                                  >
                                    <div className="p-5 rounded-xl border border-primary/10 bg-background/50 hover:bg-background hover:border-primary/30 transition-all group">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-3">
                                            <h4 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                                              {material.title}
                                            </h4>
                                            {material.video && (
                                              <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
                                                <Youtube className="h-3 w-3 mr-1" />
                                                Video
                                              </Badge>
                                            )}
                                            {material.notes && (
                                              <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
                                                <FileText className="h-3 w-3 mr-1" />
                                                Notes
                                              </Badge>
                                            )}
                                          </div>
                                          {material.description && (
                                            <p className="text-foreground/70 mb-4 leading-relaxed">
                                              {material.description}
                                            </p>
                                          )}
                                          <div className="flex flex-wrap gap-2">
                                            {material.video && (
                                              <Button asChild variant="outline" size="sm" className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20">
                                                <a href={material.video} target="_blank" rel="noopener noreferrer">
                                                  <PlayCircle className="mr-2 h-3 w-3" />
                                                  Watch Video
                                                </a>
                                              </Button>
                                            )}
                                            {material.notes && (
                                              <Button asChild variant="outline" size="sm" className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20">
                                                <a href={material.notes} target="_blank" rel="noopener noreferrer">
                                                  <FileText className="mr-2 h-3 w-3" />
                                                  View Notes
                                                </a>
                                              </Button>
                                            )}
                                            {material.url && !material.video && !material.notes && (
                                              <Button asChild variant="outline" size="sm">
                                                <a href={material.url} target="_blank" rel="noopener noreferrer">
                                                  <ExternalLink className="mr-2 h-3 w-3" />
                                                  Open Resource
                                                </a>
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    // Render materials for other courses
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-3xl flex items-center gap-3">
                            <FolderOpen className="h-7 w-7 text-primary" />
                            Learning Materials
                          </CardTitle>
                          <CardDescription className="text-lg">
                            {allMaterials.length} carefully curated resources to master {course.title}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {course.materials?.map((material, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                              >
                                <a
                                  href={material.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-5 rounded-xl border border-primary/10 bg-background/50 hover:bg-background hover:border-primary/30 hover:shadow-lg transition-all group"
                                >
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className={`p-3 rounded-lg ${getTypeColor(material.type)} group-hover:scale-110 transition-transform`}>
                                      {getTypeIcon(material.type)}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors mb-2">
                                        {material.title}
                                      </h4>
                                      <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={`${getTypeColor(material.type)} text-xs font-medium`}>
                                          {getTypeLabel(material.type)}
                                        </Badge>
                                        <span className="text-sm text-foreground/60">
                                          Click to access
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <ExternalLink className="h-5 w-5 text-foreground/50 group-hover:text-primary group-hover:scale-110 transition-all" />
                                </a>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </TabsContent>

                {/* Quizzes Tab */}
                {course.quizzes && course.quizzes.length > 0 && (
                  <TabsContent value="quizzes" className="space-y-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-3xl flex items-center gap-3">
                            <Award className="h-7 w-7 text-primary" />
                            Practice & Assessment
                          </CardTitle>
                          <CardDescription className="text-lg">
                            Test your knowledge with {course.quizzes.length} interactive quiz{course.quizzes.length > 1 ? 'zes' : ''}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid lg:grid-cols-2 gap-6">
                            {course.quizzes.map((quiz, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                              >
                                <Card className="border-primary/20 hover:border-primary/40 card-hover group bg-gradient-to-br from-background to-primary/5 h-full">
                                  <CardContent className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                                        <BookOpen className="h-6 w-6 text-primary" />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-foreground text-lg leading-tight mb-2">
                                          {quiz.title}
                                        </h4>
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                                          Self-assessment
                                        </Badge>
                                      </div>
                                    </div>
                                    <Button asChild className="w-full" size="lg" variant="outline">
                                      <a href={quiz.url} target="_blank" rel="noopener noreferrer">
                                        <Award className="mr-2 h-4 w-4" />
                                        Start Quiz
                                        <ExternalLink className="ml-2 h-3 w-3" />
                                      </a>
                                    </Button>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </section>

          {/* Call to Action */}
          <section className="section-padding bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  Ready to Master {course.title}?
                </h2>
                <p className="text-xl text-foreground/70 mb-8">
                  Start your learning journey today with comprehensive materials, practical examples, and hands-on projects.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
                    <a href="#materials">
                      <BookOpen className="mr-3 h-5 w-5" />
                      Start Learning Now
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg">
                    <a href={classroomData.githubLink} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-3 h-5 w-5" />
                      Explore Code
                    </a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CourseDetailPage;