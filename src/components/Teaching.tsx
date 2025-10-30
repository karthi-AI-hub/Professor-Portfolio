import { motion } from 'framer-motion';
import { BookOpen, Users, GraduationCap, Video, FileText, Github, Award, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import profileData from '@/data/profile.json';
import contentData from '@/data/content.json';

export const Teaching = () => {
  const { teaching } = profileData;
  const { statistics } = contentData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const teachingStats = [
    { icon: Video, value: statistics.videoTutorials, label: "Video Tutorials", color: "from-red-500/10 to-red-500/5" },
    { icon: FileText, value: `${statistics.articles}+`, label: "Articles", color: "from-blue-500/10 to-blue-500/5" },
    { icon: Github, value: statistics.githubRepos, label: "GitHub Repos", color: "from-purple-500/10 to-purple-500/5" },
    { icon: Award, value: statistics.quizzes, label: "Interactive Quizzes", color: "from-green-500/10 to-green-500/5" },
  ];

  const teachingMethods = [
    { icon: Video, title: "Video Tutorials", description: "Comprehensive video lessons on YouTube for widespread access" },
    { icon: FileText, title: "PDF Notes", description: "Detailed notes and presentations for in-depth learning" },
    { icon: Github, title: "Code Repositories", description: "GitHub repositories with practical examples and projects" },
    { icon: Award, title: "Interactive Quizzes", description: "Brain-challenging quizzes to reinforce concepts" },
  ];

  return (
    <section id="teaching" className="section-padding bg-gradient-to-br from-background to-accent/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="container-custom relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
              Educational Excellence
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Teaching <span className="text-primary">Philosophy</span>
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-8" />
          </motion.div>

          {/* Teaching Philosophy */}
          <motion.div variants={itemVariants} className="mb-16">
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold text-foreground">My Approach to Education</h3>
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  {teaching.philosophy}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Teaching Statistics */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-3xl font-bold mb-8 text-foreground text-center">Teaching Impact</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teachingStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="group"
                  >
                    <Card className={`h-full border-primary/20 hover:border-primary/40 card-hover bg-gradient-to-br ${stat.color} backdrop-blur-sm`}>
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                        <div className="text-sm text-foreground/60 font-medium">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Teaching Methods */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-3xl font-bold mb-8 text-foreground text-center">Teaching Methodology</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teachingMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={method.title}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="group"
                  >
                    <Card className="h-full border-primary/20 hover:border-primary/40 card-hover bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-bold text-lg text-foreground mb-2">{method.title}</h4>
                        <p className="text-foreground/70 text-sm leading-relaxed">{method.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Courses */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Courses Taught</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {teaching.courses.map((course, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full border-primary/20 hover:border-primary/40 card-hover bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      {/* Course Header */}
                      <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/2 border-b border-primary/10">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-sm text-primary font-semibold mb-1">{course.code}</div>
                            <h4 className="font-bold text-xl text-foreground">{course.name}</h4>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${
                              course.level === 'Postgraduate' 
                                ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' 
                                : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                            }`}
                          >
                            {course.level}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Course Description */}
                      <div className="p-6">
                        <p className="text-foreground/70 leading-relaxed">{course.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};