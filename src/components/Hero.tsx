
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HeroContent {
  title: string;
  subtitle: string;
  videoUrl: string;
}

const Hero = () => {
  const [showButton, setShowButton] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const [content, setContent] = useState<HeroContent>({
    title: "De 0 a 1 Milhão com um Método Direto e Sem Enrolação",
    subtitle: "Aprenda a investir do zero e construir seu patrimônio com renda passiva, usando um método prático e linguagem simples",
    videoUrl: "https://www.youtube.com/embed/4ZRS2CYr_Us"
  });

  // Fetch hero content from Supabase
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const { data, error } = await supabase
          .from("landing_page_content")
          .select("*")
          .eq("section_name", "hero")
          .single();
        
        if (error) {
          console.error("Error fetching hero content:", error);
          return;
        }
        
        if (data && data.content) {
          const heroContent = data.content as any;
          if (typeof heroContent === 'object' && heroContent !== null) {
            setContent({
              title: heroContent.title || content.title,
              subtitle: heroContent.subtitle || content.subtitle,
              videoUrl: heroContent.videoUrl || content.videoUrl
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch hero content:", error);
      }
    };
    
    fetchHeroContent();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      setShowButton(true);
    }
  }, [timeLeft]);

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          <span dangerouslySetInnerHTML={{ __html: content.title.replace('0 a 1 Milhão', '<span class="text-blue-600">0 a 1 Milhão</span>') }} />
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {content.subtitle}
        </p>
        
        {/* YouTube Video or Custom Video */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative pt-[56.25%]">
            {content.videoUrl && content.videoUrl.includes('youtube.com') ? (
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src={content.videoUrl}
                title="Apresentação do Curso"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video 
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg object-cover"
                src={content.videoUrl}
                controls
                poster="/placeholder.svg"
              />
            )}
          </div>
        </div>
     
        {/* Timer message */}  
        {!showButton && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg shadow">
            <p className="text-gray-700">
              O botão estará disponível em <span className="font-bold text-red-500">{timeLeft}</span> segundos. 
              Por favor, assista o vídeo completo.
            </p>
          </div>
        )}
        
        {/* CTA Button - Only shows after the timer */}
        <div className="flex justify-center gap-4 mb-12">
          {showButton && (
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Rocket className="mr-2 h-5 w-5" />
              Quero Começar Agora
            </Button>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg mx-auto">
          <p className="text-red-600 font-semibold">🔥 Últimas vagas disponíveis!</p>
          <p className="text-gray-600">Preço promocional por tempo limitado</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
