import { useEffect } from "react";
import AdminUserManagement from "@/components/AdminUserManagement";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ensureMeta = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const ensureCanonical = (href: string) => {
  let link = document.querySelector("link[rel=canonical]");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const Users = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Usuários | Etiqueta Certa";
    ensureMeta(
      "description",
      "Gerencie os usuários cozinheiros da sua organização."
    );
    ensureCanonical(window.location.href);
  }, []);

  useEffect(() => {
    // Redirect non-admins
    if (userProfile && userProfile.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [userProfile, navigate]);

  if (!userProfile || userProfile.role !== 'admin') {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gerenciamento de Usuários
          </h1>
          <p className="text-muted-foreground">
            Crie e gerencie usuários cozinheiros para sua organização
          </p>
        </div>
        
        <AdminUserManagement />
      </div>
    </main>
  );
};

export default Users;