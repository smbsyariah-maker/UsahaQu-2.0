import React from 'react';
import { ArrowLeft, Info, Sparkles, UtensilsCrossed } from 'lucide-react';

interface SubMenuHeaderProps {
  title: string;
  subtitle?: string;
  infoLabel?: string;
  onBack: () => void;
  iconGraphic?: React.ReactNode;
  themeColor?: string;
}

export const SubMenuHeader: React.FC<SubMenuHeaderProps> = ({
  title,
  subtitle = 'Manajemen KedaiQu',
  infoLabel,
  onBack,
  iconGraphic,
  themeColor = '#2563EB'
}) => {
  return (
    <div className="relative">
      {/* Top Header: Dynamic Brand Background */}
      <div 
        style={{ backgroundColor: themeColor }}
        className="text-white px-5 pt-4 pb-8 relative overflow-hidden shadow-md transition-colors"
      >
        {/* Subtle decorative circles for depth */}
        <div className="absolute right-20 top-2 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -right-4 -bottom-6 opacity-15 pointer-events-none select-none">
          {iconGraphic || <UtensilsCrossed className="w-28 h-28 text-white" />}
        </div>

        {/* Header Content Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Kembali ke Dashboard"
              className="w-10 h-10 rounded-full bg-white/15 active:bg-white/30 hover:bg-white/20 flex items-center justify-center transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight">{title}</h1>
              <p className="text-xs text-white/90 font-medium">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-semibold text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-white/80" />
              <span>KedaiQu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Below the header: Rounded white container card with small info icon and title label */}
      <div className="px-4 -mt-5 relative z-20">
        <div className="bg-white rounded-xl px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-slate-100/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div 
              style={{ color: themeColor }}
              className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0"
            >
              <Info className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-800 tracking-tight">
                {infoLabel || `Modul ${title}`}
              </span>
              <p className="text-[10px] text-slate-500">Pilih sub-menu untuk mengelola operasional</p>
            </div>
          </div>
          <div 
            style={{ color: themeColor, backgroundColor: `${themeColor}15` }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold"
          >
            <span>Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
};
