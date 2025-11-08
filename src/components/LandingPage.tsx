import Hero from "./Hero";
import ConceptSection from "./ConceptSection";
import FeaturesSection from "./FeaturesSection";
import ImpactSection from "./ImpactSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

export default function LandingPage({ onNavigateToLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ConceptSection />
      <FeaturesSection />
      <ImpactSection />
      <CTASection />
      <Footer /> 
    </div>
  );
}