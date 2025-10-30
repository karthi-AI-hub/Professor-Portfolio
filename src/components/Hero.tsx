import { motion } from 'framer-motion';
import { Mail, MapPin, ExternalLink, Download, Award, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import profileData from '@/data/profile.json';
import contentData from '@/data/content.json';

export const Hero = () => {
  const { personalInfo } = profileData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-20 pb-12 relative overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="/background.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary-glow/15 rounded-full blur-3xl"
        />
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="container-custom relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Text Content */}
          <motion.div
            variants={itemVariants}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            {/* Welcome Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">Welcome to My Educational Portfolio</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-foreground leading-tight"
            >
              {personalInfo.name.split(' ')[0]}{' '}
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                {personalInfo.name.split(' ')[1]}
              </span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              {personalInfo.designation}
            </motion.p>
            
            {/* <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground mb-2"
            >
              {personalInfo.department}
            </motion.p> */}
            
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground mb-8"
            >
              {personalInfo.institution}
            </motion.p>
            
            <motion.p
              variants={itemVariants}
              className="text-xl text-foreground/80 mb-8 leading-relaxed max-w-2xl"
            >
              {personalInfo.tagline}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start"
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group">
                <a href="#contact">
                  <Mail className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Get in Touch
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-primary/30 hover:border-primary hover:bg-primary/20 hover:text-primary transition-all group">
                <a href="#research">
                  <ExternalLink className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Explore Research
                </a>
              </Button>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-3 text-sm text-muted-foreground items-center lg:items-start"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{personalInfo.office}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span>{contentData.about.experience} of Excellence</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            variants={itemVariants}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary via-primary-glow to-accent rounded-full blur-3xl opacity-30 group-hover:opacity-40 transition-opacity duration-500" />
              
              {/* Animated Border */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -inset-1 bg-gradient-to-br from-primary via-primary-glow to-accent rounded-full opacity-20"
              />
              
              {/* Main Image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                <img
                  src={personalInfo.photo}
                  alt={personalInfo.name}
                  className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full object-cover ring-4 ring-primary/30 ring-offset-4 ring-offset-background shadow-2xl transition-all duration-500 group-hover:ring-primary/50 group-hover:shadow-[0_20px_60px_hsl(var(--primary)/0.3)]"
                />
                
                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg"
                >
                  <Award className="h-5 w-5" />
                </motion.div>
                
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-2 -left-2 bg-accent text-white p-2 rounded-full shadow-lg"
                >
                  <Users className="h-5 w-5" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1 h-3 bg-primary rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};