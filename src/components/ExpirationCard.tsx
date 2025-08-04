import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExpirationAlert } from "@/types/food";
import { AlertTriangle, Clock, X } from "lucide-react";

interface ExpirationCardProps {
  alert: ExpirationAlert;
  onClick?: () => void;
}

const ExpirationCard = ({ alert, onClick }: ExpirationCardProps) => {
  const getCardConfig = () => {
    switch (alert.type) {
      case 'expired':
        return {
          title: 'Vencidos',
          icon: X,
          bgColor: 'bg-destructive/10 border-destructive/20',
          textColor: 'text-destructive',
          badgeVariant: 'destructive' as const,
        };
      case 'today':
        return {
          title: 'Vencem Hoje',
          icon: AlertTriangle,
          bgColor: 'bg-warning/10 border-warning/20',
          textColor: 'text-warning',
          badgeVariant: 'secondary' as const,
        };
      case 'soon':
        return {
          title: 'Vencimento Próximo (48h)',
          icon: Clock,
          bgColor: 'bg-primary/10 border-primary/20',
          textColor: 'text-primary',
          badgeVariant: 'outline' as const,
        };
    }
  };

  const config = getCardConfig();
  const Icon = config.icon;

  return (
    <Card 
      className={`${config.bgColor} hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className={`flex items-center gap-2 ${config.textColor}`}>
            <Icon className="w-5 h-5" />
            <span>{config.title}</span>
          </div>
          <Badge variant={config.badgeVariant} className="text-lg px-3 py-1">
            {alert.count}
          </Badge>
        </CardTitle>
      </CardHeader>
      {alert.count > 0 && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {alert.items.slice(0, 3).map((item) => (
              <div key={item.id} className="text-sm text-muted-foreground">
                <div className="font-medium">{item.productName}</div>
                <div className="text-xs">
                  Vence: {new Date(item.expirationDate).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
            {alert.count > 3 && (
              <div className="text-xs text-muted-foreground italic">
                +{alert.count - 3} outros itens...
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ExpirationCard;