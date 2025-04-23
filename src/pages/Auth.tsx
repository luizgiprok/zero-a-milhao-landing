
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session status:", session ? "Active" : "None");
      if (session) {
        console.log("User is logged in, navigating to admin...");
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
        console.log("Attempting login with:", email);
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        console.log("Attempting signup with:", email);
        authResponse = await supabase.auth.signUp({
          email,
          password,
        });
      }

      if (authResponse.error) throw authResponse.error;
      
      console.log("Auth response:", authResponse);

      if (!isLogin) {
        const { error: adminError } = await supabase.rpc('create_new_admin', {
          admin_email: email,
        });
        
        if (adminError) throw adminError;
        
        toast.success("Conta criada com sucesso! Faça login para continuar.");
        setIsLogin(true);
        setLoading(false);
        return;
      }

      // Verificação adicional se o usuário é admin antes de redirecionar
      try {
        const { data: adminCheck, error: adminCheckError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .single();
        
        if (adminCheckError || !adminCheck) {
          console.log("User is not an admin:", email);
          toast.error("Este usuário não tem permissões de administrador");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
      } catch (checkError) {
        console.error("Error checking admin status:", checkError);
      }

      console.log("Login successful, navigating to admin...");
      navigate("/admin");
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            {isLogin ? "Bem-vindo de volta!" : "Criar nova conta"}
          </h2>
          <p className="text-gray-600">
            {isLogin ? "Entre na sua conta de administrador" : "Registre-se como administrador"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Processando..." : isLogin ? "Entrar" : "Criar Conta"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou continue com</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 hover:bg-gray-50"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="h-5 w-5" />
            Google
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline font-medium"
            >
              {isLogin ? "Não tem uma conta? Crie agora" : "Já tem uma conta? Entre aqui"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
