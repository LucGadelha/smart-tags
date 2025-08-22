import { useMemo } from 'react';
import { FoodLabel } from '@/types/food';
import { format, subDays, isWithinInterval } from 'date-fns';

interface LabelStats {
  total: number;
  active: number;
  used: number;
  discarded: number;
  expired: number;
  expiringToday: number;
  expiringSoon: number;
}

interface DepartmentStats {
  name: string;
  count: number;
  active: number;
  discarded: number;
}

interface DailyProduction {
  date: string;
  count: number;
  active: number;
  used: number;
  discarded: number;
}

interface ProductionTrend {
  product: string;
  total: number;
  active: number;
  discarded: number;
}

export const useLabelAnalytics = (labels: FoodLabel[]) => {
  const analytics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(today.getTime() + 48 * 60 * 60 * 1000);

    // Basic stats
    const stats: LabelStats = {
      total: labels.length,
      active: labels.filter(l => l.status === 'active').length,
      used: labels.filter(l => l.status === 'used').length,
      discarded: labels.filter(l => l.status === 'discarded').length,
      expired: 0,
      expiringToday: 0,
      expiringSoon: 0,
    };

    const activeLabels = labels.filter(l => l.status === 'active');
    
    // Expiration analysis for active labels
    activeLabels.forEach(label => {
      const expirationDate = new Date(label.expirationDate);
      if (expirationDate < today) {
        stats.expired++;
      } else if (expirationDate >= today && expirationDate < tomorrow) {
        stats.expiringToday++;
      } else if (expirationDate >= tomorrow && expirationDate < dayAfterTomorrow) {
        stats.expiringSoon++;
      }
    });

    // Status distribution for charts
    const statusDistribution = [
      { name: 'Ativas', value: stats.active, color: 'hsl(var(--success))' },
      { name: 'Utilizadas', value: stats.used, color: 'hsl(var(--primary))' },
      { name: 'Descartadas', value: stats.discarded, color: 'hsl(var(--destructive))' },
    ].filter(item => item.value > 0);

    // Department analysis
    const departmentMap = new Map<string, { active: number; discarded: number; total: number }>();
    
    labels.forEach(label => {
      // Extract department from product name or use a default
      const department = label.productName.includes('Molho') ? 'Cozinha Quente' : 
                        label.productName.includes('Salada') ? 'Cozinha Fria' :
                        label.productName.includes('Carne') ? 'Açougue' : 'Geral';
      
      if (!departmentMap.has(department)) {
        departmentMap.set(department, { active: 0, discarded: 0, total: 0 });
      }
      
      const dept = departmentMap.get(department)!;
      dept.total++;
      
      if (label.status === 'active') dept.active++;
      if (label.status === 'discarded') dept.discarded++;
    });

    const departmentStats: DepartmentStats[] = Array.from(departmentMap.entries()).map(([name, data]) => ({
      name,
      count: data.total,
      active: data.active,
      discarded: data.discarded,
    }));

    // Daily production for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, i);
      return {
        date: format(date, 'dd/MM'),
        fullDate: date,
        count: 0,
        active: 0,
        used: 0,
        discarded: 0,
      };
    }).reverse();

    labels.forEach(label => {
      const createdDate = new Date(label.createdAt);
      const dayIndex = last7Days.findIndex(day => 
        isWithinInterval(createdDate, {
          start: day.fullDate,
          end: new Date(day.fullDate.getTime() + 24 * 60 * 60 * 1000 - 1)
        })
      );
      
      if (dayIndex !== -1) {
        last7Days[dayIndex].count++;
        if (label.status === 'active') last7Days[dayIndex].active++;
        if (label.status === 'used') last7Days[dayIndex].used++;
        if (label.status === 'discarded') last7Days[dayIndex].discarded++;
      }
    });

    const dailyProduction: DailyProduction[] = last7Days.map(({ fullDate, ...day }) => day);

    // Product production trends
    const productMap = new Map<string, { total: number; active: number; discarded: number }>();
    
    labels.forEach(label => {
      if (!productMap.has(label.productName)) {
        productMap.set(label.productName, { total: 0, active: 0, discarded: 0 });
      }
      
      const product = productMap.get(label.productName)!;
      product.total++;
      
      if (label.status === 'active') product.active++;
      if (label.status === 'discarded') product.discarded++;
    });

    const productionTrends: ProductionTrend[] = Array.from(productMap.entries())
      .map(([product, data]) => ({
        product,
        ...data,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 products

    // Waste analysis
    const wasteRate = stats.total > 0 ? (stats.discarded / stats.total) * 100 : 0;
    const utilizationRate = stats.total > 0 ? (stats.used / stats.total) * 100 : 0;

    return {
      stats,
      statusDistribution,
      departmentStats,
      dailyProduction,
      productionTrends,
      wasteRate,
      utilizationRate,
    };
  }, [labels]);

  return analytics;
};