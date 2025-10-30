import { motion } from 'framer-motion';
import { CheckCircle2, GraduationCap, Briefcase, Award, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import profileData from '@/data/profile.json';

export const About = () => {
  const { about, positions } = profileData;

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
    <section id="about" className="section-padding bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
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
              Professional Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              About <span className="text-primary">Me</span>
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-8" />
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              {about.experience} of dedication to education and technology
            </p>
          </motion.div>

          {/* Biography */}
          <motion.div variants={itemVariants} className="mb-16">
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold text-foreground">My Story</h3>
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                  {about.biography}
                </p>
                <div className="border-l-4 border-primary/30 pl-4 py-2 bg-primary/5 rounded-r">
                  <p className="text-foreground/70 italic">
                    "{about.mission}"
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Education & Experience Grid */}
          <div className="grid lg:grid-cols-1 gap-12">
            {/* Academic Positions */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <Briefcase className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Academic Journey</h3>
              </div>
              <div className="space-y-6">
                {positions.map((position, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="relative pl-8 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-primary before:to-accent"
                  >
                    <div className="absolute left-0 top-2 w-6 h-6 bg-primary rounded-full border-4 border-background" />
                    <Card className="border-primary/20 hover:border-primary/40 card-hover bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <h4 className="font-bold text-xl text-foreground">{position.title}</h4>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            {position.duration && (
                              <Badge variant="outline" className="bg-primary/5 text-primary">
                                <Calendar className="h-3 w-3 mr-1" />
                                {position.duration}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="h-4 w-4 text-primary" />
                          <p className="text-primary font-semibold">{position.institution}</p>
                        </div>
                        <p className="text-foreground/70 leading-relaxed">{position.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};