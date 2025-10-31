import { motion } from 'framer-motion';
import { Lightbulb, Rocket, DollarSign, Target, Globe, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';

export const Research = () => {
  const { profileData } = useData();
  const { research } = profileData;

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

  return (
    <section id="research" className="section-padding bg-gradient-to-br from-background to-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
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
              Innovation & Discovery
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Research & <span className="text-primary">Innovation</span>
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary-glow to-accent rounded-full mx-auto mb-8" />
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Exploring the frontiers of technology education and its practical applications
            </p>
          </motion.div>

          {/* Research Overview */}
          <motion.div variants={itemVariants} className="mb-16">
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold text-foreground">Research Focus</h3>
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  {research.overview}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Research Interests */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Research Interests</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {research.interests.map((interest, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="border-primary/20 hover:border-primary/40 card-hover bg-card/50 backdrop-blur-sm h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-foreground leading-relaxed">{interest}</h4>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Research Areas */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-accent/10 rounded-xl">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Research Areas</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {research.areas.map((area, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all"
                >
                  <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2" />
                  <p className="text-foreground/80 text-lg leading-relaxed">{area}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Research Projects */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Current Projects</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {research.projects.map((project, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <Card className="h-full border-primary/20 hover:border-primary/40 card-hover bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      {/* Project Header */}
                      <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/2 border-b border-primary/10">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-xl text-foreground leading-tight">
                            {project.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`${
                              project.status === 'Ongoing' 
                                ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                                : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                            }`}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Project Content */}
                      <div className="p-6">
                        <p className="text-foreground/70 mb-4 leading-relaxed">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                          <DollarSign className="h-4 w-4" />
                          {project.funding}
                        </div>
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