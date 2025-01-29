import { Link } from "react-router-dom";
import { UserCircle, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    const updateApplicationCount = () => {
      const applications = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      setApplicationCount(applications.length);
    };

    // Initial count
    updateApplicationCount();

    // Listen for storage changes
    window.addEventListener('storage', updateApplicationCount);
    
    // Listen for custom event for real-time updates
    window.addEventListener('applicationCountUpdated', updateApplicationCount);

    return () => {
      window.removeEventListener('storage', updateApplicationCount);
      window.removeEventListener('applicationCountUpdated', updateApplicationCount);
    };
  }, []);

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
          <Link to="/">
            <Button variant="ghost" size="icon">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <Badge variant="secondary" className="text-sm">
              Applications: {applicationCount}
            </Badge>
          </div>
          <ThemeToggle />
          <Link to="/profile">
            <Button variant="outline" className="flex items-center gap-2">
              <UserCircle className="w-5 h-5" />
              Profile
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;