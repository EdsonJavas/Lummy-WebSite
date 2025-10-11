import { useState } from 'react';
import { ThemeProvider } from '@/react-app/hooks/useTheme';
import Layout from '@/react-app/components/Layout';
import Hero from '@/react-app/components/Hero';
import About from '@/react-app/components/About';
import Features from '@/react-app/components/Features';
import Testimonials from '@/react-app/components/Testimonials';
import FAQ from '@/react-app/components/FAQ';
import Download from '@/react-app/components/Download';
import SplashScreen from '@/react-app/components/SplashScreen';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <ThemeProvider>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {!showSplash && (
        <Layout>
          <Hero />
          <About />
          <Features />
          <Testimonials />
          <FAQ />
          <Download />
        </Layout>
      )}
    </ThemeProvider>
  );
}

