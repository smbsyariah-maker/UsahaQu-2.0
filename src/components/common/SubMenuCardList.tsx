import React from 'react';
import { ChevronRight } from 'lucide-react';
import { IconRenderer } from './IconRenderer';

export interface CardItem {
  id: string;
  title: string;
  subtitle?: string;
  mode?: string;
  badge?: string;
  iconName?: string;
}

interface SubMenuCardListProps {
  items: CardItem[];
  onSelectItem: (item: CardItem) => void;
  activeId?: string;
  themeColor?: string;
  defaultIcon?: string;
}

export const SubMenuCardList: React.FC<SubMenuCardListProps> = ({
  items,
  onSelectItem,
  activeId,
  themeColor = '#2563EB',
  defaultIcon = 'restaurant-outline'
}) => {
  return (
    <div className="bg-slate-50/60 min-h-[calc(100%-140px)] px-4 py-4 space-y-3">
      {items.map((item) => {
        const isActive = activeId === item.id;
        const iconToUse = item.iconName || defaultIcon;

        return (
          <button
            key={item.id}
            onClick={() => onSelectItem(item)}
            className={`w-full text-left bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border transition-all duration-200 flex items-center justify-between group active:scale-[0.99] ${
              isActive
                ? 'border-slate-800 ring-2 ring-slate-400/30'
                : 'border-slate-100 hover:border-slate-300'
            }`}
          >
            {/* Left side: Square themed icon with rounded corners & texts */}
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div 
                style={{ backgroundColor: themeColor }}
                className="w-13 h-13 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform"
              >
                <IconRenderer name={iconToUse} className="w-6 h-6 text-white stroke-[2.3]" />
              </div>

              {/* Bold main title & descriptive subtitle */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-[14.5px] leading-tight tracking-tight group-hover:text-slate-900 transition-colors truncate">
                    {item.title}
                  </h3>
                  {item.mode && (
                    <span className="shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 uppercase">
                      {item.mode}
                    </span>
                  )}
                  {item.badge && !item.mode && (
                    <span 
                      style={{ color: themeColor, backgroundColor: `${themeColor}15` }}
                      className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug truncate">
                  {item.subtitle || 'Buka menu untuk detail operasional'}
                </p>
              </div>
            </div>

            {/* Far right: Simple grey greater-than arrow icon (>) */}
            <div className="shrink-0 pl-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all">
                <ChevronRight className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
