
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">De 0 a 1 Milhão</span>
          </Link>

          {/* Admin button */}
          <Button variant="outline" asChild>
            <Link to="/auth" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Admin
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
