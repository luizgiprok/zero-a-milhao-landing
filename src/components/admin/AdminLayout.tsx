
import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Search,
  Settings,
  Code,
  LogOut,
  Link,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: ReactNode;
  currentTab: string;
}

const AdminLayout = ({ children, currentTab }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Admin Dashboard</h2>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentTab === "dashboard"}
                  tooltip="Dashboard"
                  onClick={() => navigate("/admin")}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentTab === "content"}
                  tooltip="Conteúdo"
                  onClick={() => navigate("/admin/content")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Configurações Gerais</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentTab === "seo"}
                  tooltip="SEO"
                  onClick={() => navigate("/admin/seo")}
                >
                  <Search className="h-4 w-4 mr-2" />
                  <span>SEO</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentTab === "integrations"}
                  tooltip="Integrações"
                  onClick={() => navigate("/admin/integrations")}
                >
                  <Code className="h-4 w-4 mr-2" />
                  <span>Integrações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full flex items-center gap-2"
              disabled={loading}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
