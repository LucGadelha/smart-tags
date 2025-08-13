import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Printer, Settings, Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FoodLabel } from '@/types/food';

interface PrinterConfig {
  id: string;
  name: string;
  type: 'thermal' | 'standard';
  status: 'connected' | 'disconnected' | 'error';
  paperWidth: number; // in mm
}

interface PrinterManagerProps {
  labels: FoodLabel[];
  onPrintComplete: () => void;
}

export const PrinterManager = ({ labels, onPrintComplete }: PrinterManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [printers, setPrinters] = useState<PrinterConfig[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [copies, setCopies] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    detectPrinters();
  }, []);

  const detectPrinters = async () => {
    try {
      // Simulate printer detection - in real app would use Web Serial API or Browser Print
      const mockPrinters: PrinterConfig[] = [
        {
          id: 'zebra_zt230',
          name: 'Zebra ZT230',
          type: 'thermal',
          status: 'connected',
          paperWidth: 80
        },
        {
          id: 'brother_ql820nwb',
          name: 'Brother QL-820NWB',
          type: 'thermal',
          status: 'connected',
          paperWidth: 62
        },
        {
          id: 'standard_printer',
          name: 'Impressora Padrão',
          type: 'standard',
          status: 'connected',
          paperWidth: 210
        }
      ];
      
      setPrinters(mockPrinters);
      if (mockPrinters.length > 0 && !selectedPrinter) {
        setSelectedPrinter(mockPrinters[0].id);
      }
    } catch (error) {
      toast({
        title: "Erro ao detectar impressoras",
        description: "Não foi possível encontrar impressoras disponíveis.",
        variant: "destructive",
      });
    }
  };

  const generatePrintCommand = (label: FoodLabel, printer: PrinterConfig): string => {
    if (printer.type === 'thermal') {
      // ESC/POS commands for thermal printers
      return `
^XA
^FO50,30^A0N,30,30^FD${label.productName}^FS
^FO50,80^A0N,20,20^FDPRODUCAO: ${new Date(label.productionDate).toLocaleString('pt-BR')}^FS
^FO50,110^A0N,20,20^FDVALIDADE: ${new Date(label.expirationDate).toLocaleString('pt-BR')}^FS
^FO50,140^A0N,20,20^FDQTDE: ${label.quantity}^FS
${label.responsible ? `^FO50,170^A0N,20,20^FDRESP: ${label.responsible}^FS` : ''}
${label.observations ? `^FO50,200^A0N,15,15^FD${label.observations}^FS` : ''}
^XZ
      `.trim();
    } else {
      // Standard printer HTML/CSS
      return `
        <div style="width: 70mm; font-family: Arial; padding: 5mm;">
          <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 3mm;">
            ${label.productName}
          </div>
          <div style="font-size: 10pt; line-height: 1.2;">
            <div><strong>PRODUÇÃO:</strong> ${new Date(label.productionDate).toLocaleString('pt-BR')}</div>
            <div><strong>VALIDADE:</strong> ${new Date(label.expirationDate).toLocaleString('pt-BR')}</div>
            <div><strong>QTDE:</strong> ${label.quantity}</div>
            ${label.responsible ? `<div><strong>RESP:</strong> ${label.responsible}</div>` : ''}
            ${label.observations ? `<div><strong>OBS:</strong> ${label.observations}</div>` : ''}
          </div>
        </div>
      `;
    }
  };

  const handlePrint = async () => {
    const printer = printers.find(p => p.id === selectedPrinter);
    if (!printer) {
      toast({
        title: "Impressora não selecionada",
        description: "Selecione uma impressora para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsPrinting(true);

    try {
      for (const label of labels) {
        for (let i = 0; i < copies; i++) {
          const printCommand = generatePrintCommand(label, printer);
          
          if (printer.type === 'thermal') {
            // In a real app, would send to thermal printer via Web Serial API
            await simulateThermalPrint(printCommand, printer);
          } else {
            // Standard printer using window.print()
            await simulateStandardPrint(printCommand);
          }
          
          // Small delay between prints
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      toast({
        title: "Impressão concluída",
        description: `${labels.length * copies} etiqueta(s) enviada(s) para ${printer.name}`,
      });

      onPrintComplete();
      setIsOpen(false);

    } catch (error) {
      toast({
        title: "Erro na impressão",
        description: "Não foi possível imprimir as etiquetas.",
        variant: "destructive",
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const simulateThermalPrint = async (command: string, printer: PrinterConfig) => {
    // Simulate thermal printer communication
    console.log(`Sending to ${printer.name}:`, command);
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const simulateStandardPrint = async (html: string) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
    return new Promise(resolve => setTimeout(resolve, 500));
  };

  const getStatusIcon = (status: PrinterConfig['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: PrinterConfig['status']) => {
    const variants = {
      connected: 'default' as const,
      disconnected: 'destructive' as const,
      error: 'secondary' as const,
    };
    
    const labels = {
      connected: 'Conectada',
      disconnected: 'Desconectada',
      error: 'Erro',
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={labels.length === 0}>
          <Printer className="w-4 h-4 mr-2" />
          Imprimir {labels.length} Etiqueta(s)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurações de Impressão</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Printer Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Impressora</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar impressora" />
                </SelectTrigger>
                <SelectContent>
                  {printers.map((printer) => (
                    <SelectItem key={printer.id} value={printer.id}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(printer.status)}
                        {printer.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" onClick={detectPrinters} className="w-full">
                <Wifi className="w-4 h-4 mr-2" />
                Detectar Impressoras
              </Button>
            </CardContent>
          </Card>

          {/* Selected Printer Info */}
          {selectedPrinter && (
            <Card>
              <CardContent className="p-4">
                {(() => {
                  const printer = printers.find(p => p.id === selectedPrinter);
                  return printer ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{printer.name}</span>
                        {getStatusBadge(printer.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Largura: {printer.paperWidth}mm • Tipo: {printer.type === 'thermal' ? 'Térmica' : 'Padrão'}
                      </div>
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}

          {/* Print Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cópias por etiqueta</label>
                <Select value={copies.toString()} onValueChange={(v) => setCopies(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'cópia' : 'cópias'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Print Button */}
          <Button 
            onClick={handlePrint} 
            disabled={!selectedPrinter || isPrinting} 
            className="w-full"
          >
            {isPrinting ? (
              <>Imprimindo...</>
            ) : (
              <>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir {labels.length * copies} Etiqueta(s)
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Total: {labels.length} etiqueta(s) × {copies} cópia(s) = {labels.length * copies} impressões
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};