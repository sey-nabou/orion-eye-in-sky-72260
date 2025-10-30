import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import orionLogo from "@/assets/orion-logo.png";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {onMenuClick && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <Link to="/" className="flex items-center gap-3 transition-orion hover:opacity-80">
            <img src={orionLogo} alt="ORION" className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-xl font-heading font-bold text-primary">ORION</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Coordination Intelligente</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <Link to="/">
            <Button 
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
            >
              Tableau de bord
            </Button>
          </Link>
          <Link to="/signalement">
            <Button 
              variant={isActive("/signalement") ? "default" : "ghost"}
              size="sm"
            >
              Signaler
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="warning" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
            >
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
