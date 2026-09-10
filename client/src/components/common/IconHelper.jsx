import React from 'react';
import * as Icons from 'lucide-react';

export const DynamicIcon = ({ name, className = "w-5 h-5", fallback = "Sparkles" }) => {
  const IconComponent = Icons[name] || Icons[fallback] || Icons.Sparkles;
  return <IconComponent className={className} />;
};

export const AVAILABLE_FACILITY_ICONS = [
  'Utensils', 'Wifi', 'Wind', 'Shirt', 'ShieldCheck', 'Sparkles',
  'Flame', 'Car', 'ArrowUpDown', 'Bath', 'Zap', 'Dumbbell',
  'BookOpen', 'Soup', 'Tv', 'Coffee', 'Refrigerator', 'Cctv',
  'Lock', 'Trees', 'Waves', 'Fan', 'Microwave', 'Bed'
];
