import { QRCodeSVG } from 'qrcode.react';
import { FoodLabel } from '@/types/food';

interface QRCodeGeneratorProps {
  label: Partial<FoodLabel> & {
    productName: string;
    productionDate: string;
    expirationDate: string;
    quantity: string;
  };
  size?: number;
  className?: string;
}

export const QRCodeGenerator = ({ label, size = 80, className = "" }: QRCodeGeneratorProps) => {
  const generateQRData = () => {
    return JSON.stringify({
      id: label.id || `temp_${Date.now()}`,
      product: label.productName,
      production: label.productionDate,
      expiration: label.expirationDate,
      quantity: label.quantity,
      responsible: label.responsible || '',
      observations: label.observations || '',
      created: label.createdAt || new Date().toISOString()
    });
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <QRCodeSVG
        value={generateQRData()}
        size={size}
        level="M"
        includeMargin={true}
        bgColor="white"
        fgColor="black"
      />
      <span className="text-xs text-muted-foreground">QR Code</span>
    </div>
  );
};