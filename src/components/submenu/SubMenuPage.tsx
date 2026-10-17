import React from 'react';
import { SubMenuHeader } from '../common/SubMenuHeader';
import { SubMenuCardList } from '../common/SubMenuCardList';
import { Sparkles, UtensilsCrossed } from 'lucide-react';
import { KedaiQuNavModule, KedaiQuSubMenu } from '../../config/kedaiQuNav';

interface SubMenuPageProps {
  module: KedaiQuNavModule;
  onBack: () => void;
  onSelectSubMenu: (subItem: KedaiQuSubMenu) => void;
  activeSubMenuId?: string;
}

export const SubMenuPage: React.FC<SubMenuPageProps> = ({
  module,
  onBack,
  onSelectSubMenu,
  activeSubMenuId
}) => {
  return (
    <div className="flex-1 bg-white flex flex-col min-h-screen">
      {/* Top Header with dynamic module color */}
      <SubMenuHeader
        title={module.title}
        subtitle="Manajemen KedaiQu"
        infoLabel={`Modul Manajemen ${module.title}`}
        onBack={onBack}
        themeColor={module.color}
      />

      {/* Content Body: The Card List */}
      <div className="flex-1 bg-white">
        {/* Module description helper */}
        <div className="px-5 pt-4 pb-1">
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            {module.description || 'Pilih salah satu sub-menu di bawah untuk mulai mengelola operasional kedai.'}
          </p>
        </div>

        {/* The Card List */}
        <SubMenuCardList
          items={module.sub_menus.map((s) => ({
            id: s.id,
            title: s.title,
            subtitle: s.subtitle,
            mode: s.mode,
            badge: s.badge,
            iconName: module.icon
          }))}
          onSelectItem={(item) => {
            const found = module.sub_menus.find((s) => s.id === item.id);
            if (found) onSelectSubMenu(found);
          }}
          activeId={activeSubMenuId}
          themeColor={module.color}
          defaultIcon={module.icon}
        />
      </div>

      {/* Footer hint */}
      <div className="py-3 px-4 text-center bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span>KedaiQu 2.0 • Solusi Cerdas Manajemen F&B Masa Kini</span>
      </div>
    </div>
  );
};
