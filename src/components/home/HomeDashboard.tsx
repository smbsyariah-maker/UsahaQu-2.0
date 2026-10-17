import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ChefHat, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  AlertTriangle, 
  Sparkles,
  UtensilsCrossed,
  Coffee,
  CheckCircle2,
  ChevronDown,
  Store,
  Wrench,
  ShoppingCart,
  X
} from 'lucide-react';
import { KedaiQuNavModule } from '../../config/kedaiQuNav';
import { OrderTicket, StoreProfile, RawIngredient } from '../../types/kedai';
import { IconRenderer } from '../common/IconRenderer';
import { AppTemplateSwitcher } from '../../config/appTemplateSwitch';

interface HomeDashboardProps {
  modules: KedaiQuNavModule[];
  onSelectModule: (module: KedaiQuNavModule) => void;
  orders: OrderTicket[];
  onOpenPos: () => void;
  onOpenKitchen: () => void;
  storeProfile: StoreProfile;
  rawIngredients: RawIngredient[];
  activeTemplateId?: string;
  activeTemplateName?: string;
  onSwitchTemplate?: (templateKey: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  modules,
  onSelectModule,
  orders,
  onOpenPos,
  onOpenKitchen,
  storeProfile,
  rawIngredients,
  activeTemplateId = 'kedaiqu',
  activeTemplateName = 'KedaiQu',
  onSwitchTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Metrics
  const activeKitchenOrders = orders.filter((o) => o.kitchenStatus !== 'selesai');
  const todayOmzet = orders.reduce((sum, o) => sum + o.total, 0);
  const totalPortionsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);
  const lowStockCount = rawIngredients.filter((r) => r.stock <= r.minStock).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenPos();
    }
  };

  return (
    <div className="flex-1 bg-slate-50 pb-8 min-h-screen">
      {/* 1. TOP HEADER: Clean Royal Blue with Kedai Greeting */}
      <div className="bg-[#2563EB] text-white px-5 pt-5 pb-8 relative overflow-hidden rounded-b-[28px] shadow-md">
        {/* Subtle decorative background watermarks */}
        <div className="absolute -right-6 -bottom-8 opacity-15 pointer-events-none transform rotate-12">
          <UtensilsCrossed className="w-44 h-44 text-white" />
        </div>
        <div className="absolute -left-10 -top-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 font-black text-lg flex items-center justify-center shadow-md ring-2 ring-blue-300/40">
                KQ
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-blue-600 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black tracking-widest text-blue-200 uppercase">
                  KEDAIQU 2.0 • F&amp;B POS
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
                {storeProfile.name}
              </h2>
              <p className="text-[11px] text-blue-100 font-medium truncate max-w-[240px]">
                {storeProfile.tagline}
              </p>
            </div>
          </div>

          {/* Business Switcher Badge Button */}
          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all active:scale-95 shadow-xs shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{activeTemplateName}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>

        {/* Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-4 relative z-10">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-blue-600 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu, kopi, mie nyemek atau nomor meja..."
              className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs font-medium rounded-xl pl-9 pr-24 py-2.5 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-blue-300 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              Cari Menu
            </button>
          </div>
        </form>
      </div>

      {/* 2. SUMMARY WORKSHOP CARD (Floating overlap) */}
      <div className="px-4 -mt-5 relative z-20">
        <div className="bg-white rounded-2xl p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                Omzet Hari Ini (Kas &amp; QRIS)
              </span>
              <div className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Rp {todayOmzet.toLocaleString('id-ID')}
              </div>
            </div>

            <button
              onClick={onOpenPos}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Order Baru</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 text-center">
            <div 
              onClick={onOpenKitchen}
              className="bg-amber-50/70 hover:bg-amber-100/70 cursor-pointer rounded-xl p-2 border border-amber-100 transition-colors"
            >
              <span className="text-[10px] font-semibold text-amber-700 block">Antrian Dapur</span>
              <span className="text-sm font-extrabold text-amber-800">
                {activeKitchenOrders.length} Pesanan
              </span>
            </div>

            <div className="bg-blue-50/70 rounded-xl p-2 border border-blue-100">
              <span className="text-[10px] font-semibold text-blue-700 block">Porsi Terjual</span>
              <span className="text-sm font-extrabold text-blue-800">
                {totalPortionsSold} Porsi
              </span>
            </div>

            <div className={`rounded-xl p-2 border transition-colors ${
              lowStockCount > 0 ? 'bg-rose-50/80 border-rose-200' : 'bg-emerald-50/70 border-emerald-100'
            }`}>
              <span className={`text-[10px] font-semibold block ${lowStockCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                Stok Menipis
              </span>
              <span className={`text-sm font-extrabold ${lowStockCount > 0 ? 'text-rose-800' : 'text-emerald-800'}`}>
                {lowStockCount} Bahan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MENU UTAMA KEDAIQU (7 Modul Navigasi Dinamis KEDAIQU_NAV) */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Menu Utama KedaiQu
            </h3>
            <p className="text-[11px] text-slate-500">Pilih modul operasional untuk membuka sub-fitur</p>
          </div>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            {modules.length} Modul
          </span>
        </div>

        {/* Dynamic Grid for KEDAIQU_NAV */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod)}
              className="bg-white rounded-2xl p-3.5 shadow-xs hover:shadow-md border border-slate-100 hover:border-slate-300 transition-all duration-200 group active:scale-95 flex flex-col items-center justify-center text-center cursor-pointer"
            >
              {/* Dynamic Color Themed Square Icon */}
              <div 
                style={{ backgroundColor: mod.color }}
                className="w-13 h-13 rounded-2xl text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform mb-2"
              >
                <IconRenderer name={mod.icon} className="w-6 h-6 text-white stroke-[2.2]" />
              </div>

              {/* Title & Submenu Count */}
              <span className="font-bold text-slate-800 text-xs tracking-tight group-hover:text-slate-900 transition-colors leading-tight">
                {mod.title}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {mod.sub_menus.length} Sub Menu
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. LIVE ANTRIAN DAPUR PREVIEW */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Antrian Live Dapur / Bar
            </h3>
          </div>
          <button
            onClick={onOpenKitchen}
            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
          >
            Buka KDS Live <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {activeKitchenOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 text-slate-400">
              <ChefHat className="w-8 h-8 mx-auto mb-1 stroke-1 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">Semua pesanan selesai dimasak!</p>
              <p className="text-[11px]">Dapur dan bar sedang santai.</p>
            </div>
          ) : (
            activeKitchenOrders.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={onOpenKitchen}
                className="bg-white rounded-xl p-3 shadow-xs border border-slate-100 hover:border-blue-200 cursor-pointer transition-all hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-600 text-white">
                      {item.orderNumber}
                    </span>
                    <span className="font-bold text-xs text-slate-800">{item.tableNumber}</span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                      ({item.customerName})
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      item.kitchenStatus === 'proses'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : item.kitchenStatus === 'siap_saji'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {item.kitchenStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-2 text-[11px] text-slate-600 line-clamp-1">
                  Pesanan: <span className="font-medium text-slate-800">
                    {item.items.map((i) => `${i.qty}x ${i.menuName}`).join(', ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Switcher Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-800 text-base">Ganti Varian Usaha (Template)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Pilih template varian usaha yang sesuai dengan tipe operasional bisnis Anda:
            </p>

            <div className="mt-4 space-y-2.5">
              {AppTemplateSwitcher.availableTemplates.map((t) => {
                const isSelected = t.id === activeTemplateId;
                const iconMap: { [k: string]: any } = {
                  kedaiqu: UtensilsCrossed,
                  bengkelqu: Wrench,
                  sembakoqu: ShoppingCart
                };
                const IconComponent = iconMap[t.id] || Store;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (onSwitchTemplate) {
                        onSwitchTemplate(t.id);
                      } else {
                        AppTemplateSwitcher.switchTemplate(t.id);
                      }
                      setIsTemplateModalOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-800">{t.name}</span>
                          {isSelected && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-800 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Semua data tersimpan aman di Safety Hub &amp; LocalStorage saat beralih template!
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
