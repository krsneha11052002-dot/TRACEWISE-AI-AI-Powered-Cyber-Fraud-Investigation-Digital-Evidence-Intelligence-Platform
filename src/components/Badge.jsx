import React from 'react';

export default function Badge({ children, variant = 'default', size = 'sm', pulse = false }) {
  const variantStyles = {
    critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
    default: 'bg-slate-800/80 text-cyan-300 border-cyan-500/20'
  };

  const dotColors = {
    critical: 'bg-rose-400',
    high: 'bg-orange-400',
    medium: 'bg-amber-400',
    low: 'bg-blue-400',
    success: 'bg-emerald-400',
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    neutral: 'bg-slate-400',
    default: 'bg-cyan-400'
  };

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5'
  };

  const selectedVariant = variantStyles[variant.toLowerCase()] || variantStyles.default;
  const selectedDot = dotColors[variant.toLowerCase()] || dotColors.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${selectedVariant} ${sizeStyles[size]} transition-all`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${selectedDot} ${pulse ? 'animate-ping' : ''}`} />
      <span>{children}</span>
    </span>
  );
}
