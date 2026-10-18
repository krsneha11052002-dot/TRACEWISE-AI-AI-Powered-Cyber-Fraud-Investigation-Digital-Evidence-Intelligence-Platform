import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive = true,
  accent = 'cyan',
  onClick
}) {
  const accentGlow = {
    cyan: 'hover:border-cyan-500/40 hover:shadow-[0_0_20px_-3px_rgba(6,182,212,0.2)]',
    blue: 'hover:border-blue-500/40 hover:shadow-[0_0_20px_-3px_rgba(59,130,246,0.2)]',
    emerald: 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.2)]',
    amber: 'hover:border-amber-500/40 hover:shadow-[0_0_20px_-3px_rgba(245,158,11,0.2)]',
    rose: 'hover:border-rose-500/40 hover:shadow-[0_0_20px_-3px_rgba(244,63,94,0.2)]',
    purple: 'hover:border-purple-500/40 hover:shadow-[0_0_20px_-3px_rgba(168,85,247,0.2)]'
  };

  const iconColors = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl p-5 bg-[#0D1424]/90 border border-slate-800/80 backdrop-blur-md transition-all duration-300 group ${
        onClick ? 'cursor-pointer' : ''
      } ${accentGlow[accent] || accentGlow.cyan}`}
    >
      {/* Subtle top cyber accent bar */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent group-hover:via-cyan-400/60 transition-all duration-300" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-sm bg-cyan-400/80 inline-block" />
            {title}
          </p>
          <h3 className="text-2xl font-bold text-white tracking-tight font-mono">{value}</h3>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg border ${iconColors[accent] || iconColors.cyan} transition-transform group-hover:scale-105`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          {subtext && <span className="text-slate-400">{subtext}</span>}
          {trend && (
            <span
              className={`font-semibold flex items-center gap-1 ${
                trendPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
