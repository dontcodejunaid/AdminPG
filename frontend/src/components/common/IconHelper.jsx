import React from 'react';
import * as Icons from 'lucide-react';

export const DynamicIcon = ({ name, className = "w-5 h-5", fallback = "ListChecks" }) => {
  const IconComponent = Icons[name] || Icons[fallback] || Icons.ListChecks || Icons.CheckCircle2;
  return <IconComponent className={className} />;
};

export const AVAILABLE_FACILITY_ICONS = [
  'Utensils', 'Wifi', 'Wind', 'Shirt', 'ShieldCheck', 'Brush', 'SprayCan',
  'Flame', 'Car', 'ArrowUpDown', 'Bath', 'Zap', 'Dumbbell',
  'BookOpen', 'Soup', 'Tv', 'Coffee', 'Refrigerator', 'Cctv',
  'Lock', 'Trees', 'Waves', 'Fan', 'Microwave', 'Bed', 'ListChecks'
];
