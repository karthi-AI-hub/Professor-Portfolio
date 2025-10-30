import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Cpu, Brain, GraduationCap, ChevronDown, Puzzle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import contentData from '@/data/content.json';
import classroomData from '@/data/classroom.json';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [isClassroomOpen, setIsClassroomOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { 
      label: 'Home', 
      href: '/', 
      icon: Home,
      description: 'Welcome Page'
    },
    { 
      label: 'Classroom', 
      href: '/classroom', 
      icon: GraduationCap,
      description: 'Learning Resources',
      hasDropdown: classroomData.courses.length > 0
    },
    { 
      label: 'Brain Pops', 
      href: '/brainpops', 
      icon: Brain,
      description: 'Quizzes & Puzzles'
    },
    { 
      label: 'TechieBites', 
      href: '/techiebites', 
      icon: Cpu,
      description: 'Tech Articles'
    },
    { 
      label: 'TimePass', 
      href: '/timepass', 
      icon: Puzzle,
      description: 'Fun & Puzzles'
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Get first 5 courses for dropdown
  const classroomItems = classroomData.courses.slice(0, 5).map(course => ({
    label: course.title,
    href: `/classroom/${course.slug}`,
  }));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-xl shadow-2xl border-b border-primary/10 py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3"
          >
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <img 
                  src="/android-chrome-192x192.png" 
                  alt="Kiruthika Kuppusaamy Logo" 
                  className="w-10 h-10 object-contain rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                  {contentData.personal.name.split(' ')[0]}
                </span>
                <span className="text-xs text-foreground/60 font-medium leading-tight">
                  {contentData.personal.title}
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const hasDropdown = item.hasDropdown;
              
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative"
                  onHoverStart={() => {
                    setActiveHover(item.label);
                    if (item.label === 'Classroom' && hasDropdown) {
                      setIsClassroomOpen(true);
                    }
                  }}
                  onHoverEnd={() => {
                    setActiveHover(null);
                    if (item.label === 'Classroom') {
                      setIsClassroomOpen(false);
                    }
                  }}
                >
                  <Link
                    to={item.href}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group
                      ${active 
                        ? 'text-primary bg-primary/10 shadow-md' 
                        : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                      }
                      ${hasDropdown ? 'pr-3' : ''}
                    `}
                  >
                    <Icon className={`h-4 w-4 transition-all duration-300 ${
                      active ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span>{item.label}</span>
                    
                    {/* Dropdown chevron */}
                    {hasDropdown && (
                      <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${
                        isClassroomOpen && item.label === 'Classroom' ? 'rotate-180' : ''
                      }`} />
                    )}
                    
                    {/* Active indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 border-2 border-primary/20 rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    {/* Hover effect */}
                    {activeHover === item.label && !active && (
                      <motion.div
                        layoutId="hoverIndicator"
                        className="absolute inset-0 border border-primary/10 rounded-xl bg-gradient-to-r from-primary/5 to-transparent -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                      />
                    )}
                  </Link>

                  {/* Classroom Dropdown */}
                  {item.label === 'Classroom' && hasDropdown && (
                    <AnimatePresence>
                      {isClassroomOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary/20 overflow-hidden z-50"
                          onMouseEnter={() => setIsClassroomOpen(true)}
                          onMouseLeave={() => setIsClassroomOpen(false)}
                        >
                          {/* Dropdown Header */}
                          <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-primary/10">
                            <div className="flex items-center gap-3">
                              <GraduationCap className="h-5 w-5 text-primary" />
                              <h3 className="font-semibold text-foreground">Quick Courses</h3>
                            </div>
                          </div>

                          {/* Course List - Simple Titles Only */}
                          <div className="py-2">
                            {classroomItems.map((course, courseIndex) => (
                              <motion.div
                                key={course.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: courseIndex * 0.05 }}
                              >
                                <Link
                                  to={course.href}
                                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors duration-200 group/course"
                                  onClick={() => setIsClassroomOpen(false)}
                                >
                                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary/60 group-hover/course:bg-primary group-hover/course:scale-150 transition-all duration-200" />
                                  <span className="font-medium text-foreground text-sm group-hover/course:text-primary transition-colors line-clamp-1">
                                    {course.label}
                                  </span>
                                </Link>
                              </motion.div>
                            ))}
                          </div>

                          {/* View All Courses Button */}
                          <div className="p-3 border-t border-primary/10">
                            <Link
                              to="/classroom"
                              className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                              onClick={() => setIsClassroomOpen(false)}
                            >
                              <BookOpen className="h-4 w-4" />
                              View All Courses
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Tooltip for other items */}
                  <AnimatePresence>
                    {activeHover === item.label && item.label !== 'Classroom' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg whitespace-nowrap shadow-lg z-50"
                      >
                        {item.description}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden"
          >
            <Button
              variant={isMobileMenuOpen ? "secondary" : "ghost"}
              size="icon"
              className={`relative transition-all duration-300 ${
                isMobileMenuOpen 
                  ? 'bg-primary/10 text-primary shadow-md' 
                  : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-primary/10">
                <div className="flex flex-col gap-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const hasDropdown = item.hasDropdown;
                    
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex flex-col gap-1">
                          <Link
                            to={item.href}
                            className={`
                              flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 group
                              ${active 
                                ? 'text-primary bg-primary/10 shadow-md border border-primary/20' 
                                : 'text-foreground/80 hover:text-primary hover:bg-primary/5 hover:border hover:border-primary/10'
                              }
                            `}
                            onClick={() => !hasDropdown && setIsMobileMenuOpen(false)}
                          >
                            <Icon className={`h-5 w-5 transition-all duration-300 ${
                              active ? 'scale-110' : 'group-hover:scale-110'
                            }`} />
                            <div className="flex flex-col flex-1">
                              <span className="font-semibold leading-tight">{item.label}</span>
                              <span className="text-xs text-foreground/60 leading-tight">
                                {item.description}
                              </span>
                            </div>
                            {hasDropdown && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setIsClassroomOpen(!isClassroomOpen);
                                }}
                              >
                                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${
                                  isClassroomOpen ? 'rotate-180' : ''
                                }`} />
                              </Button>
                            )}
                            {active && !hasDropdown && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-primary rounded-full"
                              />
                            )}
                          </Link>

                          {/* Mobile Classroom Dropdown */}
                          {item.label === 'Classroom' && hasDropdown && (
                            <AnimatePresence>
                              {isClassroomOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="ml-8 overflow-hidden"
                                >
                                  <div className="flex flex-col gap-1 py-2 border-l-2 border-primary/20 pl-4">
                                    {classroomItems.map((course) => (
                                      <Link
                                        key={course.href}
                                        to={course.href}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-200 group/course"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                      >
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover/course:bg-primary group-hover/course:scale-150 transition-all duration-200" />
                                        <span className="font-medium line-clamp-1">{course.label}</span>
                                      </Link>
                                    ))}
                                    <Link
                                      to="/classroom"
                                      className="flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-all duration-200"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      <BookOpen className="h-4 w-4" />
                                      View All Courses
                                    </Link>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};