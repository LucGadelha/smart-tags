import { useState, useEffect } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, X, QrCode } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FoodLabel } from '@/types/food';
import { useFoodData } from '@/hooks/useFoodData';

interface BarcodeScannerProps {
  onScanResult: (label: FoodLabel) => void;
  trigger?: React.ReactNode;
}

export const BarcodeScanner = ({ onScanResult, trigger }: BarcodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const { getActiveLabels } = useFoodData();

  useEffect(() => {
    // Check if camera is available
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then(() => setHasCamera(true))
      .catch(() => setHasCamera(false));
  }, []);

  const handleScan = (result: string) => {
    try {
      const qrData = JSON.parse(result);
      
      // Find the label in active labels
      const activeLabels = getActiveLabels();
      const foundLabel = activeLabels.find(label => label.id === qrData.id);
      
      if (foundLabel) {
        onScanResult(foundLabel);
        setIsOpen(false);
        toast({
          title: "QR Code lido com sucesso!",
          description: `Etiqueta: ${foundLabel.productName}`,
        });
      } else {
        toast({
          title: "Etiqueta não encontrada",
          description: "Esta etiqueta pode ter sido removida ou marcada como usada.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "QR Code inválido",
        description: "O código lido não é uma etiqueta válida.",
        variant: "destructive",
      });
    }
  };

  const handleError = (error: any) => {
    console.error('Scanner error:', error);
    toast({
      title: "Erro no scanner",
      description: "Não foi possível acessar a câmera.",
      variant: "destructive",
    });
  };

  if (!hasCamera) {
    return (
      <Card className="p-4">
        <div className="text-center space-y-2">
          <Camera className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Câmera não disponível neste dispositivo
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full">
            <QrCode className="w-4 h-4 mr-2" />
            Scanner QR Code
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scanner de QR Code</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                <BarcodeScannerComponent
                  onUpdate={(error, result) => {
                    if (result) {
                      handleScan(result.getText());
                    }
                    if (error && isScanning) {
                      handleError(error);
                    }
                  }}
                  width="100%"
                  height="100%"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Posicione o QR code da etiqueta na área de leitura
            </p>
            <Button
              variant="outline"
              onClick={() => setIsScanning(!isScanning)}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Parar Scanner
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Iniciar Scanner
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};