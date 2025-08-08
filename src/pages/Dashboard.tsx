import { useFoodData } from "@/hooks/useFoodData";
import ExpirationCard from "@/components/ExpirationCard";
import QuickActionCard from "@/components/QuickActionCard";
import { Plus, Search, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { getExpirationAlerts } = useFoodData();
  const navigate = useNavigate();
  const alerts = getExpirationAlerts();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="text-center py-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sistema de Controle de Alimentos
          </h1>
          <p className="text-muted-foreground text-lg">
            Controle de validade rápido e eficiente para sua cozinha
          </p>
        </div>

        {/* Expiration Alerts */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Alertas de Vencimento
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {alerts.map((alert) => (
              <ExpirationCard 
                key={alert.type} 
                alert={alert}
                onClick={() => navigate('/etiquetas', { state: { filter: alert.type } })}
              />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            <QuickActionCard
              title="Emitir Nova Etiqueta"
              icon={Plus}
              onClick={() => navigate('/nova-etiqueta')}
              variant="primary"
            />
            <QuickActionCard
              title="Visualizar Etiquetas"
              icon={Search}
              onClick={() => navigate('/etiquetas')}
              variant="secondary"
            />
            <QuickActionCard
              title="Gerenciar Produtos"
              icon={Package}
              onClick={() => navigate('/produtos')}
              variant="secondary"
            />
          </div>
        </section>

        {/* Stats Summary */}
        <section className="bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-xl p-6 border border-primary/10 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Resumo do Sistema
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {alerts.reduce((acc, alert) => acc + alert.count, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total de Alertas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">
                {alerts.find(a => a.type === 'expired')?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Vencidos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {alerts.find(a => a.type === 'today')?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Vencem Hoje</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {alerts.find(a => a.type === 'soon')?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Próximos</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;