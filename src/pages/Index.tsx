
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Curriculum from "@/components/Curriculum";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";

interface SectionVisibility {
  benefits: boolean;
  curriculum: boolean;
  testimonials: boolean;
  faq: boolean;
  cta: boolean;
}

const Index = () => {
  const [visibilitySettings, setVisibilitySettings] = useState<SectionVisibility>({
    benefits: true,
    curriculum: true,
    testimonials: true,
    faq: true,
    cta: true
  });
  
  useEffect(() => {
    const fetchVisibilitySettings = async () => {
      try {
        const { data, error } = await supabase
          .from("landing_page_content")
          .select("*")
          .eq("section_name", "visibility")
          .single();
        
        if (error) {
          console.error("Error fetching visibility settings:", error);
          return;
        }
        
        if (data && data.content) {
          const content = data.content as any;
          if (typeof content === 'object' && content !== null) {
            setVisibilitySettings({
              benefits: content.benefits !== undefined ? Boolean(content.benefits) : true,
              curriculum: content.curriculum !== undefined ? Boolean(content.curriculum) : true,
              testimonials: content.testimonials !== undefined ? Boolean(content.testimonials) : true,
              faq: content.faq !== undefined ? Boolean(content.faq) : true,
              cta: content.cta !== undefined ? Boolean(content.cta) : true
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch visibility settings:", error);
      }
    };
    
    fetchVisibilitySettings();
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16"> {/* Add padding-top to account for fixed navigation */}
        <Hero />
        {visibilitySettings.benefits && <Benefits />}
        {visibilitySettings.curriculum && <Curriculum />}
        {visibilitySettings.testimonials && <Testimonials />}
        {visibilitySettings.faq && <FAQ />}
        {visibilitySettings.cta && <CTASection />}
      </div>
    </div>
  );
};

export default Index;
