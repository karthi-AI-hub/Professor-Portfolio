import { SEO } from '@/components/SEO';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Research } from '@/components/Research';
import { Teaching } from '@/components/Teaching';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <>
      <SEO />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <About />
          <Research />
          <Teaching />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;