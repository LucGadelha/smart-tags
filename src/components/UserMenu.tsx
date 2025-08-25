import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Users, Moon, Sun, Monitor } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { toast } from "sonner";

const UserMenu = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast.error("Erro ao fazer logout");
      } else {
        toast.success("Logout realizado com sucesso");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Erro inesperado ao fazer logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleEditProfile = () => {
    // TODO: Implement profile editing
    toast.info("Funcionalidade de editar perfil em desenvolvimento");
  };

  const handleManageUsers = () => {
    navigate("/usuarios");
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="w-4 h-4" />;
      case "light":
        return <Sun className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const displayName = userProfile?.username || user?.email?.split("@")[0] || "Usuário";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-medium text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="hidden sm:inline text-foreground">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-medium text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{displayName}</span>
            <span className="text-xs text-muted-foreground">
              {userProfile?.role === "admin" ? "Administrador" : "Cozinheiro"}
            </span>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleEditProfile}>
          <User className="w-4 h-4 mr-2" />
          Editar Perfil
        </DropdownMenuItem>
        
        {userProfile?.role === "admin" && (
          <DropdownMenuItem onClick={handleManageUsers}>
            <Users className="w-4 h-4 mr-2" />
            Gerenciar Usuários
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {getThemeIcon()}
            <span className="ml-2">Tema</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="w-4 h-4 mr-2" />
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="w-4 h-4 mr-2" />
              Escuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="w-4 h-4 mr-2" />
              Sistema
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? "Saindo..." : "Sair"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;