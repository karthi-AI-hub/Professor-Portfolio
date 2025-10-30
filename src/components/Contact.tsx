import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Linkedin, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import profileData from '@/data/profile.json';

export const Contact = () => {
  const { personalInfo } = profileData;

  const contactItems = [
    { icon: Mail, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
    { icon: Phone, label: 'Phone', value: personalInfo.phone, href: `tel:${personalInfo.phone}` },
    { icon: MapPin, label: 'Office', value: personalInfo.office, href: null },
    { icon: Clock, label: 'Office Hours', value: personalInfo.officeHours, href: null },
  ];

  return (
    <section id="contact" className="section-padding bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
      }} />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">Contact</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full mb-12" />

          <p className="text-lg text-foreground/80 mb-12 max-w-2xl">
            I'm always interested in connecting with fellow researchers, potential collaborators, and prospective students. Feel free to reach out!
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Get in Touch</h3>
              <div className="space-y-4">
                {contactItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <item.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
                            {item.href ? (
                              <a
                                href={item.href}
                                className="text-foreground hover:text-primary transition-colors font-medium"
                              >
                                {item.value}
                              </a>
                            ) : (
                              <div className="text-foreground font-medium">{item.value}</div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-foreground">Location</h3>
              <Card className="border-primary/20 overflow-hidden h-[450px]">
                <CardContent className="p-0 h-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3911.615745056355!2d77.82548869573561!3d11.362751990044083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba964016c607823%3A0x580736a65c2b0005!2sK.S.RANGASAMY%20COLLEGE%20OF%20TECHNOLOGY!5e0!3m2!1sen!2sin!4v1761834421812!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="K.S. Rangasamy College of Technology Location"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
