import Hero from "./Hero";
import ConceptSection from "./ConceptSection";
import FeaturesSection from "./FeaturesSection";
import ImpactSection from "./ImpactSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

import { Page } from "../types/navigation";

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void; 
  onNavigate: (page: Page) => void;
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