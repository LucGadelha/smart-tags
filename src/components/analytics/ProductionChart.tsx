import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

interface DailyProduction {
  date: string;
  count: number;
  active: number;
  used: number;
  discarded: number;
}

interface ProductionChartProps {
  data: DailyProduction[];
}

const chartConfig = {
  count: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
  active: {
    label: "Ativas",
    color: "hsl(var(--success))",
  },
  used: {
    label: "Utilizadas",
    color: "hsl(var(--accent))",
  },
  discarded: {
    label: "Descartadas", 
    color: "hsl(var(--destructive))",
  },
};

export const ProductionChart = ({ data }: ProductionChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Produção dos Últimos 7 Dias</CardTitle>
        <CardDescription>
          Acompanhe a produção diária de etiquetas e seus status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend 
                wrapperStyle={{
                  fontSize: '12px',
                  color: 'hsl(var(--muted-foreground))'
                }}
              />
              <Bar 
                dataKey="active" 
                name="Ativas"
                fill="hsl(var(--success))" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="used" 
                name="Utilizadas"
                fill="hsl(var(--accent))" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="discarded" 
                name="Descartadas"
                fill="hsl(var(--destructive))" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};