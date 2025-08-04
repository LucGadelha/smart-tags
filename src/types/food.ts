export interface Product {
  id: string;
  name: string;
  defaultValidityDays: number;
  department: string;
  createdAt: string;
}

export interface FoodLabel {
  id: string;
  productName: string;
  productionDate: string;
  expirationDate: string;
  quantity: string;
  responsible?: string;
  observations?: string;
  status: 'active' | 'used' | 'discarded';
  createdAt: string;
}

export interface ExpirationAlert {
  type: 'expired' | 'today' | 'soon';
  count: number;
  items: FoodLabel[];
}