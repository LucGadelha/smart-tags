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
  const { session, signIn, signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

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
    if (!email || !password) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: "Login realizado com sucesso" });
        // Redirecionado pelo efeito do session
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
          <h1 className="text-2xl font-semibold">Acessar Conta</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Utilize seu e-mail e senha para entrar.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => setMode("signup")}
            >
              Não tem conta? Cadastre-se
            </button>
          ) : (
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => setMode("login")}
            >
              Já tem conta? Entrar
            </button>
          )}
        </div>
      </article>
    </main>
  );
};

export default Login;
