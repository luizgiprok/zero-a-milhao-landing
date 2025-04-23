
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    videoUrl: string;
  };
  sections: {
    benefits: boolean;
    curriculum: boolean;
    testimonials: boolean;
    faq: boolean;
    cta: boolean;
  };
}

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<SiteContent>({
    hero: {
      title: "De 0 a 1 Milhão com um Método Direto e Sem Enrolação",
      subtitle: "Aprenda a investir do zero e construir seu patrimônio com renda passiva, usando um método prático e linguagem simples",
      videoUrl: "https://www.youtube.com/embed/4ZRS2CYr_Us"
    },
    sections: {
      benefits: true,
      curriculum: true,
      testimonials: true,
      faq: true,
      cta: true
    }
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch content from database
      const { data } = await supabase
        .from("landing_page_content")
        .select("*");

      if (data && data.length > 0) {
        // Transform the database data into our content structure
        const heroContent = data.find(item => item.section_name === "hero");
        const sectionsContent = data.find(item => item.section_name === "sections");
        
        if (heroContent || sectionsContent) {
          setContent({
            hero: heroContent ? heroContent.content : content.hero,
            sections: sectionsContent ? sectionsContent.content : content.sections
          });
        }
      }
      
      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update hero content
      const { error: heroError } = await supabase
        .from("landing_page_content")
        .upsert({ 
          section_name: "hero", 
          content: content.hero 
        }, { 
          onConflict: "section_name" 
        });

      if (heroError) throw heroError;

      // Update sections visibility
      const { error: sectionsError } = await supabase
        .from("landing_page_content")
        .upsert({ 
          section_name: "sections", 
          content: content.sections 
        }, { 
          onConflict: "section_name" 
        });

      if (sectionsError) throw sectionsError;

      toast.success("Conteúdo salvo com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar o conteúdo");
    } finally {
      setSaving(false);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    
    try {
      const { data, error } = await supabase.storage
        .from("landing-media")
        .upload(`videos/${Date.now()}-${file.name}`, file);
      
      if (error) throw error;
      
      setContent({
        ...content,
        hero: {
          ...content.hero,
          videoUrl: `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/landing-media/${data.path}`
        }
      });
      
      toast.success("Vídeo enviado com sucesso");
    } catch (error: any) {
      toast.error("Erro ao enviar o vídeo");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AdminLayout currentTab="content">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Configurações de Conteúdo</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Seção Inicial (Hero)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Título Principal</Label>
              <Input
                id="hero-title"
                value={content.hero.title}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, title: e.target.value }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtítulo</Label>
              <Textarea
                id="hero-subtitle"
                value={content.hero.subtitle}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, subtitle: e.target.value }
                })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hero-video">URL do Vídeo</Label>
              <Input
                id="hero-video"
                value={content.hero.videoUrl}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, videoUrl: e.target.value }
                })}
                placeholder="URL do YouTube ou Vimeo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="video-upload">Ou faça upload de um vídeo</Label>
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Visibilidade das Seções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="benefits">Benefícios</Label>
                <p className="text-sm text-muted-foreground">Mostrar seção de benefícios do curso</p>
              </div>
              <Switch
                id="benefits"
                checked={content.sections.benefits}
                onCheckedChange={(checked) => setContent({
                  ...content,
                  sections: { ...content.sections, benefits: checked }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="curriculum">Currículo</Label>
                <p className="text-sm text-muted-foreground">Mostrar seção do conteúdo do curso</p>
              </div>
              <Switch
                id="curriculum"
                checked={content.sections.curriculum}
                onCheckedChange={(checked) => setContent({
                  ...content,
                  sections: { ...content.sections, curriculum: checked }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="testimonials">Depoimentos</Label>
                <p className="text-sm text-muted-foreground">Mostrar seção de depoimentos</p>
              </div>
              <Switch
                id="testimonials"
                checked={content.sections.testimonials}
                onCheckedChange={(checked) => setContent({
                  ...content,
                  sections: { ...content.sections, testimonials: checked }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="faq">FAQ</Label>
                <p className="text-sm text-muted-foreground">Mostrar seção de perguntas frequentes</p>
              </div>
              <Switch
                id="faq"
                checked={content.sections.faq}
                onCheckedChange={(checked) => setContent({
                  ...content,
                  sections: { ...content.sections, faq: checked }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cta">Chamada para ação</Label>
                <p className="text-sm text-muted-foreground">Mostrar seção final de chamada para ação</p>
              </div>
              <Switch
                id="cta"
                checked={content.sections.cta}
                onCheckedChange={(checked) => setContent({
                  ...content,
                  sections: { ...content.sections, cta: checked }
                })}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
