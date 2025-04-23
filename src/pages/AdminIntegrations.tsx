
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

interface IntegrationSettings {
  googleAnalytics: string;
  googleAds: string;
  googleSearchConsole: string;
  customHeadCode: string;
  customBodyCode: string;
}

const AdminIntegrations = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>({
    googleAnalytics: "",
    googleAds: "",
    googleSearchConsole: "",
    customHeadCode: "",
    customBodyCode: ""
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch integration settings from database
      const { data } = await supabase
        .from("landing_page_content")
        .select("*")
        .eq("section_name", "integrations")
        .single();

      if (data && typeof data.content === 'object') {
        // Check if the structure matches what we expect
        const integrationData = data.content;
        if (
          integrationData && 
          'googleAnalytics' in integrationData && 
          'googleAds' in integrationData && 
          'googleSearchConsole' in integrationData && 
          'customHeadCode' in integrationData && 
          'customBodyCode' in integrationData
        ) {
          setIntegrationSettings({
            googleAnalytics: String(integrationData.googleAnalytics || ''),
            googleAds: String(integrationData.googleAds || ''),
            googleSearchConsole: String(integrationData.googleSearchConsole || ''),
            customHeadCode: String(integrationData.customHeadCode || ''),
            customBodyCode: String(integrationData.customBodyCode || '')
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
      const { error } = await supabase
        .from("landing_page_content")
        .upsert({ 
          section_name: "integrations", 
          content: integrationSettings as unknown as Json 
        }, { 
          onConflict: "section_name" 
        });

      if (error) throw error;

      toast.success("Configurações de integrações salvas com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar as configurações de integrações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AdminLayout currentTab="integrations">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Google Analytics</CardTitle>
            <CardDescription>
              Configure o Google Analytics para monitorar o tráfego do seu site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ga-id">ID do Google Analytics</Label>
              <Input
                id="ga-id"
                value={integrationSettings.googleAnalytics}
                onChange={(e) => setIntegrationSettings({
                  ...integrationSettings,
                  googleAnalytics: e.target.value
                })}
                placeholder="Ex: G-XXXXXXXXXX ou UA-XXXXXXXX-X"
              />
              <p className="text-xs text-muted-foreground">
                Insira apenas o ID de rastreamento, sem as tags HTML
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Google Ads</CardTitle>
            <CardDescription>
              Configure o Google Ads para rastrear conversões
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gads-id">ID ou Tag do Google Ads</Label>
              <Input
                id="gads-id"
                value={integrationSettings.googleAds}
                onChange={(e) => setIntegrationSettings({
                  ...integrationSettings,
                  googleAds: e.target.value
                })}
                placeholder="Ex: AW-XXXXXXXXXX"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Google Search Console</CardTitle>
            <CardDescription>
              Verificação do Google Search Console para SEO
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gsc-tag">Meta tag de verificação</Label>
              <Input
                id="gsc-tag"
                value={integrationSettings.googleSearchConsole}
                onChange={(e) => setIntegrationSettings({
                  ...integrationSettings,
                  googleSearchConsole: e.target.value
                })}
                placeholder="Ex: <meta name='google-site-verification' content='XXXXXX'>"
              />
              <p className="text-xs text-muted-foreground">
                Cole a tag completa fornecida pelo Google Search Console
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Código personalizado</CardTitle>
            <CardDescription>
              Adicione código HTML/JavaScript personalizado no seu site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="head-code">Código na tag &lt;head&gt;</Label>
              <Textarea
                id="head-code"
                value={integrationSettings.customHeadCode}
                onChange={(e) => setIntegrationSettings({
                  ...integrationSettings,
                  customHeadCode: e.target.value
                })}
                placeholder="Insira scripts, meta tags ou outros códigos para incluir na tag <head>"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body-code">Código antes do fechamento do &lt;body&gt;</Label>
              <Textarea
                id="body-code"
                value={integrationSettings.customBodyCode}
                onChange={(e) => setIntegrationSettings({
                  ...integrationSettings,
                  customBodyCode: e.target.value
                })}
                placeholder="Insira scripts ou outros códigos para incluir antes do fechamento da tag <body>"
                rows={4}
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

export default AdminIntegrations;
