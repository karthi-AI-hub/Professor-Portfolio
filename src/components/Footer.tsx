import { Heart, Mail, MapPin, Phone, ExternalLink, Github, Youtube, Globe, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';

export const Footer = () => {
  const { profileData, contentData } = useData();
  const { personalInfo, socialLinks } = profileData;
  const { footer } = contentData;
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Classroom', href: '/classroom' },
    { name: 'BrainPops', href: '/brainpops' },
    { name: 'TechieBites', href: '/techiebites' },
    { name: 'TimePass', href: '/timepass' },
  ];

  const socialLinksList = footer.links.filter(link => 
    socialLinks[link.name.toLowerCase() as keyof typeof socialLinks]
  );

  const getSocialIcon = (name: string) => {
    const iconMap: { [key: string]: any } = {
      'github': Github,
      'youtube': Youtube,
      'website': Globe,
      'facebook': Facebook,
      'twitter': Twitter,
      'instagram': Instagram,
      'linkedin': Linkedin,
    };
    return iconMap[name.toLowerCase()] || ExternalLink;
  };

  return (
    <footer className="bg-gradient-to-r from-foreground via-foreground/95 to-foreground text-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent rounded-full blur-3xl" />
      </div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 py-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <img 
                  src="/android-chrome-192x192.png" 
                  alt="Kiruthika Kuppusaamy Logo" 
                  className="w-10 h-10 object-contain rounded-xl shadow-lg transition-all duration-300"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-20 transition-opacity duration-300 -z-10" />
              </div>
              <div>
                <p className="font-bold text-xl">{personalInfo.name}</p>
                <p className="text-sm opacity-90">{personalInfo.designation}</p>
              </div>
            </div>
            <p className="text-background/80 mb-4 max-w-md">
              {personalInfo.tagline}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="opacity-90">{personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="opacity-90">{personalInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/80 hover:text-primary transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinksList.map((link) => {
                const Icon = getSocialIcon(link.name);
                return (
                  <Button
                    key={link.name}
                    asChild
                    variant="outline"
                    size="icon"
                    className="bg-transparent border-background/20 hover:bg-background/10 hover:border-primary text-background"
                  >
                    <a 
                      href={socialLinks[link.name.toLowerCase() as keyof typeof socialLinks]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title={link.name}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 pb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm opacity-90">
                © {currentYear} {personalInfo.name}. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <p className="flex items-center gap-2 opacity-90">
                Made with <Heart className="h-4 w-4 fill-current animate-pulse text-primary" /> for advancing knowledge
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};