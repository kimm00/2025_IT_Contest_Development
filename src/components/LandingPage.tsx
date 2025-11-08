import Hero from "./Hero";
import ConceptSection from "./ConceptSection";
import FeaturesSection from "./FeaturesSection";
import ImpactSection from "./ImpactSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onNavigate?: (page: 'about' | 'partnership' | 'privacy' | 'terms') => void;
}

export default function LandingPage({ onNavigateToLogin, onNavigateToSignup, onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Hero 
        onGetStarted={onNavigateToSignup} 
        onLearnMore={() => onNavigate?.('about')}
      />
      <ConceptSection />
      <FeaturesSection />
      <ImpactSection />
      <CTASection />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
