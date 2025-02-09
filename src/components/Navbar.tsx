
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, Home, FileText, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { data: applicationCount = 0 } = useQuery({
    queryKey: ['applicationCount'],
    queryFn: () => {
      const applications = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      return applications.length;
    },
    refetchInterval: 1000
  });

  useEffect(() => {
    // Listen for authentication changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    window.addEventListener('auth-change', handleAuthChange);
    
    // Initial auth check
    checkAuthStatus();
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/me', {
        credentials: 'include'
      });
      setIsAuthenticated(response.ok);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setIsAuthenticated(false);
        toast({
          title: "Success",
          description: "Logged out successfully",
        });
        navigate('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-card shadow-md backdrop-blur-sm sticky top-0 z-10">
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="text-2xl font-bold hover:text-primary transition-colors cursor-pointer"
            aria-label="Go to home page"
          >
            AI-Powered Job Portal
          </Link>
          <Button 
            variant="ghost" 
            onClick={handleHomeClick}
            className="flex items-center gap-2"
            aria-label="Go to home page"
          >
            <Home className="w-5 h-5" />
            Home
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <Badge variant="secondary" className="text-sm">
              Applications: {applicationCount}
            </Badge>
          </div>
          <ThemeToggle />
          {!isAuthenticated ? (
            <Button 
              variant="outline" 
              onClick={handleLoginClick}
              className="flex items-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Button>
          ) : (
            <>
              <Link to="/profile">
                <Button variant="outline" className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  Profile
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
