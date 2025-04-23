
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

interface Section {
  id: string;
  section_name: string;
  content: any;
}

interface SectionContent {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  [key: string]: any;
}

const ContentEditor = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from("landing_page_content")
        .select("*")
        .order("section_name");
      
      if (error) throw error;
      setSections(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (section: Section) => {
    try {
      const { error } = await supabase
        .from("landing_page_content")
        .update({ content: section.content as unknown as Json })
        .eq("id", section.id);
      
      if (error) throw error;
      toast.success("Content updated successfully");
      fetchSections();
    } catch (error: any) {
      toast.error(error.message);
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

      const videoSection = sections.find(s => s.section_name === "hero");
      if (videoSection) {
        const sectionContent = videoSection.content as SectionContent;
        const updatedContent = {
          ...sectionContent,
          videoUrl: `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/landing-media/${data.path}`
        };
        await updateSection({ ...videoSection, content: updatedContent });
      }
      
      toast.success("Video uploaded successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Loading content...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={(sections.find(s => s.section_name === "hero")?.content as SectionContent)?.title || ""}
              onChange={(e) => {
                const section = sections.find(s => s.section_name === "hero");
                if (section) {
                  const sectionContent = section.content as SectionContent;
                  updateSection({
                    ...section,
                    content: { ...sectionContent, title: e.target.value }
                  });
                }
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <Input
              value={(sections.find(s => s.section_name === "hero")?.content as SectionContent)?.subtitle || ""}
              onChange={(e) => {
                const section = sections.find(s => s.section_name === "hero");
                if (section) {
                  const sectionContent = section.content as SectionContent;
                  updateSection({
                    ...section,
                    content: { ...sectionContent, subtitle: e.target.value }
                  });
                }
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Video</label>
            <Input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
