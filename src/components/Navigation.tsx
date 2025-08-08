import { Button } from "@/components/ui/button";
import { Home, Plus, Search, Package, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/nova-etiqueta', icon: Plus, label: 'Nova Etiqueta' },
    { path: '/etiquetas', icon: Search, label: 'Etiquetas' },
    { path: '/produtos', icon: Package, label: 'Produtos' },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">EC</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Etiqueta Certa</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="default"
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 min-w-[44px] sm:min-w-[120px] hover-scale"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;