import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Download, 
  Printer, 
  Calendar, 
  Sparkles,
  Award,
  Layers,
  Flame
} from 'lucide-react';
import { 
  OrderTicket, 
  MenuItem, 
  StoreProfile 
} from '../../../types/kedai';

interface LaporanModuleViewProps {
  initialSubMenu?: string;
  onBack: () => void;
  orders: OrderTicket[];
  menuItems: MenuItem[];
  storeProfile: StoreProfile;
}

export const LaporanModuleView: React.FC<LaporanModuleViewProps> = ({
  initialSubMenu = 'lap_omzet',
  onBack,
  orders,
  menuItems,
  storeProfile
}) => {
  const [activeTab, setActiveTab] = useState<'lap_omzet' | 'top_selling'>(
    initialSubMenu as any || 'lap_omzet'
  );

  // Financial calculations
  const totalOmzet = orders.reduce((sum, o) => sum + o.total, 0);
  const totalSubtotal = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDiscount = orders.reduce((sum, o) => sum + o.discount, 0);

  // Estimated HPP: approximately 38% of subtotal based on menu recipe averages
  const estimatedHpp = Math.round(totalSubtotal * 0.38);
  const estimatedGrossProfit = totalOmzet - estimatedHpp;
  const estimatedOperationalCost = 350000; // Kas kecil, gas & listrik estimasi
  const netProfit = Math.max(0, estimatedGrossProfit - estimatedOperationalCost);

  // Payment Breakdown
  const cashTotal = orders.filter((o) => o.paymentMethod === 'Tunai').reduce((s, o) => s + o.total, 0);
  const qrisTotal = orders.filter((o) => o.paymentMethod === 'QRIS').reduce((s, o) => s + o.total, 0);
  const transferTotal = orders.filter((o) => o.paymentMethod === 'Transfer Bank').reduce((s, o) => s + o.total, 0);
  const debitTotal = orders.filter((o) => o.paymentMethod === 'Kartu Debit').reduce((s, o) => s + o.total, 0);

  // Top Selling Items analysis
  const itemSalesMap: { [name: string]: { qty: number; revenue: number; category: string } } = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!itemSalesMap[item.menuName]) {
        itemSalesMap[item.menuName] = { qty: 0, revenue: 0, category: item.category };
      }
      itemSalesMap[item.menuName].qty += item.qty;
      itemSalesMap[item.menuName].revenue += item.subtotal;
    });
  });

  const sortedSales = Object.entries(itemSalesMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.qty - a.qty);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-[#DC2626] text-white px-4 pt-4 pb-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-9 h-9 rounded-full bg-white/20 active:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-rose-200" />
                <h1 className="text-lg font-bold tracking-tight">Laporan KedaiQu</h1>
              </div>
              <p className="text-[11px] text-rose-100">Omzet, Laba Rugi & Analisis Menu Terlaris</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-rose-900/60 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('lap_omzet')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'lap_omzet' ? 'bg-white text-rose-900 shadow-xs' : 'text-rose-100 hover:text-white'
              }`}
            >
              Omzet & Laba
            </button>
            <button
              onClick={() => setActiveTab('top_selling')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'top_selling' ? 'bg-white text-rose-900 shadow-xs' : 'text-rose-100 hover:text-white'
              }`}
            >
              Menu Terlaris
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: LAPORAN OMZET & LABA RUGI */}
      {activeTab === 'lap_omzet' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Main Profit Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-500">Ringkasan Finansial Harian</span>
                <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                  Rp {totalOmzet.toLocaleString('id-ID')}
                </h2>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Total dari {orders.length} transaksi selesai
                </span>
              </div>

              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak Laporan
              </button>
            </div>

            {/* Income & Expense Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100">
                <span className="text-[10px] text-blue-700 font-bold block">Omzet Kotor</span>
                <span className="text-base font-black text-blue-900">
                  Rp {totalOmzet.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100">
                <span className="text-[10px] text-amber-700 font-bold block">HPP Bahan Baku</span>
                <span className="text-base font-black text-amber-900">
                  -Rp {estimatedHpp.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-100">
                <span className="text-[10px] text-rose-700 font-bold block">Biaya Operasional</span>
                <span className="text-base font-black text-rose-900">
                  -Rp {estimatedOperationalCost.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 font-bold block">Laba Bersih Riil</span>
                <span className="text-base font-black text-emerald-900">
                  Rp {netProfit.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-rose-600" />
              Rincian Arus Kas Berdasarkan Metode Pembayaran
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Tunai (Cash di Laci)</span>
                <span className="text-sm font-black text-slate-900">
                  Rp {cashTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">QRIS Dinamis</span>
                <span className="text-sm font-black text-slate-900">
                  Rp {qrisTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Transfer Bank</span>
                <span className="text-sm font-black text-slate-900">
                  Rp {transferTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Kartu Debit / EDC</span>
                <span className="text-sm font-black text-slate-900">
                  Rp {debitTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: ANALISIS MENU TERLARIS */}
      {activeTab === 'top_selling' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-rose-600" />
              Peringkat & Analisis Menu Paling Diminati (Matrix BCG)
            </h2>
            <p className="text-xs text-slate-500">
              Ketahui produk mana yang menjadi bintang penjualan (Star) dan menyumbang laba terbesar bagi kedai.
            </p>
          </div>

          <div className="space-y-2.5">
            {sortedSales.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Belum ada transaksi terekam hari ini.
              </div>
            ) : (
              sortedSales.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-slate-900 shadow-sm'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-700'
                          : idx === 2
                          ? 'bg-amber-700/20 text-amber-900'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      #{idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                        {idx === 0 && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5" /> Bintang Kedai
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        Terjual: <b className="text-slate-800">{item.qty} Porsi</b>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total Omzet</span>
                    <span className="text-xs font-black text-slate-900">
                      Rp {item.revenue.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
