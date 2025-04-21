
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Curriculum from "@/components/Curriculum";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Benefits />
      <Curriculum />
      <Testimonials />
      <FAQ />
      <CTASection />
    </div>
  );
};

export default Index;
