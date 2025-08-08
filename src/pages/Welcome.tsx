import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat } from "lucide-react";

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

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Bem-vindo | Etiquetas";
    ensureMeta(
      "description",
      "Tela inicial de boas-vindas do sistema de etiquetas para cozinha."
    );
    ensureCanonical(window.location.href);
  }, []);

  const goLogin = useCallback(() => navigate("/login"), [navigate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goLogin();
      }
    },
    [goLogin]
  );

  return (
    <section className="fixed inset-0 z-50 bg-primary text-primary-foreground">
      <main
        role="button"
        tabIndex={0}
        aria-label="Entrar. Toque ou pressione Enter para ir ao login."
        onClick={goLogin}
        onKeyDown={handleKeyDown}
        className="h-full w-full flex items-center justify-center cursor-pointer select-none"
      >
        <div className="text-center animate-enter">
          <div className="mx-auto mb-6 flex items-center justify-center size-24 rounded-2xl bg-primary-foreground/10 ring-1 ring-primary-foreground/20 shadow-[var(--shadow-button)]">
            <ChefHat className="size-12 text-primary-foreground" aria-hidden="true" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Etiquetas
          </h1>
          <p className="mt-2 text-sm md:text-base/relaxed opacity-90">
            Toque em qualquer lugar para continuar
          </p>
        </div>
      </main>
    </section>
  );
};

export default Welcome;
