import React from 'react';
import { LayoutDashboard, UtensilsCrossed, Coffee, Package, BarChart3 } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  activeOrderCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  activeOrderCount = 0
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'order', label: 'Order', icon: UtensilsCrossed, badge: activeOrderCount > 0 ? activeOrderCount : undefined },
    { id: 'menu_makanan', label: 'Menu', icon: Coffee },
    { id: 'stok_bahan', label: 'Stok', icon: Package },
    { id: 'laporan', label: 'Laporan', icon: BarChart3 }
  ];

  return (
    <nav 
      aria-label="Navigasi Cepat Bawah Terkunci"
      className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.05)] px-1 pt-1 pb-[max(env(safe-area-inset-bottom,0px),0.35rem)] flex items-center justify-around select-none shrink-0 sticky bottom-0 z-50 pointer-events-auto"
    >
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-0.5 px-2 rounded-lg transition-all duration-150 relative group cursor-pointer active:scale-95 ${
              isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <div
                className={`p-1 rounded-lg transition-all ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'group-hover:bg-slate-50'
                }`}
              >
                <IconComponent className="w-[18px] h-[18px] stroke-[2.2]" />
              </div>
              {tab.badge && (
                <span className="absolute -top-0.5 -right-1.5 bg-rose-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-2xs leading-none">
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[9.5px] leading-tight tracking-tight mt-0.5 transition-all ${
                isActive ? 'font-black text-blue-600' : 'font-medium text-slate-500'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
