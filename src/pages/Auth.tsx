
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/admin");
      }
    };
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let authResponse;
      
      if (isLogin) {
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        authResponse = await supabase.auth.signUp({
          email,
          password,
        });
      }

      if (authResponse.error) throw authResponse.error;

      if (!isLogin) {
        // Call the create_new_admin function after successful signup
        const { error: adminError } = await supabase.rpc('create_new_admin', {
          admin_email: email,
        });
        
        if (adminError) throw adminError;
        
        toast.success("Conta criada com sucesso! Faça login para continuar.");
        setIsLogin(true);
        return;
      }

      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {isLogin ? "Admin Login" : "Criar Conta Admin"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Processando..." : isLogin ? "Entrar" : "Criar Conta"}
          </Button>
        </form>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin ? "Criar nova conta" : "Já tenho uma conta"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
