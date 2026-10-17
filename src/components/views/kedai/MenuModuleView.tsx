import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Coffee, 
  Calculator, 
  Percent, 
  Check, 
  X,
  TrendingUp,
  DollarSign,
  UtensilsCrossed
} from 'lucide-react';
import { 
  MenuItem, 
  MenuVariantGroup, 
  RawIngredient, 
  RecipeIngredientItem 
} from '../../../types/kedai';
import { ResepEngine } from '../../../services/resepEngine';

interface MenuModuleViewProps {
  initialSubMenu?: string;
  onBack: () => void;
  menuItems: MenuItem[];
  onUpdateMenuItems: (items: MenuItem[]) => void;
  rawIngredients: RawIngredient[];
}

export const MenuModuleView: React.FC<MenuModuleViewProps> = ({
  initialSubMenu = 'katalog_menu',
  onBack,
  menuItems,
  onUpdateMenuItems,
  rawIngredients
}) => {
  const [activeTab, setActiveTab] = useState<'katalog_menu' | 'varian_porsi' | 'resep_hpp'>(
    initialSubMenu as any || 'katalog_menu'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Modal State for Add / Edit Menu Item
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState<MenuItem['category']>('Kopi & Minuman');
  const [formPrice, setFormPrice] = useState<number>(18000);
  const [formHpp, setFormHpp] = useState<number>(6500);
  const [formDescription, setFormDescription] = useState('');
  const [formBadge, setFormBadge] = useState('');

  // Selected item for HPP & Recipe Inspection
  const [selectedHppItem, setSelectedHppItem] = useState<MenuItem>(menuItems[0]);
  const [isRecipeEditorOpen, setIsRecipeEditorOpen] = useState(false);
  const [newIngredientId, setNewIngredientId] = useState('');
  const [newIngredientAmount, setNewIngredientAmount] = useState<number>(10);

  const categories = ['Semua', 'Kopi & Minuman', 'Makanan Utama', 'Camilan & Snack', 'Paket Hemat'];

  const filteredItems = menuItems.filter((item) => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleToggleAvailability = (id: string) => {
    onUpdateMenuItems(
      menuItems.map((m) => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
    );
  };

  const handleOpenAddMenu = () => {
    setEditingMenuItem(null);
    setFormName('');
    setFormCode(`MNU-${(menuItems.length + 1).toString().padStart(2, '0')}`);
    setFormCategory('Kopi & Minuman');
    setFormPrice(20000);
    setFormHpp(7000);
    setFormDescription('');
    setFormBadge('');
    setIsMenuModalOpen(true);
  };

  const handleOpenEditMenu = (item: MenuItem) => {
    setEditingMenuItem(item);
    setFormName(item.name);
    setFormCode(item.code);
    setFormCategory(item.category);
    setFormPrice(item.price);
    setFormHpp(item.hppCost);
    setFormDescription(item.description);
    setFormBadge(item.badge || '');
    setIsMenuModalOpen(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingMenuItem) {
      onUpdateMenuItems(
        menuItems.map((m) =>
          m.id === editingMenuItem.id
            ? {
                ...m,
                name: formName,
                code: formCode,
                category: formCategory,
                price: Number(formPrice),
                hppCost: Number(formHpp),
                description: formDescription,
                badge: formBadge.trim() ? formBadge.trim() : undefined
              }
            : m
        )
      );
    } else {
      const newItem: MenuItem = {
        id: `m-${Date.now()}`,
        name: formName,
        code: formCode,
        category: formCategory,
        price: Number(formPrice),
        hppCost: Number(formHpp),
        description: formDescription,
        badge: formBadge.trim() ? formBadge.trim() : undefined,
        isAvailable: true,
        soldCountToday: 0
      };
      onUpdateMenuItems([newItem, ...menuItems]);
    }
    setIsMenuModalOpen(false);
  };

  const handleDeleteMenu = (id: string) => {
    if (confirm('Yakin ingin menghapus menu ini dari daftar katalog?')) {
      onUpdateMenuItems(menuItems.filter((m) => m.id !== id));
    }
  };

  // Recipe Ingredient Addition
  const handleAddIngredientToRecipe = () => {
    if (!newIngredientId || newIngredientAmount <= 0) return;
    const raw = rawIngredients.find((r) => r.id === newIngredientId);
    if (!raw) return;

    const subtotal = Math.round(raw.avgBuyPrice * newIngredientAmount);
    const newIngItem: RecipeIngredientItem = {
      ingredientId: raw.id,
      ingredientName: raw.name,
      amountNeeded: newIngredientAmount,
      unit: raw.unit,
      costPerUnit: raw.avgBuyPrice,
      subtotalCost: subtotal
    };

    const currentRecipes = selectedHppItem.recipeIngredients || [];
    const updatedRecipes = [...currentRecipes, newIngItem];
    const newTotalHpp = updatedRecipes.reduce((sum, r) => sum + r.subtotalCost, 0);

    const updatedItem = {
      ...selectedHppItem,
      recipeIngredients: updatedRecipes,
      hppCost: newTotalHpp
    };

    setSelectedHppItem(updatedItem);
    onUpdateMenuItems(menuItems.map((m) => (m.id === updatedItem.id ? updatedItem : m)));
    ResepEngine.saveRecipe(
      updatedItem.name,
      updatedRecipes.map((r) => ({
        bahan_id: r.ingredientId,
        bahan_name: r.ingredientName,
        qty_used: r.amountNeeded,
        unit: r.unit
      })),
      { menu_id: updatedItem.id, menu_code: updatedItem.code }
    );
    setNewIngredientId('');
    setNewIngredientAmount(10);
  };

  const handleRemoveIngredientFromRecipe = (idx: number) => {
    const currentRecipes = selectedHppItem.recipeIngredients || [];
    const updatedRecipes = currentRecipes.filter((_, i) => i !== idx);
    const newTotalHpp = updatedRecipes.reduce((sum, r) => sum + r.subtotalCost, 0);

    const updatedItem = {
      ...selectedHppItem,
      recipeIngredients: updatedRecipes,
      hppCost: newTotalHpp
    };

    setSelectedHppItem(updatedItem);
    onUpdateMenuItems(menuItems.map((m) => (m.id === updatedItem.id ? updatedItem : m)));
    ResepEngine.saveRecipe(
      updatedItem.name,
      updatedRecipes.map((r) => ({
        bahan_id: r.ingredientId,
        bahan_name: r.ingredientName,
        qty_used: r.amountNeeded,
        unit: r.unit
      })),
      { menu_id: updatedItem.id, menu_code: updatedItem.code }
    );
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-[#D97706] text-white px-4 pt-4 pb-4 sticky top-0 z-30 shadow-md">
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
                <Coffee className="w-4 h-4 text-amber-200" />
                <h1 className="text-lg font-bold tracking-tight">Menu Makanan & Minuman</h1>
              </div>
              <p className="text-[11px] text-amber-100">Katalog Menu, Multi-Varian & Resep HPP Base</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-amber-800/60 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('katalog_menu')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'katalog_menu' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:text-white'
              }`}
            >
              Katalog
            </button>
            <button
              onClick={() => setActiveTab('varian_porsi')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'varian_porsi' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:text-white'
              }`}
            >
              Varian & Porsi
            </button>
            <button
              onClick={() => setActiveTab('resep_hpp')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'resep_hpp' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:text-white'
              }`}
            >
              Resep & HPP
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: KATALOG MENU */}
      {activeTab === 'katalog_menu' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Action & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama menu atau kode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <button
              onClick={handleOpenAddMenu}
              className="bg-[#D97706] hover:bg-amber-700 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Tambah Menu Baru</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c
                    ? 'bg-[#D97706] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map((item) => {
              const marginRp = item.price - item.hppCost;
              const marginPercent = Math.round((marginRp / item.price) * 100);

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-4 border shadow-xs transition-all flex flex-col justify-between ${
                    item.isAvailable ? 'border-slate-200 hover:border-amber-300' : 'border-slate-200 opacity-60 bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {item.code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            {item.badge}
                          </span>
                        )}
                        <button
                          onClick={() => handleToggleAvailability(item.id)}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                            item.isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {item.isAvailable ? 'Tersedia' : 'Habis'}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                      <div className="bg-slate-50 rounded-lg p-1.5">
                        <span className="text-[9px] text-slate-400 block">Harga Jual</span>
                        <span className="text-xs font-black text-slate-900">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-1.5">
                        <span className="text-[9px] text-slate-400 block">HPP Base</span>
                        <span className="text-xs font-black text-amber-700">
                          Rp {item.hppCost.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-1.5">
                        <span className="text-[9px] text-emerald-600 font-bold block">Margin Laba</span>
                        <span className="text-xs font-black text-emerald-800">
                          {marginPercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Terjual hari ini: <b className="text-slate-700">{item.soldCountToday || 0} porsi</b>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditMenu(item)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(item.id)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MULTI-VARIAN & PORSI */}
      {activeTab === 'varian_porsi' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              Kelola Multi-Varian, Porsi & Topping KedaiQu
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur opsi variasi yang muncul saat kasir memesan menu (Suhu, Ukuran Porsi, Level Pedas, dan Topping Tambahan).
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Ukuran Porsi Makanan / Minuman',
                category: 'Umum',
                options: [
                  { name: 'Reguler (Standar)', price: 0 },
                  { name: 'Jumbo / Porsi Besar', price: 5000 },
                  { name: 'Paket Komplit (Extra Lauk)', price: 7000 }
                ]
              },
              {
                title: 'Suhu Penyajian Minuman',
                category: 'Minuman',
                options: [
                  { name: 'Dingin (Es Kristal Higienis)', price: 0 },
                  { name: 'Panas / Hangat', price: 0 },
                  { name: 'Less Ice (Es Sedikit)', price: 0 }
                ]
              },
              {
                title: 'Tingkat Manis (Gula / Sirup)',
                category: 'Kopi & Minuman',
                options: [
                  { name: 'Normal Sugar (100%)', price: 0 },
                  { name: 'Less Sugar (50%)', price: 0 },
                  { name: 'No Sugar (0% / Pahit Murni)', price: 0 }
                ]
              },
              {
                title: 'Level Kepedasan Sambal',
                category: 'Makanan Utama',
                options: [
                  { name: 'Level 0 (Tidak Pedas)', price: 0 },
                  { name: 'Level 1 (Pedas Sedang)', price: 0 },
                  { name: 'Level 2 (Pedas Nendang)', price: 0 },
                  { name: 'Level 3 (Super Pedas Rawit)', price: 2000 }
                ]
              },
              {
                title: 'Topping Tambahan Minuman & Makanan',
                category: 'Addons',
                options: [
                  { name: 'Boba Brown Sugar Kenyal', price: 4000 },
                  { name: 'Extra Shot Espresso Arabika', price: 5000 },
                  { name: 'Telur Mata Sapi / Dadar', price: 4000 },
                  { name: 'Keju Cheddar / Mozarella Melt', price: 5000 },
                  { name: 'Sosis Sapi Goreng Crispy', price: 4000 }
                ]
              }
            ].map((vGroup, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      {vGroup.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 mt-1">{vGroup.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {vGroup.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-800">{opt.name}</span>
                      <span className="font-black text-blue-700">
                        {opt.price === 0 ? 'Gratis' : `+Rp ${opt.price.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: RESEP & HPP BASE */}
      {activeTab === 'resep_hpp' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Overview Banner */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-200" />
                Food Costing & HPP Base Generator
              </h2>
              <p className="text-xs text-amber-100">
                Hitung persis modal bahan baku per porsi. Pantau margin laba kotor agar kedai selalu untung sehat.
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold">
              Standar F&B Ideal: Food Cost &lt; 40%
            </div>
          </div>

          {/* Menu Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {menuItems.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedHppItem(m)}
                className={`text-xs px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedHppItem.id === m.id
                    ? 'bg-[#D97706] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          {/* Detailed HPP Breakdown Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black text-amber-600 uppercase">Analisis Resep</span>
                <h3 className="text-base font-bold text-slate-900">{selectedHppItem.name}</h3>
                <span className="text-xs text-slate-500">{selectedHppItem.category}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Harga Jual Menu</span>
                  <span className="text-sm font-black text-slate-900">
                    Rp {selectedHppItem.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right pl-3 border-l border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Total HPP Bahan</span>
                  <span className="text-sm font-black text-amber-700">
                    Rp {selectedHppItem.hppCost.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right pl-3 border-l border-slate-200">
                  <span className="text-[10px] text-emerald-600 font-bold block">Margin Laba</span>
                  <span className="text-sm font-black text-emerald-700">
                    {Math.round(((selectedHppItem.price - selectedHppItem.hppCost) / selectedHppItem.price) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Ingredients composition table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800">
                  Komposisi Bahan Baku ({selectedHppItem.recipeIngredients?.length || 0} bahan)
                </h4>
                <button
                  onClick={() => setIsRecipeEditorOpen(true)}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> + Tambah Bahan ke Resep
                </button>
              </div>

              <div className="space-y-1.5">
                {(!selectedHppItem.recipeIngredients || selectedHppItem.recipeIngredients.length === 0) ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Belum ada rincian bahan baku. Klik tombol "+ Tambah Bahan ke Resep" di atas.
                  </p>
                ) : (
                  selectedHppItem.recipeIngredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{ing.ingredientName}</span>
                        <span className="text-slate-500 text-[11px] block">
                          Takaran: {ing.amountNeeded} {ing.unit} @ Rp {ing.costPerUnit.toLocaleString('id-ID')}/{ing.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900">
                          Rp {ing.subtotalCost.toLocaleString('id-ID')}
                        </span>
                        <button
                          onClick={() => handleRemoveIngredientFromRecipe(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add ingredient drawer/modal */}
            {isRecipeEditorOpen && (
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-amber-900">Pilih Bahan Baku dari Gudang</h5>
                  <button
                    onClick={() => setIsRecipeEditorOpen(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Batal
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={newIngredientId}
                    onChange={(e) => setNewIngredientId(e.target.value)}
                    className="text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-hidden"
                  >
                    <option value="">-- Pilih Bahan --</option>
                    {rawIngredients.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.unit}) - Rp {r.avgBuyPrice}/{r.unit}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Jumlah takaran porsi..."
                    value={newIngredientAmount}
                    onChange={(e) => setNewIngredientAmount(Number(e.target.value))}
                    className="text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-hidden"
                  />

                  <button
                    onClick={handleAddIngredientToRecipe}
                    className="bg-[#D97706] hover:bg-amber-700 text-white text-xs font-bold py-1.5 rounded-xl shadow-xs"
                  >
                    Simpan Bahan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT MENU MODAL */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveMenu}
            className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-base font-bold text-slate-900">
                {editingMenuItem ? 'Edit Menu Makanan / Minuman' : 'Tambah Menu Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsMenuModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block">Nama Menu *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Es Kopi Susu Creamy..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Kode Menu</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Kopi & Minuman">Kopi & Minuman</option>
                    <option value="Makanan Utama">Makanan Utama</option>
                    <option value="Camilan & Snack">Camilan & Snack</option>
                    <option value="Paket Hemat">Paket Hemat</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Estimasi HPP (Rp)</label>
                  <input
                    type="number"
                    value={formHpp}
                    onChange={(e) => setFormHpp(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Badge Khusus (Opsional)</label>
                <input
                  type="text"
                  placeholder="Misal: Favorit, Best Seller, New, Pedas"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Deskripsi Menu</label>
                <textarea
                  rows={2}
                  placeholder="Penjelasan rasa, bahan utama, tekstur hidangan..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D97706] hover:bg-amber-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md shadow-amber-600/20 active:scale-95 transition-all"
            >
              Simpan Menu
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
