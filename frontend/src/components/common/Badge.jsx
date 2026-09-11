import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    // Status (Publish Status)
    Active: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800 font-bold',
    Inactive: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800 font-bold',
    
    // Availability
    Available: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800 font-medium',
    Limited: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    Full: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',

    // Verification
    Verified: 'bg-brand-100 text-brand-900 border-brand-300 dark:bg-brand-950/80 dark:text-brand-300 dark:border-brand-800 font-bold',
    Pending: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    'Not Verified': 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    Resolved: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    Deactivated: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    Ignored: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',

    // Enquiries CRM
    New: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    Contacted: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
    Interested: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    Visited: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    Closed: 'bg-brand-100 text-brand-800 border-brand-200 dark:bg-brand-950/80 dark:text-brand-300 dark:border-brand-800',

    // PG Types
    Boys: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 font-semibold',
    Girls: 'bg-pink-50 text-pink-800 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800 font-semibold',
    'Co-living': 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 font-semibold',

    // Roles
    'Super Admin': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300',
    Admin: 'bg-brand-100 text-brand-800 border-brand-200 dark:bg-brand-950/60 dark:text-brand-300',
    Staff: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300',

    // Payments
    Success: 'bg-brand-100 text-brand-800 border-brand-200 dark:bg-brand-950/60 dark:text-brand-300',
    Failed: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300',

    // General
    featured: 'bg-amber-500 text-white border-amber-600 shadow-sm font-black',
    default: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5'
  };

  const badgeStyle = variants[variant] || variants.default;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <span className={`inline-flex items-center justify-center gap-1.5 rounded-full border whitespace-nowrap shrink-0 ${badgeStyle} ${sizeStyle} ${className}`}>
      {children}
    </span>
  );
};
