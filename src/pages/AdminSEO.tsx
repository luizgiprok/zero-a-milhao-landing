
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
  slug: string;
}

const AdminSEO = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    title: "De 0 a 1 Milhão | Curso de Investimentos",
    description: "Aprenda a investir do zero e construir seu patrimônio com renda passiva, usando um método prático e linguagem simples",
    keywords: "investimentos, renda passiva, finanças pessoais, independência financeira",
    slug: "de-0-a-1-milhao"
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch SEO settings from database
      const { data } = await supabase
        .from("landing_page_content")
        .select("*")
        .eq("section_name", "seo")
        .single();

      if (data) {
        setSeoSettings(data.content);
      }
      
      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("landing_page_content")
        .upsert({ 
          section_name: "seo", 
          content: seoSettings 
        }, { 
          onConflict: "section_name" 
        });

      if (error) throw error;

      toast.success("Configurações de SEO salvas com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar as configurações de SEO");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AdminLayout currentTab="seo">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Configurações de SEO</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Meta Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input
                id="meta-title"
                value={seoSettings.title}
                onChange={(e) => setSeoSettings({
                  ...seoSettings,
                  title: e.target.value
                })}
                placeholder="Título da página (50-60 caracteres)"
              />
              <p className="text-xs text-muted-foreground">
                {seoSettings.title.length}/60 caracteres
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={seoSettings.description}
                onChange={(e) => setSeoSettings({
                  ...seoSettings,
                  description: e.target.value
                })}
                placeholder="Descrição da página para resultados de busca (150-160 caracteres)"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {seoSettings.description.length}/160 caracteres
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meta-keywords">Keywords</Label>
              <Textarea
                id="meta-keywords"
                value={seoSettings.keywords}
                onChange={(e) => setSeoSettings({
                  ...seoSettings,
                  keywords: e.target.value
                })}
                placeholder="Palavras-chave separadas por vírgula"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Exemplo: investimentos, renda passiva, finanças pessoais
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>URL da Página</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="page-slug">Slug da URL</Label>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">https://seudominio.com/</span>
                <Input
                  id="page-slug"
                  value={seoSettings.slug}
                  onChange={(e) => setSeoSettings({
                    ...seoSettings,
                    slug: e.target.value.replace(/\s+/g, '-').toLowerCase()
                  })}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Use hífens para separar palavras. Não use espaços ou caracteres especiais.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Visualização nos resultados de busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border p-4 rounded-md bg-white">
              <div className="text-blue-600 font-medium text-xl truncate">
                {seoSettings.title}
              </div>
              <div className="text-green-700 text-sm">
                https://seudominio.com/{seoSettings.slug}
              </div>
              <div className="text-gray-600 text-sm line-clamp-2">
                {seoSettings.description}
              </div>
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

export default AdminSEO;
