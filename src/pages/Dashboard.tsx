import { useFoodData } from "@/hooks/useFoodData";
import { useLabelAnalytics } from "@/hooks/useLabelAnalytics";
import ExpirationCard from "@/components/ExpirationCard";
import QuickActionCard from "@/components/QuickActionCard";
import { StatsCard } from "@/components/analytics/StatsCard";
import { ProductionChart } from "@/components/analytics/ProductionChart";
import { StatusPieChart } from "@/components/analytics/StatusPieChart";
import { TopProductsTable } from "@/components/analytics/TopProductsTable";
import { Plus, Search, Package, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { getExpirationAlerts, labels } = useFoodData();
  const navigate = useNavigate();
  const alerts = getExpirationAlerts();
  const analytics = useLabelAnalytics(labels);

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

        {/* Key Metrics */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Métricas Principais
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            <StatsCard
              title="Total de Etiquetas"
              value={analytics.stats.total}
              subtitle="Todas as etiquetas criadas"
              icon={BarChart3}
              variant="default"
            />
            <StatsCard
              title="Etiquetas Ativas"
              value={analytics.stats.active}
              subtitle={`${analytics.stats.expired} vencidas`}
              icon={CheckCircle}
              variant="success"
            />
            <StatsCard
              title="Taxa de Utilização"
              value={`${analytics.utilizationRate.toFixed(1)}%`}
              subtitle="Etiquetas utilizadas"
              icon={TrendingUp}
              variant={analytics.utilizationRate > 80 ? 'success' : 'warning'}
            />
            <StatsCard
              title="Taxa de Descarte"
              value={`${analytics.wasteRate.toFixed(1)}%`}
              subtitle="Produtos descartados"
              icon={AlertTriangle}
              variant={analytics.wasteRate > 20 ? 'destructive' : analytics.wasteRate > 10 ? 'warning' : 'success'}
            />
          </div>
        </section>

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

        {/* Charts and Analytics */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Análise de Dados
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            <ProductionChart data={analytics.dailyProduction} />
            <StatusPieChart data={analytics.statusDistribution} />
          </div>
        </section>

        {/* Top Products */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Produtos em Destaque
          </h2>
          <div className="animate-fade-in">
            <TopProductsTable data={analytics.productionTrends} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;