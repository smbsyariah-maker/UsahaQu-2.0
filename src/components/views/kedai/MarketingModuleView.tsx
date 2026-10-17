import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Users, 
  MessageSquare, 
  Ticket, 
  Sparkles, 
  Send, 
  Award, 
  Phone, 
  Check, 
  X,
  ExternalLink
} from 'lucide-react';
import { 
  KedaiCustomer, 
  KedaiVoucher, 
  StoreProfile 
} from '../../../types/kedai';
import { PelangganService } from '../../../services/pelangganService';

interface MarketingModuleViewProps {
  initialSubMenu?: string;
  onBack: () => void;
  customers: KedaiCustomer[];
  onUpdateCustomers: (customers: KedaiCustomer[]) => void;
  vouchers: KedaiVoucher[];
  onUpdateVouchers: (vouchers: KedaiVoucher[]) => void;
  storeProfile: StoreProfile;
}

export const MarketingModuleView: React.FC<MarketingModuleViewProps> = ({
  initialSubMenu = 'database_pelanggan',
  onBack,
  customers,
  onUpdateCustomers,
  vouchers,
  onUpdateVouchers,
  storeProfile
}) => {
  const [activeTab, setActiveTab] = useState<'database_pelanggan' | 'broadcast_wa' | 'voucher_diskon'>(
    initialSubMenu as any || 'database_pelanggan'
  );

  const [searchQuery, setSearchQuery] = useState('');

  // Add Customer Modal
  const [isAddCustModalOpen, setIsAddCustModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custFavorite, setCustFavorite] = useState('Kopi Susu Aren Spesial');
  const [custNotes, setCustNotes] = useState('');

  // Broadcast state
  const [selectedTemplate, setSelectedTemplate] = useState('weekend');
  const [customBroadcastText, setCustomBroadcastText] = useState(
    `Halo {nama}! ☕️\nAda promo weekend spesial di ${storeProfile.name}! Dapatkan diskon 20% untuk semua menu kopi & camilan favoritmu hari ini. Tunjukkan pesan ini ke kasir ya!\n\nAlamat: ${storeProfile.address}`
  );
  const [selectedTargetCustomer, setSelectedTargetCustomer] = useState<string>('all');

  // Add Voucher Modal
  const [isAddVoucherModalOpen, setIsAddVoucherModalOpen] = useState(false);
  const [vCode, setVCode] = useState('');
  const [vTitle, setVTitle] = useState('');
  const [vType, setVType] = useState<'percent' | 'nominal'>('percent');
  const [vValue, setVValue] = useState<number>(15);
  const [vMinSpend, setVMinSpend] = useState<number>(50000);
  const [vQuota, setVQuota] = useState<number>(50);

  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim()) return;

    const newCust: KedaiCustomer = {
      id: `c-${Date.now()}`,
      name: custName.trim(),
      phone: custPhone.trim(),
      totalVisits: 1,
      totalSpend: 0,
      points: 20, // bonus welcome points
      tier: 'Silver',
      lastVisit: 'Hari Ini',
      favoriteMenu: custFavorite,
      notes: custNotes
    };

    onUpdateCustomers([newCust, ...customers]);
    setIsAddCustModalOpen(false);
    setCustName('');
    setCustPhone('');
  };

  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vCode.trim() || !vTitle.trim()) return;

    const newV: KedaiVoucher = {
      id: `v-${Date.now()}`,
      code: vCode.trim().toUpperCase(),
      title: vTitle.trim(),
      type: vType,
      value: Number(vValue),
      minSpend: Number(vMinSpend),
      validUntil: '31 Des 2026',
      quota: Number(vQuota),
      usedCount: 0,
      isActive: true
    };

    onUpdateVouchers([newV, ...vouchers]);
    setIsAddVoucherModalOpen(false);
    setVCode('');
    setVTitle('');
  };

  const handleToggleVoucher = (id: string) => {
    onUpdateVouchers(
      vouchers.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
    );
  };

  const handleSendBroadcast = (targetPhone: string, customerName: string) => {
    const formattedText = customBroadcastText
      .replace(/{nama}/g, customerName)
      .replace(/{nama_kedai}/g, storeProfile.name);

    const waLink = PelangganService.createWALink(targetPhone, formattedText);
    if (waLink) {
      window.open(waLink, '_blank');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-[#7C3AED] text-white px-4 pt-4 pb-4 sticky top-0 z-30 shadow-md">
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
                <Users className="w-4 h-4 text-purple-200" />
                <h1 className="text-lg font-bold tracking-tight">Marketing & Pelanggan</h1>
              </div>
              <p className="text-[11px] text-purple-100">CRM Member, Broadcast WA Promo & Voucher</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-purple-900/60 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('database_pelanggan')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'database_pelanggan' ? 'bg-white text-purple-900 shadow-xs' : 'text-purple-100 hover:text-white'
              }`}
            >
              Pelanggan
            </button>
            <button
              onClick={() => setActiveTab('broadcast_wa')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'broadcast_wa' ? 'bg-white text-purple-900 shadow-xs' : 'text-purple-100 hover:text-white'
              }`}
            >
              Broadcast WA
            </button>
            <button
              onClick={() => setActiveTab('voucher_diskon')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'voucher_diskon' ? 'bg-white text-purple-900 shadow-xs' : 'text-purple-100 hover:text-white'
              }`}
            >
              Voucher
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: DATABASE PELANGGAN & POIN */}
      {activeTab === 'database_pelanggan' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Action bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama member atau nomor WhatsApp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <button
              onClick={() => setIsAddCustModalOpen(true)}
              className="bg-[#7C3AED] hover:bg-purple-700 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Member Baru</span>
            </button>
          </div>

          {/* Customers list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-purple-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-black text-sm">
                      {cust.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{cust.name}</h4>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            cust.tier === 'Platinum'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : cust.tier === 'Gold'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {cust.tier}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {cust.phone}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Poin Reward</span>
                    <span className="text-sm font-black text-[#7C3AED]">{cust.points} Pts</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Total Kunjungan:</span>
                    <b className="text-slate-800">{cust.totalVisits} kali</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Belanja:</span>
                    <b className="text-slate-800">Rp {cust.totalSpend.toLocaleString('id-ID')}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Menu Favorit:</span>
                    <span className="text-purple-700 font-semibold">{cust.favoriteMenu}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Kunjungan Terakhir: {cust.lastVisit}</span>
                  <button
                    onClick={() => handleSendBroadcast(cust.phone, cust.name)}
                    className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat WA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: BROADCAST WA PROMO */}
      {activeTab === 'broadcast_wa' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                Generator Broadcast Promosi WhatsApp KedaiQu
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rancang pesan promosi otomatis dan kirimkan langsung ke nomor WhatsApp pelanggan loyal kedai.
              </p>
            </div>

            {/* Template selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Pilih Template Pesan:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'weekend',
                    title: 'Promo Weekend Santai',
                    body: `Halo {nama}! ☕️\nAda promo weekend spesial di ${storeProfile.name}! Dapatkan diskon 20% untuk semua menu kopi & camilan favoritmu hari ini. Tunjukkan pesan ini ke kasir ya!\n\nAlamat: ${storeProfile.address}`
                  },
                  {
                    id: 'gajian',
                    title: 'Diskon Gajian Seru',
                    body: `Hai Sahabat Kuliner {nama}! 🎉\nWaktunya traktir teman kantor & keluarga di ${storeProfile.name}! Nikmati cashback langsung Rp 15.000 dengan minimal transaksi Rp 50.000. Ditunggu kedatangannya ya!`
                  },
                  {
                    id: 'menu_baru',
                    title: 'Peluncuran Menu Baru',
                    body: `Kabar Gembira untuk {nama}! 🌟\n${storeProfile.name} baru saja meluncurkan menu baru yang super lezat! Dapatkan FREE Es Teh Jumbo setiap pembelian menu utama baru minggu ini. Yuk mampir!`
                  }
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(tpl.id);
                      setCustomBroadcastText(tpl.body);
                    }}
                    className={`text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedTemplate === tpl.id
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {tpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Isi Pesan WhatsApp</label>
              <textarea
                rows={5}
                value={customBroadcastText}
                onChange={(e) => setCustomBroadcastText(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-400 font-sans"
              />
              <p className="text-[10px] text-slate-400">
                Gunakan variabel <code>{'{nama}'}</code> untuk nama pelanggan dan <code>{'{nama_kedai}'}</code> untuk nama kedai.
              </p>
            </div>

            {/* Target & Dispatch */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Kirim ke:</span>
                <select
                  value={selectedTargetCustomer}
                  onChange={(e) => setSelectedTargetCustomer(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5"
                >
                  <option value="all">Semua Member ({customers.length} Orang)</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.phone}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (selectedTargetCustomer === 'all') {
                    // Send to first customer as preview demo
                    handleSendBroadcast(customers[0]?.phone || '081234567890', customers[0]?.name || 'Pelanggan');
                  } else {
                    const cust = customers.find((c) => c.phone === selectedTargetCustomer);
                    handleSendBroadcast(selectedTargetCustomer, cust?.name || 'Pelanggan');
                  }
                }}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-purple-600/20 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Buka & Kirim via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: VOUCHER & DISKON MEMBER */}
      {activeTab === 'voucher_diskon' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-purple-600" />
                Kupon & Voucher Diskon KedaiQu
              </h2>
              <p className="text-xs text-slate-500">
                Kode voucher yang dapat di-input kasir saat proses checkout transaksi di POS.
              </p>
            </div>

            <button
              onClick={() => setIsAddVoucherModalOpen(true)}
              className="bg-[#7C3AED] hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Voucher Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {vouchers.map((v) => (
              <div
                key={v.id}
                className={`bg-white rounded-2xl p-4 border shadow-xs transition-all flex flex-col justify-between ${
                  v.isActive ? 'border-purple-200 hover:border-purple-400' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black tracking-wider px-2.5 py-1 rounded-lg bg-purple-50 text-[#7C3AED] border border-purple-200 font-mono">
                      {v.code}
                    </span>
                    <button
                      onClick={() => handleToggleVoucher(v.id)}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        v.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {v.isActive ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900">{v.title}</h3>
                  <div className="mt-2 text-xs font-extrabold text-slate-900">
                    {v.type === 'percent' ? `Diskon ${v.value}%` : `Potongan Rp ${v.value.toLocaleString('id-ID')}`}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Min Belanja: Rp {v.minSpend.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-slate-400">Berlaku s/d: {v.validUntil}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Terpakai: <b>{v.usedCount}</b>/{v.quota}</span>
                  <span className="text-[#7C3AED] font-bold">Siap Pakai di Kasir</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL ADD MEMBER */}
      {isAddCustModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCustomer}
            className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-base font-bold text-slate-900">Tambah Pelanggan Baru</h3>
              <button
                type="button"
                onClick={() => setIsAddCustModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rian Sanjaya"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Menu Favorit</label>
                <input
                  type="text"
                  value={custFavorite}
                  onChange={(e) => setCustFavorite(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Catatan Pelanggan</label>
                <input
                  type="text"
                  placeholder="Tempat duduk favorit, preferensi gula..."
                  value={custNotes}
                  onChange={(e) => setCustNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#7C3AED] hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all"
            >
              Simpan Data Member
            </button>
          </form>
        </div>
      )}

      {/* MODAL ADD VOUCHER */}
      {isAddVoucherModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveVoucher}
            className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-base font-bold text-slate-900">Buat Kupon Diskon Baru</h3>
              <button
                type="button"
                onClick={() => setIsAddVoucherModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block">Kode Kupon *</label>
                <input
                  type="text"
                  required
                  placeholder="KEDAIHEMAT"
                  value={vCode}
                  onChange={(e) => setVCode(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Judul Voucher *</label>
                <input
                  type="text"
                  required
                  placeholder="Potongan Belanja 15%"
                  value={vTitle}
                  onChange={(e) => setVTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Tipe Diskon</label>
                  <select
                    value={vType}
                    onChange={(e) => setVType(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="percent">Persentase (%)</option>
                    <option value="nominal">Nominal Tunai (Rp)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Besar Diskon</label>
                  <input
                    type="number"
                    required
                    value={vValue}
                    onChange={(e) => setVValue(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Min. Belanja (Rp)</label>
                  <input
                    type="number"
                    value={vMinSpend}
                    onChange={(e) => setVMinSpend(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Kuota Klaim</label>
                  <input
                    type="number"
                    value={vQuota}
                    onChange={(e) => setVQuota(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#7C3AED] hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all"
            >
              Aktifkan Voucher
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
