import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const QuickActionCard = ({ title, icon: Icon, onClick, variant = 'primary' }: QuickActionCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-95 hover-scale animate-enter ${
        variant === 'primary' 
          ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:from-primary/10 hover:to-primary/15'
          : 'bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover:from-secondary/10 hover:to-secondary/15'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center animate-fade-in">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          variant === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        }`}>
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </CardContent>
    </Card>
  );
};

export default QuickActionCard;