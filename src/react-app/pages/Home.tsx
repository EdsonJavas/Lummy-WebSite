import { ThemeProvider } from '@/react-app/hooks/useTheme';
import Layout from '@/react-app/components/Layout';
import Hero from '@/react-app/components/Hero';
import About from '@/react-app/components/About';
import Features from '@/react-app/components/Features';
import Download from '@/react-app/components/Download';

export default function Home() {
  return (
    <ThemeProvider>
      <Layout>
        <Hero />
        <About />
        <Features />
        <Download />
      </Layout>
    </ThemeProvider>
  );
}
