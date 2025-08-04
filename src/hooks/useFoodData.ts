import { useState, useEffect } from 'react';
import { Product, FoodLabel, ExpirationAlert } from '@/types/food';

const STORAGE_KEYS = {
  PRODUCTS: 'etiqueta-certa-products',
  LABELS: 'etiqueta-certa-labels',
};

// Sample initial data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Molho de Tomate',
    defaultValidityDays: 3,
    department: 'Cozinha Quente',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Molho Sugo',
    defaultValidityDays: 3,
    department: 'Cozinha Quente',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Salada Verde',
    defaultValidityDays: 1,
    department: 'Cozinha Fria',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Carne Moída',
    defaultValidityDays: 2,
    department: 'Açougue',
    createdAt: new Date().toISOString(),
  },
];

export const useFoodData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [labels, setLabels] = useState<FoodLabel[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const savedLabels = localStorage.getItem(STORAGE_KEYS.LABELS);

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }

    if (savedLabels) {
      setLabels(JSON.parse(savedLabels));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LABELS, JSON.stringify(labels));
  }, [labels]);

  // Helper functions
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const addLabel = (label: Omit<FoodLabel, 'id' | 'createdAt' | 'status'>) => {
    const newLabel: FoodLabel = {
      ...label,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setLabels(prev => [...prev, newLabel]);
    return newLabel;
  };

  const updateLabelStatus = (id: string, status: FoodLabel['status']) => {
    setLabels(prev => prev.map(label => 
      label.id === id ? { ...label, status } : label
    ));
  };

  const getActiveLabels = () => labels.filter(label => label.status === 'active');

  const getExpirationAlerts = (): ExpirationAlert[] => {
    const activeLabels = getActiveLabels();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(today.getTime() + 48 * 60 * 60 * 1000);

    const expired = activeLabels.filter(label => {
      const expirationDate = new Date(label.expirationDate);
      return expirationDate < today;
    });

    const expiringToday = activeLabels.filter(label => {
      const expirationDate = new Date(label.expirationDate);
      return expirationDate >= today && expirationDate < tomorrow;
    });

    const expiringSoon = activeLabels.filter(label => {
      const expirationDate = new Date(label.expirationDate);
      return expirationDate >= tomorrow && expirationDate < dayAfterTomorrow;
    });

    return [
      { type: 'expired', count: expired.length, items: expired },
      { type: 'today', count: expiringToday.length, items: expiringToday },
      { type: 'soon', count: expiringSoon.length, items: expiringSoon },
    ];
  };

  return {
    products,
    labels,
    addProduct,
    addLabel,
    updateLabelStatus,
    getActiveLabels,
    getExpirationAlerts,
  };
};