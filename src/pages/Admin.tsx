
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/admin/AdminHeader";
import ContentEditor from "@/components/admin/ContentEditor";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: adminData } = await supabase
        .from("admin_users")
        .select("*")
        .single();

      if (!adminData) {
        await supabase.auth.signOut();
        navigate("/auth");
      }
      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <ContentEditor />
      </main>
    </div>
  );
};

export default Admin;
