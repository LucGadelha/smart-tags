import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Printer, Calendar, Package, User } from 'lucide-react';
import { FoodLabel } from '@/types/food';
import { PrinterManager } from './PrinterManager';

interface BatchPrintDialogProps {
  labels: FoodLabel[];
  trigger?: React.ReactNode;
}

export const BatchPrintDialog = ({ labels, trigger }: BatchPrintDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev => 
      prev.includes(labelId) 
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  const toggleAll = () => {
    if (selectedLabels.length === labels.length) {
      setSelectedLabels([]);
    } else {
      setSelectedLabels(labels.map(l => l.id));
    }
  };

  const getExpirationStatus = (expirationDate: string) => {
    const now = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Vencido', variant: 'destructive' as const };
    } else if (diffDays === 0) {
      return { label: 'Vence Hoje', variant: 'secondary' as const };
    } else if (diffDays <= 1) {
      return { label: 'Vence Amanhã', variant: 'secondary' as const };
    } else {
      return { label: `${diffDays} dias`, variant: 'outline' as const };
    }
  };

  const selectedLabelObjects = labels.filter(label => selectedLabels.includes(label.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Impressão em Lote
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Impressão em Lote</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Selection Header */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedLabels.length === labels.length}
                    onCheckedChange={toggleAll}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="font-medium">
                    Selecionar todas ({labels.length} etiquetas)
                  </span>
                </div>
                <Badge variant="secondary">
                  {selectedLabels.length} selecionada(s)
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Labels List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {labels.map((label) => {
              const isSelected = selectedLabels.includes(label.id);
              const expirationStatus = getExpirationStatus(label.expirationDate);

              return (
                <Card key={label.id} className={`transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleLabel(label.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            {label.productName}
                          </div>
                          <Badge variant={expirationStatus.variant}>
                            {expirationStatus.label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>Prod: {new Date(label.productionDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>Val: {new Date(label.expirationDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div>
                            <strong>Qtde:</strong> {label.quantity}
                          </div>
                          {label.responsible && (
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3" />
                              <span>{label.responsible}</span>
                            </div>
                          )}
                        </div>
                        
                        {label.observations && (
                          <div className="text-xs text-muted-foreground">
                            <strong>Obs:</strong> {label.observations}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {labels.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma etiqueta disponível para impressão</p>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Print Manager */}
          {selectedLabels.length > 0 && (
            <PrinterManager
              labels={selectedLabelObjects}
              onPrintComplete={() => {
                setSelectedLabels([]);
                setIsOpen(false);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};