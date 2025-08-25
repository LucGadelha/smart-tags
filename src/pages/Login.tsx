import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session, signIn, signInWithPin, signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"admin-login" | "admin-signup" | "cook-login">("admin-login");

  useEffect(() => {
    document.title = "Login | Etiqueta Certa";
    ensureMeta(
      "description",
      "Entre para acessar o sistema de etiquetas da cozinha."
    );
    ensureCanonical(window.location.href);
  }, []);

  useEffect(() => {
    if (session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "cook-login") {
      if (!username || !pin) {
        toast({ title: "Preencha todos os campos", variant: "destructive" });
        return;
      }
      
      setSubmitting(true);
      try {
        const { error } = await signInWithPin(username, pin);
        if (error) throw error;
        toast({ title: "Login realizado com sucesso" });
      } catch (err: any) {
        toast({ title: "Erro", description: err?.message ?? "Usuário ou PIN incorretos", variant: "destructive" });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!email || !password) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "admin-login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: "Login realizado com sucesso" });
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast({
          title: "Cadastro realizado",
          description: "Verifique seu e-mail para confirmar o acesso.",
        });
      }
    } catch (err: any) {
      const message = err?.message ?? "Ocorreu um erro. Tente novamente.";
      const lower = message.toLowerCase();
      if (lower.includes("confirm")) {
        toast({
          title: "E-mail não confirmado",
          description: "Verifique sua caixa de entrada e confirme seu e-mail para acessar.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Erro", description: message, variant: "destructive" });
      }
      navigate("/login", { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-0px)] grid place-items-center px-4 py-10 bg-background">
      <article className="w-full max-w-md rounded-xl bg-card text-card-foreground shadow-[var(--shadow-card)] p-6 animate-enter">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">
            {mode === "cook-login" ? "Acesso Cozinheiro" : "Acessar Conta"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "cook-login" 
              ? "Use seu nome de usuário e PIN" 
              : "Utilize seu e-mail e senha para entrar."
            }
          </p>
        </header>

        {/* Mode Selection */}
        <div className="flex rounded-lg bg-muted p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("admin-login")}
            className={`flex-1 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              mode.startsWith("admin") 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => setMode("cook-login")}
            className={`flex-1 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              mode === "cook-login" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cozinheiro
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "cook-login" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="seu.usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.slice(0, 4))}
                  required
                  maxLength={4}
                  autoComplete="current-password"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "admin-login" ? "current-password" : "new-password"}
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Aguarde..." : 
             mode === "cook-login" ? "Entrar com PIN" :
             mode === "admin-login" ? "Entrar" : "Cadastrar"}
          </Button>
        </form>

        {mode !== "cook-login" && (
          <div className="mt-4 text-center text-sm">
            {mode === "admin-login" ? (
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setMode("admin-signup")}
              >
                Não tem conta? Cadastre-se
              </button>
            ) : (
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setMode("admin-login")}
              >
                Já tem conta? Entrar
              </button>
            )}
          </div>
        )}
      </article>
    </main>
  );
};

export default Login;
