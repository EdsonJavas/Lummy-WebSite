import PublicSiteHeader from "@/react-app/components/PublicSiteHeader";
import Hero from "@/react-app/components/Hero";
import About from "@/react-app/components/About";
import Features from "@/react-app/components/Features";
import Testimonials from "@/react-app/components/Testimonials";
import FAQ from "@/react-app/components/FAQ";
import Download from "@/react-app/components/Download";

/** Homepage pública: baixar o app e criar conta; login leva ao painel em /app. */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <PublicSiteHeader />
      <div className="pt-16">
        <Hero />
        <About />
        <Features />
        <Testimonials />
        <FAQ />
        <Download />
      </div>
    </div>
  );
}
