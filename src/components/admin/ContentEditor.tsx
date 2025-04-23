
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Section {
  id: string;
  section_name: string;
  content: Json;
}

interface SectionContent {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  [key: string]: any;
}

// Define expected content structure interfaces
interface HeroContent {
  title: string;
  subtitle: string;
  videoUrl: string;
}

interface VisibilitySettings {
  benefits: boolean;
  curriculum: boolean;
  testimonials: boolean;
  faq: boolean;
  cta: boolean;
}

const ContentEditor = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Section-specific states
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "",
    subtitle: "",
    videoUrl: ""
  });
  
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings>({
    benefits: true,
    curriculum: true,
    testimonials: true,
    faq: true,
    cta: true
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("landing_page_content")
        .select("*")
        .order("section_name");
      
      if (error) throw error;
      
      if (data) {
        setSections(data);
        
        // Find and set hero content
        const heroSection = data.find(s => s.section_name === "hero");
        if (heroSection && heroSection.content) {
          const content = heroSection.content as any;
          // Type check to ensure it has the expected structure
          if (typeof content === 'object' && content !== null) {
            setHeroContent({
              title: content.title || "",
              subtitle: content.subtitle || "",
              videoUrl: content.videoUrl || "",
            });
          }
        }
        
        // Find and set visibility settings
        const visibilitySection = data.find(s => s.section_name === "visibility");
        if (visibilitySection && visibilitySection.content) {
          const content = visibilitySection.content as any;
          // Type check to ensure it has the expected structure
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
      }
    } catch (error: any) {
      toast.error(`Error fetching content: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (sectionName: string, content: any) => {
    try {
      setSaving(true);
      
      // Check if section exists
      const existingSection = sections.find(s => s.section_name === sectionName);
      
      if (existingSection) {
        // Update existing section
        const { error } = await supabase
          .from("landing_page_content")
          .update({ content })
          .eq("id", existingSection.id);
        
        if (error) throw error;
      } else {
        // Create new section
        const { error } = await supabase
          .from("landing_page_content")
          .insert({ section_name: sectionName, content });
        
        if (error) throw error;
      }
      
      toast.success(`${sectionName} content updated successfully`);
      fetchSections(); // Refresh data
    } catch (error: any) {
      toast.error(`Error updating content: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const updateHeroContent = async () => {
    await updateSection("hero", heroContent);
  };
  
  const updateVisibilitySettings = async () => {
    await updateSection("visibility", visibilitySettings);
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    
    try {
      setSaving(true);
      toast.info("Uploading video, please wait...");
      
      // Make sure the bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage
        .getBucket("landing-media");
      
      if (bucketError && bucketError.message.includes("not found")) {
        // Create bucket if it doesn't exist
        const { error: createError } = await supabase.storage
          .createBucket("landing-media", {
            public: true,
            fileSizeLimit: 52428800, // 50MB
          });
        
        if (createError) throw createError;
      }
      
      const { data, error } = await supabase.storage
        .from("landing-media")
        .upload(`videos/${Date.now()}-${file.name}`, file, {
          cacheControl: "3600",
          upsert: true
        });
      
      if (error) throw error;

      const videoUrl = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/landing-media/${data.path}`;
      
      setHeroContent({
        ...heroContent,
        videoUrl
      });
      
      // Update in database
      await updateSection("hero", { 
        ...heroContent, 
        videoUrl 
      });
      
      toast.success("Video uploaded successfully");
    } catch (error: any) {
      toast.error(`Error uploading video: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero-title" className="block text-sm font-medium mb-1">Title</Label>
              <Input
                id="hero-title"
                value={heroContent.title}
                onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                placeholder="Enter hero title"
              />
            </div>
            
            <div>
              <Label htmlFor="hero-subtitle" className="block text-sm font-medium mb-1">Subtitle</Label>
              <Textarea
                id="hero-subtitle"
                value={heroContent.subtitle}
                onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                placeholder="Enter hero subtitle"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="hero-video" className="block text-sm font-medium mb-1">Video</Label>
              <div className="space-y-2">
                <Input
                  id="hero-video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                />
                
                {heroContent.videoUrl && (
                  <div className="mt-2">
                    <Label className="block text-sm font-medium mb-1">Current Video</Label>
                    <div className="relative aspect-video max-w-lg mx-auto border rounded-md overflow-hidden">
                      <video 
                        src={heroContent.videoUrl} 
                        controls 
                        className="w-full h-full"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 break-all">{heroContent.videoUrl}</p>
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              onClick={updateHeroContent}
              disabled={saving}
              className="mt-4"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Save Hero Content"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Section Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="benefits-visibility" className="cursor-pointer">Benefits Section</Label>
              <Switch
                id="benefits-visibility"
                checked={visibilitySettings.benefits}
                onCheckedChange={(checked) => 
                  setVisibilitySettings({ ...visibilitySettings, benefits: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="curriculum-visibility" className="cursor-pointer">Curriculum Section</Label>
              <Switch
                id="curriculum-visibility"
                checked={visibilitySettings.curriculum}
                onCheckedChange={(checked) => 
                  setVisibilitySettings({ ...visibilitySettings, curriculum: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="testimonials-visibility" className="cursor-pointer">Testimonials Section</Label>
              <Switch
                id="testimonials-visibility"
                checked={visibilitySettings.testimonials}
                onCheckedChange={(checked) => 
                  setVisibilitySettings({ ...visibilitySettings, testimonials: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="faq-visibility" className="cursor-pointer">FAQ Section</Label>
              <Switch
                id="faq-visibility"
                checked={visibilitySettings.faq}
                onCheckedChange={(checked) => 
                  setVisibilitySettings({ ...visibilitySettings, faq: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="cta-visibility" className="cursor-pointer">CTA Section</Label>
              <Switch
                id="cta-visibility"
                checked={visibilitySettings.cta}
                onCheckedChange={(checked) => 
                  setVisibilitySettings({ ...visibilitySettings, cta: checked })
                }
              />
            </div>
            
            <Button 
              onClick={updateVisibilitySettings}
              disabled={saving}
              className="mt-4"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Save Visibility Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentEditor;
