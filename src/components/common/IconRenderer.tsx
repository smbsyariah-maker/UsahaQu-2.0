import React from 'react';
import * as Icons from 'lucide-react';
import { 
  UtensilsCrossed, 
  Soup, 
  Package, 
  Users, 
  Briefcase, 
  BarChart3, 
  Settings, 
  Coffee, 
  Flame, 
  ShoppingBag, 
  Receipt, 
  Clock, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

// Map custom / Ionic-style icon names to high-quality Lucide icons
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'restaurant-outline': UtensilsCrossed,
  'fast-food-outline': Soup,
  'cube-outline': Package,
  'people-outline': Users,
  'briefcase-outline': Briefcase,
  'bar-chart-outline': BarChart3,
  'settings-outline': Settings,
  // F&B shortcuts
  'coffee': Coffee,
  'food': Soup,
  'fire': Flame,
  'bag': ShoppingBag,
  'receipt': Receipt,
  'clock': Clock,
  'sparkles': Sparkles
};

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5', size }) => {
  // Check custom map first
  if (ICON_MAP[name]) {
    const Component = ICON_MAP[name];
    return <Component className={className} size={size} />;
  }

  // Then check direct Lucide icons
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[name] || HelpCircle;
  return <IconComponent className={className} size={size} />;
};
