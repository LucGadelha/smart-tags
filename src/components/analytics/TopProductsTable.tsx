import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ProductionTrend {
  product: string;
  total: number;
  active: number;
  discarded: number;
}

interface TopProductsTableProps {
  data: ProductionTrend[];
}

export const TopProductsTable = ({ data }: TopProductsTableProps) => {
  const calculateWasteRate = (discarded: number, total: number) => {
    if (total === 0) return 0;
    return ((discarded / total) * 100);
  };

  const getWasteRateVariant = (rate: number) => {
    if (rate === 0) return 'default';
    if (rate < 10) return 'secondary';
    if (rate < 25) return 'destructive';
    return 'destructive';
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Produzidos</CardTitle>
          <CardDescription>Ranking dos produtos por quantidade de etiquetas</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">Nenhum produto encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos Mais Produzidos</CardTitle>
        <CardDescription>Ranking dos produtos por quantidade de etiquetas</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Ativas</TableHead>
              <TableHead className="text-center">Descarte</TableHead>
              <TableHead className="text-center">Taxa Descarte</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const wasteRate = calculateWasteRate(item.discarded, item.total);
              
              return (
                <TableRow key={item.product}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      {item.product}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {item.total}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      {item.active}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.discarded > 0 ? (
                      <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                        {item.discarded}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getWasteRateVariant(wasteRate)}>
                      {wasteRate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};