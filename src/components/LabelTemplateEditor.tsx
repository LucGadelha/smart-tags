import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save, Eye, Palette, Layout, Type } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface LabelTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  fontSize: {
    product: number;
    details: number;
    small: number;
  };
  showQR: boolean;
  qrSize: number;
  layout: 'standard' | 'compact' | 'detailed';
  colors: {
    background: string;
    text: string;
    accent: string;
  };
  createdAt: string;
}

interface LabelTemplateEditorProps {
  onSave: (template: LabelTemplate) => void;
  initialTemplate?: LabelTemplate;
  trigger?: React.ReactNode;
}

const DEFAULT_TEMPLATE: Omit<LabelTemplate, 'id' | 'createdAt'> = {
  name: 'Template Padrão',
  width: 70,
  height: 40,
  fontSize: {
    product: 16,
    details: 12,
    small: 10,
  },
  showQR: true,
  qrSize: 64,
  layout: 'standard',
  colors: {
    background: '#ffffff',
    text: '#000000',
    accent: '#3b82f6',
  },
};

export const LabelTemplateEditor = ({ onSave, initialTemplate, trigger }: LabelTemplateEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [template, setTemplate] = useState<Omit<LabelTemplate, 'id' | 'createdAt'>>(
    initialTemplate || DEFAULT_TEMPLATE
  );

  const handleSave = () => {
    const newTemplate: LabelTemplate = {
      ...template,
      id: initialTemplate?.id || Date.now().toString(),
      createdAt: initialTemplate?.createdAt || new Date().toISOString(),
    };

    onSave(newTemplate);
    setIsOpen(false);
    
    toast({
      title: "Template salvo",
      description: `Template "${template.name}" foi salvo com sucesso.`,
    });
  };

  const updateTemplate = (updates: Partial<typeof template>) => {
    setTemplate(prev => ({ ...prev, ...updates }));
  };

  const updateFontSize = (key: keyof typeof template.fontSize, value: number) => {
    setTemplate(prev => ({
      ...prev,
      fontSize: { ...prev.fontSize, [key]: value }
    }));
  };

  const updateColors = (key: keyof typeof template.colors, value: string) => {
    setTemplate(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  };

  const previewSampleLabel = () => {
    const sampleData = {
      productName: 'Molho de Tomate Caseiro',
      productionDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      quantity: '2 litros',
      responsible: 'João Silva',
      observations: 'Sem conservantes',
    };

    return (
      <div 
        className="border rounded-lg p-4 bg-white text-black"
        style={{
          width: `${template.width * 2}mm`,
          height: `${template.height * 2}mm`,
          fontSize: `${template.fontSize.details}px`,
          backgroundColor: template.colors.background,
          color: template.colors.text,
        }}
      >
        <div className="text-center space-y-1">
          <div 
            className="font-bold"
            style={{ 
              fontSize: `${template.fontSize.product}px`,
              color: template.colors.accent 
            }}
          >
            {sampleData.productName}
          </div>
          
          <div style={{ fontSize: `${template.fontSize.details}px` }}>
            <div><strong>PRODUÇÃO:</strong> {new Date(sampleData.productionDate).toLocaleDateString('pt-BR')}</div>
            <div><strong>VALIDADE:</strong> {new Date(sampleData.expirationDate).toLocaleDateString('pt-BR')}</div>
          </div>

          {template.layout !== 'compact' && (
            <div style={{ fontSize: `${template.fontSize.small}px` }}>
              <div><strong>Qtde:</strong> {sampleData.quantity}</div>
              {template.layout === 'detailed' && (
                <>
                  <div><strong>Resp:</strong> {sampleData.responsible}</div>
                  <div><strong>Obs:</strong> {sampleData.observations}</div>
                </>
              )}
            </div>
          )}

          {template.showQR && (
            <div className="pt-2">
              <div 
                className="mx-auto bg-gray-200 flex items-center justify-center text-xs"
                style={{ 
                  width: `${template.qrSize}px`, 
                  height: `${template.qrSize}px` 
                }}
              >
                QR
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Editor de Templates
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editor de Template de Etiqueta</DialogTitle>
        </DialogHeader>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Settings */}
          <div className="space-y-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="fonts">Fontes</TabsTrigger>
                <TabsTrigger value="colors">Cores</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Configurações Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="template-name">Nome do Template</Label>
                      <Input
                        id="template-name"
                        value={template.name}
                        onChange={(e) => updateTemplate({ name: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="width">Largura (mm)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={template.width}
                          onChange={(e) => updateTemplate({ width: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Altura (mm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={template.height}
                          onChange={(e) => updateTemplate({ height: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="layout" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Layout da Etiqueta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="layout">Tipo de Layout</Label>
                      <Select 
                        value={template.layout} 
                        onValueChange={(value: any) => updateTemplate({ layout: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Padrão</SelectItem>
                          <SelectItem value="compact">Compacto</SelectItem>
                          <SelectItem value="detailed">Detalhado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="show-qr"
                        checked={template.showQR}
                        onChange={(e) => updateTemplate({ showQR: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="show-qr">Mostrar QR Code</Label>
                    </div>
                    
                    {template.showQR && (
                      <div>
                        <Label htmlFor="qr-size">Tamanho do QR (px)</Label>
                        <Input
                          id="qr-size"
                          type="number"
                          value={template.qrSize}
                          onChange={(e) => updateTemplate({ qrSize: Number(e.target.value) })}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="fonts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Tamanhos de Fonte</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="font-product">Nome do Produto (px)</Label>
                      <Input
                        id="font-product"
                        type="number"
                        value={template.fontSize.product}
                        onChange={(e) => updateFontSize('product', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="font-details">Detalhes (px)</Label>
                      <Input
                        id="font-details"
                        type="number"
                        value={template.fontSize.details}
                        onChange={(e) => updateFontSize('details', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="font-small">Texto Pequeno (px)</Label>
                      <Input
                        id="font-small"
                        type="number"
                        value={template.fontSize.small}
                        onChange={(e) => updateFontSize('small', Number(e.target.value))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="colors" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Cores da Etiqueta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="color-background">Cor de Fundo</Label>
                      <Input
                        id="color-background"
                        type="color"
                        value={template.colors.background}
                        onChange={(e) => updateColors('background', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="color-text">Cor do Texto</Label>
                      <Input
                        id="color-text"
                        type="color"
                        value={template.colors.text}
                        onChange={(e) => updateColors('text', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="color-accent">Cor de Destaque</Label>
                      <Input
                        id="color-accent"
                        type="color"
                        value={template.colors.accent}
                        onChange={(e) => updateColors('accent', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Pré-visualização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                  {previewSampleLabel()}
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Tamanho real: {template.width}mm x {template.height}mm
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};