
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Curriculum from "@/components/Curriculum";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16"> {/* Add padding-top to account for fixed navigation */}
        <Hero />
        <Benefits />
        <Curriculum />
        <Testimonials />
        <FAQ />
        <CTASection />
      </div>
    </div>
  );
};

export default Index;
