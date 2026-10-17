import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Truck, 
  ClipboardList, 
  Trash2, 
  Edit3, 
  X,
  History
} from 'lucide-react';
import { 
  RawIngredient, 
  InboundStockRecord, 
  StockOpnameRecord 
} from '../../../types/kedai';

interface StokModuleViewProps {
  initialSubMenu?: string;
  onBack: () => void;
  rawIngredients: RawIngredient[];
  onUpdateRawIngredients: (items: RawIngredient[]) => void;
  inboundRecords: InboundStockRecord[];
  onAddInboundRecord: (record: InboundStockRecord) => void;
  opnameRecords: StockOpnameRecord[];
  onAddOpnameRecord: (record: StockOpnameRecord) => void;
}

export const StokModuleView: React.FC<StokModuleViewProps> = ({
  initialSubMenu = 'data_bahan',
  onBack,
  rawIngredients,
  onUpdateRawIngredients,
  inboundRecords,
  onAddInboundRecord,
  opnameRecords,
  onAddOpnameRecord
}) => {
  const [activeTab, setActiveTab] = useState<'data_bahan' | 'stok_inbound' | 'stok_opname'>(
    initialSubMenu as any || 'data_bahan'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Modal State for New Raw Material
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [matName, setMatName] = useState('');
  const [matCode, setMatCode] = useState('');
  const [matCategory, setMatCategory] = useState<RawIngredient['category']>('Kopi & Susu');
  const [matStock, setMatStock] = useState<number>(100);
  const [matMinStock, setMatMinStock] = useState<number>(20);
  const [matUnit, setMatUnit] = useState('gram');
  const [matPrice, setMatPrice] = useState<number>(200);
  const [matSupplier, setMatSupplier] = useState('');

  // Inbound Form State
  const [inbIngredientId, setInbIngredientId] = useState('');
  const [inbQty, setInbQty] = useState<number>(10);
  const [inbBuyPrice, setInbBuyPrice] = useState<number>(0);
  const [inbSupplier, setInbSupplier] = useState('');
  const [inbInvoice, setInbInvoice] = useState('');
  const [inbNotes, setInbNotes] = useState('');

  // Opname Form State
  const [opIngredientId, setOpIngredientId] = useState('');
  const [opPhysicalStock, setOpPhysicalStock] = useState<number>(0);
  const [opReason, setOpReason] = useState('Pengecekan rutin stok fisik');

  const categories = ['Semua', 'Kopi & Susu', 'Bahan Makanan', 'Bumbu & Saus', 'Kemasan & Packaging', 'Gas & Operasional'];

  const filteredMaterials = rawIngredients.filter((item) => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const criticalStockItems = rawIngredients.filter((r) => r.stock <= r.minStock);

  // Handle Save New Material
  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matName.trim()) return;
    const newItem: RawIngredient = {
      id: `ing-${Date.now()}`,
      code: matCode.trim() || `BAH-${(rawIngredients.length + 1).toString().padStart(3, '0')}`,
      name: matName.trim(),
      category: matCategory,
      stock: Number(matStock),
      minStock: Number(matMinStock),
      unit: matUnit,
      avgBuyPrice: Number(matPrice),
      supplierName: matSupplier.trim() || 'Pemasok Lokal',
      lastRestockDate: 'Hari Ini'
    };
    onUpdateRawIngredients([newItem, ...rawIngredients]);
    setIsAddMaterialModalOpen(false);
    setMatName('');
  };

  // Handle Inbound Entry
  const handleSaveInbound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inbIngredientId || inbQty <= 0) return;
    const target = rawIngredients.find((r) => r.id === inbIngredientId);
    if (!target) return;

    const unitPrice = inbBuyPrice > 0 ? inbBuyPrice : target.avgBuyPrice;
    const totalCost = unitPrice * inbQty;

    const now = new Date();
    const newRecord: InboundStockRecord = {
      id: `inb-${Date.now()}`,
      invoiceNumber: inbInvoice.trim() || `INB-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Date.now().toString().slice(-4)}`,
      date: `${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      timestamp: Date.now(),
      supplier: inbSupplier.trim() || target.supplierName,
      ingredientName: target.name,
      category: target.category,
      qty: inbQty,
      unit: target.unit,
      buyPrice: unitPrice,
      totalCost: totalCost,
      receiver: 'Admin Gudang KedaiQu',
      notes: inbNotes
    };

    onAddInboundRecord(newRecord);

    // Update raw inventory stock
    onUpdateRawIngredients(
      rawIngredients.map((r) =>
        r.id === target.id
          ? {
              ...r,
              stock: r.stock + inbQty,
              avgBuyPrice: inbBuyPrice > 0 ? inbBuyPrice : r.avgBuyPrice,
              lastRestockDate: 'Hari Ini'
            }
          : r
      )
    );

    alert(`Sukses menambahkan stok ${inbQty} ${target.unit} untuk ${target.name}!`);
    setInbIngredientId('');
    setInbQty(10);
    setInbBuyPrice(0);
    setInbNotes('');
  };

  // Handle Opname Audit Submit
  const handleSaveOpname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opIngredientId) return;
    const target = rawIngredients.find((r) => r.id === opIngredientId);
    if (!target) return;

    const diff = opPhysicalStock - target.stock;
    const now = new Date();
    const newRecord: StockOpnameRecord = {
      id: `op-${Date.now()}`,
      date: `${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      timestamp: Date.now(),
      ingredientId: target.id,
      ingredientName: target.name,
      systemStock: target.stock,
      physicalStock: opPhysicalStock,
      difference: diff,
      unit: target.unit,
      reason: opReason.trim() || 'Penyesuaian stok opname',
      checkedBy: 'Supervisor Kedai'
    };

    onAddOpnameRecord(newRecord);

    // Sync inventory stock to actual physical count
    onUpdateRawIngredients(
      rawIngredients.map((r) =>
        r.id === target.id
          ? {
              ...r,
              stock: opPhysicalStock
            }
          : r
      )
    );

    alert(`Opname berhasil dicatat. Stok ${target.name} kini disesuaikan menjadi ${opPhysicalStock} ${target.unit}.`);
    setOpIngredientId('');
    setOpPhysicalStock(0);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-[#059669] text-white px-4 pt-4 pb-4 sticky top-0 z-30 shadow-md">
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
                <Package className="w-4 h-4 text-emerald-200" />
                <h1 className="text-lg font-bold tracking-tight">Stok & Bahan Baku</h1>
              </div>
              <p className="text-[11px] text-emerald-100">Inventaris Bahan, Entry Belanja & Opname</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-emerald-800/60 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('data_bahan')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'data_bahan' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100 hover:text-white'
              }`}
            >
              Data Bahan
            </button>
            <button
              onClick={() => setActiveTab('stok_inbound')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'stok_inbound' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100 hover:text-white'
              }`}
            >
              Entry Belanja
            </button>
            <button
              onClick={() => setActiveTab('stok_opname')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                activeTab === 'stok_opname' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100 hover:text-white'
              }`}
            >
              <span>Opname</span>
              {criticalStockItems.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center">
                  {criticalStockItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: DATA BAHAN BAKU */}
      {activeTab === 'data_bahan' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Top Actions */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama bahan, kode bahan atau supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <button
              onClick={() => setIsAddMaterialModalOpen(true)}
              className="bg-[#059669] hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Bahan Baku Baru</span>
            </button>
          </div>

          {/* Critical Warning if any */}
          {criticalStockItems.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs text-amber-900 font-bold">
                  Ada {criticalStockItems.length} bahan baku mencapai batas stok minimum! Segera lakukan belanja / restock.
                </span>
              </div>
              <button
                onClick={() => setActiveTab('stok_inbound')}
                className="text-[11px] font-bold text-emerald-800 underline hover:text-emerald-900"
              >
                Belanja Sekarang &rarr;
              </button>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c
                    ? 'bg-[#059669] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMaterials.map((mat) => {
              const isLow = mat.stock <= mat.minStock;

              return (
                <div
                  key={mat.id}
                  className={`bg-white rounded-2xl p-4 border shadow-xs transition-all flex flex-col justify-between ${
                    isLow ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {mat.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isLow ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isLow ? 'Stok Menipis' : 'Stok Aman'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{mat.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{mat.category} • Supplier: {mat.supplierName}</p>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 block">Sisa Stok Fisik</span>
                        <span className={`text-base font-black ${isLow ? 'text-amber-700' : 'text-slate-900'}`}>
                          {mat.stock} <span className="text-xs font-semibold">{mat.unit}</span>
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 block">Batas Minimum</span>
                        <span className="text-base font-bold text-slate-600">
                          {mat.minStock} <span className="text-xs">{mat.unit}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Beli: <b>Rp {mat.avgBuyPrice.toLocaleString('id-ID')}</b>/{mat.unit}
                    </span>
                    <button
                      onClick={() => {
                        setInbIngredientId(mat.id);
                        setActiveTab('stok_inbound');
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                    >
                      + Restock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: STOK INBOUND (ENTRY BELANJA PASAR / SUPPLIER) */}
      {activeTab === 'stok_inbound' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Entry Form Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                Catat Pembelian Stok Masuk (Belanja Pasar / Supplier)
              </h2>
              <p className="text-xs text-slate-500">
                Pencatatan ini akan langsung menambah jumlah stok bahan baku di gudang kedai secara otomatis.
              </p>
            </div>

            <form onSubmit={handleSaveInbound} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Pilih Bahan Baku *</label>
                  <select
                    required
                    value={inbIngredientId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setInbIngredientId(id);
                      const target = rawIngredients.find((r) => r.id === id);
                      if (target) {
                        setInbBuyPrice(target.avgBuyPrice);
                        setInbSupplier(target.supplierName);
                      }
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden"
                  >
                    <option value="">-- Pilih Bahan Baku --</option>
                    {rawIngredients.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} (Stok: {r.stock} {r.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block">Jumlah Beli *</label>
                    <input
                      type="number"
                      required
                      placeholder="Misal: 10"
                      value={inbQty}
                      onChange={(e) => setInbQty(Number(e.target.value))}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block">Harga Satuan (Rp)</label>
                    <input
                      type="number"
                      placeholder="Harga per unit"
                      value={inbBuyPrice || ''}
                      onChange={(e) => setInbBuyPrice(Number(e.target.value))}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Supplier / Toko Belanja</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pasar Induk Kramat Jati / Agen Kopi"
                    value={inbSupplier}
                    onChange={(e) => setInbSupplier(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block">No Nota / Faktur (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: NOTA-1082"
                    value={inbInvoice}
                    onChange={(e) => setInbInvoice(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Catatan Tambahan</label>
                <input
                  type="text"
                  placeholder="Kondisi barang, tanggal kadaluarsa, atau titipan belanja..."
                  value={inbNotes}
                  onChange={(e) => setInbNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Estimasi Total Belanja</span>
                  <span className="text-sm font-black text-emerald-800">
                    Rp {(inbQty * (inbBuyPrice || 0)).toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  type="submit"
                  className="bg-[#059669] hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
                >
                  Simpan & Tambah ke Stok Gudang
                </button>
              </div>
            </form>
          </div>

          {/* Inbound History */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Riwayat Pembelian & Belanja Terakhir
            </h3>

            <div className="space-y-2">
              {inboundRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{rec.ingredientName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                        +{rec.qty} {rec.unit}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {rec.date} • Supplier: {rec.supplier} • Penerima: {rec.receiver}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900">
                      Rp {rec.totalCost.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{rec.invoiceNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: STOK OPNAME & ALERT */}
      {activeTab === 'stok_opname' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Opname Audit Form */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-600" />
                Audit Stok Opname Fisik (Cek Selisih)
              </h2>
              <p className="text-xs text-slate-500">
                Lakukan perhitungan berkala untuk memastikan sisa bahan di dapur sesuai dengan sistem kasir.
              </p>
            </div>

            <form onSubmit={handleSaveOpname} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Pilih Bahan Baku Diperiksa *</label>
                  <select
                    required
                    value={opIngredientId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setOpIngredientId(id);
                      const target = rawIngredients.find((r) => r.id === id);
                      if (target) {
                        setOpPhysicalStock(target.stock);
                      }
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden"
                  >
                    <option value="">-- Pilih Bahan Baku --</option>
                    {rawIngredients.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} (Stok Sistem: {r.stock} {r.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block">Hasil Hitungan Fisik Nyata *</label>
                  <input
                    type="number"
                    required
                    value={opPhysicalStock}
                    onChange={(e) => setOpPhysicalStock(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Alasan / Penjelasan Selisih</label>
                <input
                  type="text"
                  placeholder="Misal: Tumpah saat proses, rusak kadaluarsa, salah takaran..."
                  value={opReason}
                  onChange={(e) => setOpReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  {opIngredientId && (
                    <span className="text-xs font-bold">
                      Selisih:{' '}
                      <span className={opPhysicalStock - (rawIngredients.find(r => r.id === opIngredientId)?.stock || 0) < 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {opPhysicalStock - (rawIngredients.find(r => r.id === opIngredientId)?.stock || 0)} {rawIngredients.find(r => r.id === opIngredientId)?.unit}
                      </span>
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-[#059669] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs"
                >
                  Rekam & Sesuaikan Stok Sistem
                </button>
              </div>
            </form>
          </div>

          {/* Opname Log History */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700">Riwayat Audit Opname Terakhir</h3>
            <div className="space-y-2">
              {opnameRecords.map((op) => (
                <div
                  key={op.id}
                  className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{op.ingredientName}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {op.date} • Petugas: {op.checkedBy} • Alasan: {op.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black block">
                      Fisik: {op.physicalStock} {op.unit} (Sistem: {op.systemStock})
                    </span>
                    <span className={`text-[10px] font-bold ${op.difference < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      Selisih: {op.difference > 0 ? `+${op.difference}` : op.difference} {op.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH BAHAN BARU */}
      {isAddMaterialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveMaterial}
            className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-base font-bold text-slate-900">Tambah Bahan Baku Baru</h3>
              <button
                type="button"
                onClick={() => setIsAddMaterialModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block">Nama Bahan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Susu Oat Barista / Biji Kopi Robusta"
                  value={matName}
                  onChange={(e) => setMatName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Kode Bahan</label>
                  <input
                    type="text"
                    placeholder="BAH-011"
                    value={matCode}
                    onChange={(e) => setMatCode(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Kategori</label>
                  <select
                    value={matCategory}
                    onChange={(e) => setMatCategory(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Kopi & Susu">Kopi & Susu</option>
                    <option value="Bahan Makanan">Bahan Makanan</option>
                    <option value="Bumbu & Saus">Bumbu & Saus</option>
                    <option value="Kemasan & Packaging">Kemasan & Packaging</option>
                    <option value="Gas & Operasional">Gas & Operasional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Stok Awal</label>
                  <input
                    type="number"
                    value={matStock}
                    onChange={(e) => setMatStock(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Batas Min</label>
                  <input
                    type="number"
                    value={matMinStock}
                    onChange={(e) => setMatMinStock(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Satuan Unit</label>
                  <input
                    type="text"
                    placeholder="gram / ml / pcs"
                    value={matUnit}
                    onChange={(e) => setMatUnit(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Harga Beli Satuan (Rp)</label>
                  <input
                    type="number"
                    value={matPrice}
                    onChange={(e) => setMatPrice(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Nama Supplier</label>
                  <input
                    type="text"
                    placeholder="Nama Distributor / Agen"
                    value={matSupplier}
                    onChange={(e) => setMatSupplier(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#059669] hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              Simpan Bahan Baku
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
