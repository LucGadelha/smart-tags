import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-0px)] grid place-items-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-label="Carregando" />
      </main>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
