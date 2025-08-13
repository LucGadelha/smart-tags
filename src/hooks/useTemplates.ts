import { useState, useEffect } from 'react';
import { LabelTemplate } from '@/components/LabelTemplateEditor';

const STORAGE_KEY = 'etiqueta-certa-templates';

const DEFAULT_TEMPLATES: LabelTemplate[] = [
  {
    id: 'standard',
    name: 'Padrão',
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
    createdAt: new Date().toISOString(),
  },
  {
    id: 'compact',
    name: 'Compacto',
    width: 50,
    height: 30,
    fontSize: {
      product: 14,
      details: 10,
      small: 8,
    },
    showQR: true,
    qrSize: 48,
    layout: 'compact',
    colors: {
      background: '#ffffff',
      text: '#000000',
      accent: '#ef4444',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'detailed',
    name: 'Detalhado',
    width: 80,
    height: 50,
    fontSize: {
      product: 18,
      details: 14,
      small: 12,
    },
    showQR: true,
    qrSize: 80,
    layout: 'detailed',
    colors: {
      background: '#ffffff',
      text: '#000000',
      accent: '#10b981',
    },
    createdAt: new Date().toISOString(),
  },
];

export const useTemplates = () => {
  const [templates, setTemplates] = useState<LabelTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('standard');

  // Load templates from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedTemplates = JSON.parse(saved);
        setTemplates(parsedTemplates);
      } catch (error) {
        setTemplates(DEFAULT_TEMPLATES);
      }
    } else {
      setTemplates(DEFAULT_TEMPLATES);
    }
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    if (templates.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    }
  }, [templates]);

  const addTemplate = (template: LabelTemplate) => {
    setTemplates(prev => [...prev, template]);
  };

  const updateTemplate = (template: LabelTemplate) => {
    setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId('standard');
    }
  };

  const getTemplate = (templateId: string): LabelTemplate | undefined => {
    return templates.find(t => t.id === templateId);
  };

  const getSelectedTemplate = (): LabelTemplate | undefined => {
    return getTemplate(selectedTemplateId);
  };

  return {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    getSelectedTemplate,
  };
};