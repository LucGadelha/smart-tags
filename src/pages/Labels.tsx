import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFoodData } from "@/hooks/useFoodData";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Search, Printer, CheckCircle, X, Filter } from "lucide-react";
import { FoodLabel } from "@/types/food";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Labels = () => {
  const { getActiveLabels, updateLabelStatus } = useFoodData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expired' | 'today' | 'soon'>('all');
  const [filteredLabels, setFilteredLabels] = useState<FoodLabel[]>([]);

  const activeLabels = getActiveLabels();

  // Handle initial filter from dashboard
  useEffect(() => {
    if (location.state?.filter) {
      setFilterType(location.state.filter);
    }
  }, [location.state]);

  // Filter labels based on search and filter type
  useEffect(() => {
    let filtered = activeLabels;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(label =>
        label.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (filterType !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const dayAfterTomorrow = new Date(today.getTime() + 48 * 60 * 60 * 1000);

      filtered = filtered.filter(label => {
        const expirationDate = new Date(label.expirationDate);
        
        switch (filterType) {
          case 'expired':
            return expirationDate < today;
          case 'today':
            return expirationDate >= today && expirationDate < tomorrow;
          case 'soon':
            return expirationDate >= tomorrow && expirationDate < dayAfterTomorrow;
          default:
            return true;
        }
      });
    }

    // Sort by expiration date (most urgent first)
    filtered.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());

    setFilteredLabels(filtered);
  }, [activeLabels, searchTerm, filterType]);

  const handleStatusUpdate = (labelId: string, status: FoodLabel['status'], productName: string) => {
    updateLabelStatus(labelId, status);
    
    const statusText = status === 'used' ? 'utilizado' : 'descartado';
    toast({
      title: "Status atualizado",
      description: `${productName} marcado como ${statusText}.`,
    });
  };

  const getExpirationStatus = (expirationDate: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(today.getTime() + 48 * 60 * 60 * 1000);
    const expDate = new Date(expirationDate);

    if (expDate < today) {
      return { label: 'Vencido', variant: 'destructive' as const };
    } else if (expDate < tomorrow) {
      return { label: 'Vence Hoje', variant: 'secondary' as const };
    } else if (expDate < dayAfterTomorrow) {
      return { label: 'Vence em 48h', variant: 'outline' as const };
    } else {
      return { label: 'Válido', variant: 'default' as const };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Etiquetas Ativas</h1>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome do produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filtrar por vencimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="expired">Vencidos</SelectItem>
                    <SelectItem value="today">Vencem Hoje</SelectItem>
                    <SelectItem value="soon">Vencimento Próximo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredLabels.length} etiqueta(s) encontrada(s)
          </p>
          <Button onClick={() => navigate('/nova-etiqueta')} variant="kitchen">
            <X className="w-4 h-4 mr-2" />
            Nova Etiqueta
          </Button>
        </div>

        {/* Labels Grid */}
        {filteredLabels.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                {searchTerm || filterType !== 'all' 
                  ? 'Nenhuma etiqueta encontrada com os filtros aplicados.' 
                  : 'Nenhuma etiqueta ativa encontrada.'}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLabels.map((label) => {
              const status = getExpirationStatus(label.expirationDate);
              
              return (
                <Card key={label.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">
                        {label.productName}
                      </CardTitle>
                      <Badge variant={status.variant} className="shrink-0 ml-2">
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Produção:</strong> {new Date(label.productionDate).toLocaleString('pt-BR')}
                      </div>
                      <div>
                        <strong>Validade:</strong> {new Date(label.expirationDate).toLocaleString('pt-BR')}
                      </div>
                      <div>
                        <strong>Quantidade:</strong> {label.quantity}
                      </div>
                      {label.responsible && (
                        <div>
                          <strong>Responsável:</strong> {label.responsible}
                        </div>
                      )}
                      {label.observations && (
                        <div>
                          <strong>Obs:</strong> {label.observations}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast({ title: "Etiqueta reenviada", description: "Etiqueta enviada para impressão." })}
                        className="flex-1"
                      >
                        <Printer className="w-4 h-4 mr-1" />
                        Reimprimir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(label.id, 'used', label.productName)}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Usado
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleStatusUpdate(label.id, 'discarded', label.productName)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Labels;