import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFoodData } from "@/hooks/useFoodData";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Printer, Save, ArrowLeft, Search } from "lucide-react";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NewLabel = () => {
  const { products, addLabel } = useFoodData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: '',
    productionDate: new Date().toISOString().slice(0, 16),
    expirationDate: '',
    quantity: '',
    responsible: '',
    observations: '',
  });

  const [isProductOpen, setIsProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const handleProductSelect = (productName: string) => {
    const product = products.find(p => p.name === productName);
    if (product) {
      const productionDate = new Date(formData.productionDate);
      const expirationDate = new Date(productionDate.getTime() + product.defaultValidityDays * 24 * 60 * 60 * 1000);
      
      setFormData(prev => ({
        ...prev,
        productName,
        expirationDate: expirationDate.toISOString().slice(0, 16),
      }));
      setSelectedProduct(productName);
    } else {
      setFormData(prev => ({ ...prev, productName }));
      setSelectedProduct(productName);
    }
    setIsProductOpen(false);
  };

  const handleSubmit = (action: 'save' | 'print') => {
    if (!formData.productName || !formData.expirationDate || !formData.quantity) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha produto, validade e quantidade.",
        variant: "destructive",
      });
      return;
    }

    const newLabel = addLabel(formData);

    if (action === 'print') {
      // Simulate printing
      toast({
        title: "Etiqueta enviada para impressão",
        description: `Etiqueta de ${formData.productName} será impressa.`,
      });
    } else {
      toast({
        title: "Etiqueta salva",
        description: "Etiqueta salva com sucesso!",
      });
    }

    // Reset form
    setFormData({
      productName: '',
      productionDate: new Date().toISOString().slice(0, 16),
      expirationDate: '',
      quantity: '',
      responsible: '',
      observations: '',
    });
    setSelectedProduct('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Nova Etiqueta</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Dados da Etiqueta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Selection */}
              <div className="space-y-2">
                <Label htmlFor="product">Produto *</Label>
                <Popover open={isProductOpen} onOpenChange={setIsProductOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isProductOpen}
                      className="w-full justify-between"
                    >
                      {selectedProduct || "Selecionar produto..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Digite o nome do produto..."
                        value={formData.productName}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, productName: value }))}
                      />
                      <CommandList>
                        <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                        <CommandGroup>
                          {products
                            .filter(product => 
                              product.name.toLowerCase().includes(formData.productName.toLowerCase())
                            )
                            .map((product) => (
                            <CommandItem
                              key={product.id}
                              value={product.name}
                              onSelect={() => handleProductSelect(product.name)}
                            >
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {product.department} • {product.defaultValidityDays} dias
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                          {formData.productName && !products.some(p => 
                            p.name.toLowerCase() === formData.productName.toLowerCase()
                          ) && (
                            <CommandItem
                              value={formData.productName}
                              onSelect={() => handleProductSelect(formData.productName)}
                            >
                              Criar produto: "{formData.productName}"
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Production Date */}
              <div className="space-y-2">
                <Label htmlFor="production">Data/Hora de Produção *</Label>
                <Input
                  id="production"
                  type="datetime-local"
                  value={formData.productionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, productionDate: e.target.value }))}
                />
              </div>

              {/* Expiration Date */}
              <div className="space-y-2">
                <Label htmlFor="expiration">Data/Hora de Validade *</Label>
                <Input
                  id="expiration"
                  type="datetime-local"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  placeholder="Ex: 5 litros, 3 porções, 2 kg"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>

              {/* Responsible */}
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável</Label>
                <Input
                  id="responsible"
                  placeholder="Nome do funcionário"
                  value={formData.responsible}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsible: e.target.value }))}
                />
              </div>

              {/* Observations */}
              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  placeholder="Ex: Sem sal, Lote 2, etc."
                  value={formData.observations}
                  onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="kitchen"
                  size="lg"
                  onClick={() => handleSubmit('print')}
                  className="flex-1"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Imprimir Etiqueta
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleSubmit('save')}
                >
                  <Save className="w-5 h-5 mr-2" />
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Label Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Pré-visualização da Etiqueta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border p-6 rounded-lg bg-card min-h-[400px]">
                <div className="space-y-3 text-center">
                  <div className="text-xl font-bold">
                    {formData.productName || 'Nome do Produto'}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>PRODUÇÃO:</strong> {
                        formData.productionDate 
                          ? new Date(formData.productionDate).toLocaleString('pt-BR')
                          : '___/___/___ __:__'
                      }
                    </div>
                    <div>
                      <strong>VALIDADE:</strong> {
                        formData.expirationDate 
                          ? new Date(formData.expirationDate).toLocaleString('pt-BR')
                          : '___/___/___ __:__'
                      }
                    </div>
                  </div>

                  {(formData.quantity || formData.responsible || formData.observations) && (
                    <div className="space-y-1 text-sm border-t pt-3">
                      {formData.quantity && (
                        <div><strong>Qtde:</strong> {formData.quantity}</div>
                      )}
                      {formData.responsible && (
                        <div><strong>Responsável:</strong> {formData.responsible}</div>
                      )}
                      {formData.observations && (
                        <div><strong>Obs:</strong> {formData.observations}</div>
                      )}
                    </div>
                  )}

                  {/* QR Code */}
                  <div className="border-t pt-3 mt-3">
                    <QRCodeGenerator 
                      label={{
                        productName: formData.productName,
                        productionDate: formData.productionDate,
                        expirationDate: formData.expirationDate,
                        quantity: formData.quantity,
                        responsible: formData.responsible,
                        observations: formData.observations,
                      }}
                      size={64}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                * Tamanho real: 70mm x 40mm • Inclui QR Code
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewLabel;