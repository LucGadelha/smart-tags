import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import NewLabel from "./pages/NewLabel";
import Labels from "./pages/Labels";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session } = useAuth();
  return (
    <BrowserRouter>
      {session ? <Navigation /> : null}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/nova-etiqueta" element={<ProtectedRoute><NewLabel /></ProtectedRoute>} />
        <Route path="/etiquetas" element={<ProtectedRoute><Labels /></ProtectedRoute>} />
        <Route path="/produtos" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute><Users /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
