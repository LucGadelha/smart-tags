import { useEffect } from "react";

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
  useEffect(() => {
    document.title = "Login | Etiquetas";
    ensureMeta(
      "description",
      "Acesse o sistema de etiquetas da cozinha para emitir e gerenciar etiquetas."
    );
    ensureCanonical(window.location.href);
  }, []);

  return (
    <main className="min-h-[calc(100vh-0px)] grid place-items-center px-4 py-10">
      <article className="w-full max-w-md rounded-lg bg-card text-card-foreground shadow-[var(--shadow-card)] p-6 animate-enter">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-muted-foreground">
            Autenticação será adicionada em seguida.
          </p>
        </header>
        {/* Placeholder simples para não alterar funcionalidades agora */}
        <div className="text-sm text-muted-foreground">
          Cliquei na tela inicial e cheguei aqui. Em breve adicionaremos o formulário de login.
        </div>
      </article>
    </main>
  );
};

export default Login;
