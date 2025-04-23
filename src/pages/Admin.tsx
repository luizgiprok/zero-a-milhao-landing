
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Users, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      console.log("Checking admin session...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found, redirecting to auth...");
        navigate("/auth");
        return;
      }

      console.log("Session found, checking admin rights...");
      try {
        // Vamos fazer uma consulta direta pelo email do usuário em vez de pelo ID
        // para evitar possíveis problemas de políticas de segurança
        const { data: adminData, error } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", session.user.email)
          .single();

        if (error) {
          console.error("Error fetching admin data:", error);
          throw error;
        }

        if (!adminData) {
          console.log("User is not an admin, logging out...");
          await supabase.auth.signOut();
          toast.error("Você não tem permissão de administrador");
          navigate("/auth");
          return;
        }
        
        console.log("Admin verification successful");
        setLoading(false);
      } catch (error) {
        console.error("Admin verification failed:", error);
        await supabase.auth.signOut();
        toast.error("Erro ao verificar permissões de administrador");
        navigate("/auth");
      }
    };

    checkAdmin();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        if (event === "SIGNED_OUT") {
          navigate("/auth");
        }
      }
    );

    // Clean up the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AdminLayout currentTab="dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button onClick={() => window.open("/", "_blank")}>
            <ExternalLink className="mr-2 h-4 w-4" /> Ver Site
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +10.1% desde o último mês
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">
                +20.1% desde o último mês
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscritos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">73</div>
              <p className="text-xs text-muted-foreground">
                +12.5% desde o último mês
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.9%</div>
              <p className="text-xs text-muted-foreground">
                +1.1% desde o último mês
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => navigate("/admin/content")}>
                  Configurações de Conteúdo
                </Button>
                <Button variant="outline" onClick={() => navigate("/admin/seo")}>
                  Configurações de SEO
                </Button>
                <Button variant="outline" onClick={() => navigate("/admin/integrations")}>
                  Integrações
                </Button>
                <Button variant="outline" onClick={() => window.open("/", "_blank")}>
                  Ver Site
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Site Ativo</span>
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-600"></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Google Analytics</span>
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-600"></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Google Search Console</span>
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
