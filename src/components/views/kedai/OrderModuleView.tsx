import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Printer, 
  Share2, 
  UtensilsCrossed, 
  ChefHat, 
  Coffee, 
  Receipt, 
  QrCode, 
  DollarSign, 
  Check, 
  CreditCard, 
  Building2, 
  Sparkles, 
  AlertCircle,
  X,
  Flame,
  User,
  ShoppingBag,
  Mic,
  MicOff,
  Bot,
  Loader2
} from 'lucide-react';
import { 
  MenuItem, 
  OrderTicket, 
  OrderItem, 
  PaymentMethod, 
  StoreProfile,
  KitchenStatus,
  KedaiCustomer,
  KedaiVoucher
} from '../../../types/kedai';
import { PelangganService } from '../../../services/pelangganService';
import { SmartEngine } from '../../../services/smartEngine';
import { AntrianService } from '../../../services/antrianService';

interface OrderModuleViewProps {
  initialSubMenu?: string;
  onBack: () => void;
  menuItems: MenuItem[];
  orders: OrderTicket[];
  onAddOrder: (newOrder: OrderTicket) => void;
  onUpdateKitchenStatus: (orderId: string, status: KitchenStatus) => void;
  storeProfile: StoreProfile;
  customers: KedaiCustomer[];
  vouchers: KedaiVoucher[];
}

export const OrderModuleView: React.FC<OrderModuleViewProps> = ({
  initialSubMenu = 'order_pos',
  onBack,
  menuItems,
  orders,
  onAddOrder,
  onUpdateKitchenStatus,
  storeProfile,
  customers,
  vouchers
}) => {
  const [activeTab, setActiveTab] = useState<'order_pos' | 'antrian_dapur' | 'riwayat_transaksi'>(
    initialSubMenu as any || 'order_pos'
  );

  useEffect(() => {
    if (initialSubMenu) {
      setActiveTab(initialSubMenu as any);
    }
  }, [initialSubMenu]);

  // POS State
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState('Meja 01');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'Dine In' | 'Take Away' | 'Online Delivery'>('Dine In');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountNote, setDiscountNote] = useState('');

  // Variant Modal
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<{ [groupName: string]: { name: string; price: number } }>({});
  const [customItemNote, setCustomItemNote] = useState('');

  // Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tunai');
  const [cashGiven, setCashGiven] = useState<number>(0);

  // Receipt Modal
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<OrderTicket | null>(null);

  // Kitchen filter
  const [kitchenFilter, setKitchenFilter] = useState<'semua' | 'menunggu' | 'proses' | 'siap_saji'>('semua');

  // Smart Voice/Text AI Order Modal State (HYBRID POS)
  const [isSmartOrderModalOpen, setIsSmartOrderModalOpen] = useState(false);
  const [smartOrderInput, setSmartOrderInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [smartOrderError, setSmartOrderError] = useState<string | null>(null);
  const [smartOrderSuccessMsg, setSmartOrderSuccessMsg] = useState<string | null>(null);

  // History search
  const [historySearch, setHistorySearch] = useState('');

  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda belum mendukung Web Speech Recognition. Silakan ketik pesanan secara langsung di kolom teks.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSmartOrderInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleProcessSmartOrder = async () => {
    if (!smartOrderInput.trim()) return;
    setIsAiProcessing(true);
    setSmartOrderError(null);
    setSmartOrderSuccessMsg(null);

    let apiKey = '';
    try {
      const geminiCfg = JSON.parse(localStorage.getItem('kq_gemini') || '{}');
      apiKey = geminiCfg.apiKey || '';
    } catch (e) {
      apiKey = '';
    }

    const result = await SmartEngine.parseOrder(smartOrderInput, apiKey);
    setIsAiProcessing(false);

    if (!result.success || !result.data) {
      setSmartOrderError(result.message || 'Gagal memproses pesanan dengan AI.');
      return;
    }

    const parsedData = result.data;

    if (parsedData.order_type === 'TAKE_AWAY') {
      setOrderType('Take Away');
    } else {
      setOrderType('Dine In');
      if (parsedData.table_number && parsedData.table_number !== '-') {
        const cleanTableNum = parsedData.table_number.replace(/[^0-9]/g, '');
        if (cleanTableNum) {
          setSelectedTable(`Meja ${cleanTableNum.padStart(2, '0')}`);
        }
      }
    }

    if (parsedData.payment_method === 'QRIS') {
      setPaymentMethod('QRIS');
    } else if (parsedData.payment_method === 'CASH') {
      setPaymentMethod('Tunai');
    }

    let matchedCount = 0;
    if (Array.isArray(parsedData.items)) {
      parsedData.items.forEach((pItem) => {
        const pNameLower = pItem.item_name.toLowerCase();
        const matchedMenu = menuItems.find((m) => 
          m.name.toLowerCase().includes(pNameLower) || pNameLower.includes(m.name.toLowerCase())
        ) || menuItems.find((m) => 
          m.code.toLowerCase() === pNameLower
        );

        if (matchedMenu) {
          matchedCount += 1;
          const variantsList: string[] = [];
          if (pItem.variant && pItem.variant !== '-') {
            variantsList.push(pItem.variant);
          }
          for (let i = 0; i < (pItem.qty || 1); i++) {
            addItemToCart(matchedMenu, variantsList, 0, pItem.notes || '');
          }
        }
      });
    }

    setSmartOrderSuccessMsg(`Berhasil memproses ${matchedCount} menu ke keranjang kasir!`);
    setTimeout(() => {
      setIsSmartOrderModalOpen(false);
      setSmartOrderSuccessMsg(null);
      setSmartOrderInput('');
    }, 1100);
  };

  const categories = ['Semua', 'Kopi & Minuman', 'Makanan Utama', 'Camilan & Snack', 'Paket Hemat'];

  const filteredMenuItems = menuItems.filter((item) => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Open item for cart (or variant modal)
  const handleItemClick = (item: MenuItem) => {
    if (item.variantGroups && item.variantGroups.length > 0) {
      setCustomizingItem(item);
      const defaults: { [groupName: string]: { name: string; price: number } } = {};
      item.variantGroups.forEach(g => {
        if (g.options.length > 0) {
          defaults[g.name] = { name: g.options[0].name, price: g.options[0].additionalPrice };
        }
      });
      setSelectedVariants(defaults);
      setCustomItemNote('');
    } else {
      // Add directly
      addItemToCart(item, [], 0, '');
    }
  };

  const handleConfirmVariants = () => {
    if (!customizingItem) return;
    const variantLabels: string[] = [];
    let addonPrice = 0;
    Object.entries(selectedVariants).forEach(([_, opt]) => {
      variantLabels.push(opt.name);
      addonPrice += opt.price;
    });
    addItemToCart(customizingItem, variantLabels, addonPrice, customItemNote);
    setCustomizingItem(null);
  };

  const addItemToCart = (
    item: MenuItem, 
    variants: string[], 
    variantAddon: number, 
    notes: string
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (ci) => ci.menuId === item.id && 
                JSON.stringify(ci.selectedVariants) === JSON.stringify(variants) &&
                ci.notes === notes
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].qty += 1;
        copy[existingIdx].subtotal = (copy[existingIdx].price + copy[existingIdx].variantPriceAddon) * copy[existingIdx].qty;
        return copy;
      } else {
        const unitPrice = item.price;
        const newOrderItem: OrderItem = {
          id: `oi-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          menuId: item.id,
          menuName: item.name,
          category: item.category,
          price: unitPrice,
          qty: 1,
          selectedVariants: variants,
          variantPriceAddon: variantAddon,
          notes: notes,
          subtotal: unitPrice + variantAddon
        };
        return [...prev, newOrderItem];
      }
    });
  };

  const updateCartQty = (idx: number, delta: number) => {
    setCart((prev) => {
      const copy = [...prev];
      const newQty = copy[idx].qty + delta;
      if (newQty <= 0) {
        return copy.filter((_, i) => i !== idx);
      }
      copy[idx].qty = newQty;
      copy[idx].subtotal = (copy[idx].price + copy[idx].variantPriceAddon) * newQty;
      return copy;
    });
  };

  const removeCartItem = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const taxAmount = storeProfile.taxRate > 0 ? Math.round((cartSubtotal - appliedDiscount) * (storeProfile.taxRate / 100)) : 0;
  const cartGrandTotal = Math.max(0, cartSubtotal - appliedDiscount + taxAmount);

  // Apply voucher
  const handleApplyVoucher = () => {
    const v = vouchers.find(
      (item) => item.code.trim().toUpperCase() === voucherCode.trim().toUpperCase() && item.isActive
    );
    if (!v) {
      alert('Voucher tidak ditemukan atau sudah tidak aktif.');
      return;
    }
    if (cartSubtotal < v.minSpend) {
      alert(`Minimal belanja untuk voucher ini adalah Rp ${v.minSpend.toLocaleString('id-ID')}`);
      return;
    }
    let disc = 0;
    if (v.type === 'percent') {
      disc = Math.round((cartSubtotal * v.value) / 100);
    } else {
      disc = v.value;
    }
    setAppliedDiscount(disc);
    setDiscountNote(`${v.code} (-Rp ${disc.toLocaleString('id-ID')})`);
  };

  // Open Payment
  const handleStartPayment = () => {
    if (cart.length === 0) return;
    setCashGiven(cartGrandTotal);
    setIsPaymentModalOpen(true);
  };

  // Quick submit to kitchen without immediate payment (Bayar Nanti / Tab)
  const handleSendToKitchenOnly = () => {
    if (cart.length === 0) return;
    const now = new Date();
    const orderNum = `KD-${(orders.length + 1).toString().padStart(2, '0')}`;
    const newTicket: OrderTicket = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName: customerName.trim() || `Tamu ${selectedTable}`,
      tableNumber: orderType === 'Dine In' ? selectedTable : orderType,
      orderType: orderType,
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`,
      createdAt: Date.now(),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: appliedDiscount,
      tax: taxAmount,
      total: cartGrandTotal,
      paymentMethod: 'Belum Bayar',
      paymentStatus: 'Belum Lunas',
      kitchenStatus: 'menunggu',
      cashierName: 'Kasir KedaiQu',
      kitchenNotes: 'Order baru dikirim ke dapur/bar'
    };
    onAddOrder(newTicket);
    setCart([]);
    setAppliedDiscount(0);
    setVoucherCode('');
    setDiscountNote('');
    setActiveTab('antrian_dapur');
  };

  // Finalize paid transaction
  const handleCompletePayment = () => {
    const now = new Date();
    const orderNum = `KD-${(orders.length + 1).toString().padStart(2, '0')}`;
    const newTicket: OrderTicket = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName: customerName.trim() || `Tamu ${selectedTable}`,
      customerPhone: customerPhone.trim() || undefined,
      tableNumber: orderType === 'Dine In' ? selectedTable : orderType,
      orderType: orderType,
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`,
      createdAt: Date.now(),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: appliedDiscount,
      tax: taxAmount,
      total: cartGrandTotal,
      paymentMethod: paymentMethod,
      paymentStatus: 'Lunas',
      kitchenStatus: 'menunggu',
      cashierName: 'Kasir KedaiQu',
      cashPaid: paymentMethod === 'Tunai' ? cashGiven : cartGrandTotal,
      cashChange: paymentMethod === 'Tunai' ? Math.max(0, cashGiven - cartGrandTotal) : 0
    };

    // Auto-save / Sync Pelanggan Setiap Selesai Transaksi di Kasir via PelangganService
    if (customerPhone.trim()) {
      PelangganService.syncFromTransaction({
        name: customerName.trim() || `Pelanggan ${selectedTable}`,
        phone: customerPhone.trim(),
        total_spent: cartGrandTotal,
        favorite_item: cart[0]?.menuName || '-'
      });
    }

    onAddOrder(newTicket);
    setIsPaymentModalOpen(false);
    setSelectedReceiptOrder(newTicket);
    setCart([]);
    setAppliedDiscount(0);
    setVoucherCode('');
    setDiscountNote('');
  };

  // Calculate elapsed time for kitchen
  const getElapsedMinutes = (createdAt: number) => {
    return Math.floor((Date.now() - createdAt) / (1000 * 60));
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen">
      {/* Top Header */}
      <div className="bg-[#2563EB] text-white px-4 pt-4 pb-4 sticky top-0 z-30 shadow-md">
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
                <UtensilsCrossed className="w-4 h-4 text-blue-200" />
                <h1 className="text-lg font-bold tracking-tight">Modul Order KedaiQu</h1>
              </div>
              <p className="text-[11px] text-blue-100">Kasir Hybrid, KDS Dapur & Riwayat Struk</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-blue-700/60 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('order_pos')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'order_pos' ? 'bg-white text-blue-700 shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              POS Kasir
            </button>
            <button
              onClick={() => setActiveTab('antrian_dapur')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                activeTab === 'antrian_dapur' ? 'bg-white text-blue-700 shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              <span>Dapur / Bar</span>
              {orders.filter(o => o.kitchenStatus !== 'selesai').length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center">
                  {orders.filter(o => o.kitchenStatus !== 'selesai').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('riwayat_transaksi')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'riwayat_transaksi' ? 'bg-white text-blue-700 shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              Struk
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: SMART & MANUAL KASIR POS */}
      {activeTab === 'order_pos' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Menu Catalog Section */}
          <div className="flex-1 p-3.5 flex flex-col space-y-3 overflow-y-auto">
            {/* Quick Order Info Bar */}
            <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/70 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Tipe Order:</span>
                {(['Dine In', 'Take Away', 'Online Delivery'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setOrderType(t)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                      orderType === t
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {orderType === 'Dine In' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-700">Pilih Meja:</span>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 rounded-lg px-2 py-1 focus:outline-hidden"
                  >
                    {Array.from({ length: 15 }, (_, i) => `Meja ${(i + 1).toString().padStart(2, '0')}`).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Nama Pelanggan..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg flex-1 sm:w-36 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="No. WhatsApp (08xx)..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg flex-1 sm:w-40 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Search and Category Tabs */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari kopi, mie nyemek, nasi goreng, cemilan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-400 cursor-pointer transition-all flex flex-col justify-between group active:scale-[0.98]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {item.code}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">Harga</span>
                      <span className="text-xs font-black text-slate-900">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Checkout Panel */}
          <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col shadow-lg z-20">
            {/* Cart Header */}
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold text-slate-800">
                  Keranjang Order ({cart.reduce((a, b) => a + b.qty, 0)} item)
                </h2>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-[11px] font-bold text-rose-600 hover:underline"
                >
                  Kosongkan
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 max-h-[350px] lg:max-h-none">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <UtensilsCrossed className="w-10 h-10 mx-auto stroke-1 mb-2 text-slate-300" />
                  <p className="text-xs font-medium">Keranjang masih kosong</p>
                  <p className="text-[11px]">Pilih menu makanan & minuman di sebelah kiri</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={item.id} className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">{item.menuName}</h4>
                        {item.selectedVariants.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedVariants.map((v, i) => (
                              <span key={i} className="text-[9px] bg-blue-100/70 text-blue-700 px-1.5 py-0.2 rounded-md font-medium">
                                {v}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.notes && (
                          <p className="text-[10px] text-amber-700 mt-1 italic">Catatan: {item.notes}</p>
                        )}
                        <span className="text-[11px] font-extrabold text-blue-700 block mt-1">
                          Rp {(item.price + item.variantPriceAddon).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => updateCartQty(idx, -1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1 text-slate-800">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(idx, 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Voucher input */}
            {cart.length > 0 && (
              <div className="px-3 py-2 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Kode Voucher (cth: KEDAISANTAI)"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="flex-1 text-[11px] uppercase tracking-wider px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="text-[11px] font-bold bg-slate-800 text-white px-2.5 py-1.5 rounded-lg active:scale-95"
                  >
                    Klaim
                  </button>
                </div>
                {discountNote && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> {discountNote}
                  </p>
                )}
              </div>
            )}

            {/* Summary & Checkout actions */}
            <div className="p-3.5 bg-white border-t border-slate-200 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal ({cart.length} item)</span>
                <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-medium">
                  <span>Diskon Voucher</span>
                  <span>-Rp {appliedDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {storeProfile.taxRate > 0 && (
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Pajak Resto ({storeProfile.taxRate}%)</span>
                  <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-100">
                <span>Total Bayar</span>
                <span className="text-blue-600">Rp {cartGrandTotal.toLocaleString('id-ID')}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={handleSendToKitchenOnly}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Kirim ke Dapur</span>
                </button>
                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={handleStartPayment}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <DollarSign className="w-4 h-4 stroke-[2.5]" />
                  <span>Bayar POS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ANTRIAN LIVE DAPUR / BAR (KDS) */}
      {activeTab === 'antrian_dapur' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Header Controls */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-blue-600" />
                Kitchen Display System (KDS Live Bar & Dapur)
              </h2>
              <p className="text-xs text-slate-500">
                Pantau antrian pesanan yang harus dimasak koki atau diracik barista secara real-time.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {(['semua', 'menunggu', 'proses', 'siap_saji'] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKitchenFilter(k)}
                  className={`text-xs px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                    kitchenFilter === k
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {k === 'siap_saji' ? 'Siap Saji' : k}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tickets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {orders
              .filter(o => kitchenFilter === 'semua' || o.kitchenStatus === kitchenFilter)
              .map((ord) => {
                const elapsed = getElapsedMinutes(ord.createdAt);
                const isOverdue = elapsed > 20;
                const isWarning = elapsed > 10;

                return (
                  <div
                    key={ord.id}
                    className={`bg-white rounded-2xl p-4 border shadow-xs transition-all flex flex-col justify-between ${
                      ord.kitchenStatus === 'selesai'
                        ? 'border-slate-200 opacity-60'
                        : isOverdue
                        ? 'border-rose-400 ring-2 ring-rose-100'
                        : isWarning
                        ? 'border-amber-300'
                        : 'border-blue-200'
                    }`}
                  >
                    <div>
                      {/* Ticket Top bar */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black px-2 py-0.5 rounded-lg bg-blue-600 text-white">
                            {ord.orderNumber}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block leading-tight">
                              {ord.tableNumber}
                            </span>
                            <span className="text-[10px] text-slate-500">{ord.customerName}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              isOverdue
                                ? 'bg-rose-100 text-rose-700 animate-pulse'
                                : isWarning
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            {elapsed} Menit Lalu
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{ord.time}</span>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="py-3 space-y-2">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between text-xs">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-md">
                                  {item.qty}x
                                </span>
                                <span className="font-bold text-slate-800">{item.menuName}</span>
                              </div>
                              {item.selectedVariants.length > 0 && (
                                <p className="text-[10px] text-slate-500 pl-6">
                                  {item.selectedVariants.join(' • ')}
                                </p>
                              )}
                              {item.notes && (
                                <p className="text-[10px] text-amber-600 font-medium pl-6">
                                  ★ {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Status Dapur:</span>
                        <span className="font-bold capitalize text-slate-800">
                          {ord.kitchenStatus.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => onUpdateKitchenStatus(ord.id, 'proses')}
                          className={`text-[10px] font-bold py-1.5 rounded-lg border transition-all ${
                            ord.kitchenStatus === 'proses'
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Masak
                        </button>
                        <button
                          onClick={() => onUpdateKitchenStatus(ord.id, 'siap_saji')}
                          className={`text-[10px] font-bold py-1.5 rounded-lg border transition-all ${
                            ord.kitchenStatus === 'siap_saji'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Siap Saji
                        </button>
                        <button
                          onClick={() => onUpdateKitchenStatus(ord.id, 'selesai')}
                          className={`text-[10px] font-bold py-1.5 rounded-lg border transition-all ${
                            ord.kitchenStatus === 'selesai'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Selesai
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* VIEW 3: RIWAYAT & CETAK STRUK */}
      {activeTab === 'riwayat_transaksi' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Search bar & summary */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nomor nota (KD-01) atau nama pelanggan..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                <span className="text-slate-500 text-[10px] block">Total Order</span>
                <span className="font-extrabold text-blue-700">{orders.length} Transaksi</span>
              </div>
              <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                <span className="text-slate-500 text-[10px] block">Total Nilai</span>
                <span className="font-extrabold text-emerald-700">
                  Rp {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Orders list */}
          <div className="space-y-2.5">
            {orders
              .filter(o => o.orderNumber.toLowerCase().includes(historySearch.toLowerCase()) || 
                           o.customerName.toLowerCase().includes(historySearch.toLowerCase()))
              .map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
                      {order.orderNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{order.customerName}</h4>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {order.tableNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.paymentStatus === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {order.time} • {order.items.length} Menu ({order.items.map(i => `${i.qty}x ${i.menuName}`).join(', ')})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{order.paymentMethod}</span>
                      <span className="text-sm font-black text-slate-900">
                        Rp {order.total.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Struk</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* VARIANT CUSTOMIZER MODAL */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                  Kustomisasi Menu
                </span>
                <h3 className="text-base font-bold text-slate-900">{customizingItem.name}</h3>
                <p className="text-xs text-slate-500">Harga dasar: Rp {customizingItem.price.toLocaleString('id-ID')}</p>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
              {customizingItem.variantGroups?.map((group) => (
                <div key={group.id} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {group.name} {group.required && <span className="text-rose-500">*</span>}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {group.options.map((opt) => {
                      const isSelected = selectedVariants[group.name]?.name === opt.name;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSelectedVariants(prev => ({
                              ...prev,
                              [group.name]: { name: opt.name, price: opt.additionalPrice }
                            }));
                          }}
                          className={`text-left p-2 rounded-xl border text-xs transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                              : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          <div>{opt.name}</div>
                          {opt.additionalPrice > 0 && (
                            <span className="text-[10px] text-blue-600 font-medium">
                              +Rp {opt.additionalPrice.toLocaleString('id-ID')}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Catatan Khusus</label>
                <input
                  type="text"
                  placeholder="Misal: Es sedikit, tidak pedas, tanpa sedotan..."
                  value={customItemNote}
                  onChange={(e) => setCustomItemNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Porsi</span>
                <span className="text-sm font-extrabold text-slate-900">
                  Rp {(
                    customizingItem.price +
                    Object.values(selectedVariants).reduce((s, v) => s + v.price, 0)
                  ).toLocaleString('id-ID')}
                </span>
              </div>
              <button
                type="button"
                onClick={handleConfirmVariants}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              >
                + Masukkan Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pembayaran Kasir POS</h3>
                <p className="text-xs text-slate-500">{orderType} • {selectedTable}</p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Total Display */}
            <div className="bg-blue-50/80 rounded-2xl p-4 text-center border border-blue-100">
              <span className="text-xs text-blue-600 font-semibold block">Total yang Harus Dibayar</span>
              <span className="text-2xl font-black text-blue-900 tracking-tight">
                Rp {cartGrandTotal.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Tunai', icon: DollarSign, label: 'Tunai (Cash)' },
                  { id: 'QRIS', icon: QrCode, label: 'QRIS Dinamis' },
                  { id: 'Transfer Bank', icon: Building2, label: 'Transfer Bank' },
                  { id: 'Kartu Debit', icon: CreditCard, label: 'Kartu Debit/EDC' }
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        paymentMethod === m.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cash specific helpers */}
            {paymentMethod === 'Tunai' && (
              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                <label className="text-xs font-bold text-slate-700">Nominal Uang Diterima</label>
                <input
                  type="number"
                  value={cashGiven || ''}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                  className="w-full text-base font-bold px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[cartGrandTotal, 20000, 50000, 100000, 200000].map((amt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCashGiven(amt)}
                      className="text-[10px] font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-700"
                    >
                      {amt === cartGrandTotal ? 'Uang Pas' : `Rp ${amt.toLocaleString('id-ID')}`}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Uang Kembalian:</span>
                  <span className="font-black text-emerald-700 text-sm">
                    Rp {Math.max(0, cashGiven - cartGrandTotal).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === 'QRIS' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-slate-800" />
                </div>
                <p className="text-[11px] font-bold text-slate-700">{storeProfile.qrisMerchantName}</p>
                <p className="text-[10px] text-slate-400">Scan melalui GoPay, OVO, Dana, BCA, Livin atau ShopeePay</p>
              </div>
            )}

            <button
              type="button"
              disabled={paymentMethod === 'Tunai' && cashGiven < cartGrandTotal}
              onClick={handleCompletePayment}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Selesaikan Transaksi & Cetak Struk</span>
            </button>
          </div>
        </div>
      )}

      {/* THERMAL RECEIPT MODAL */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-blue-600" />
                Preview Struk Kasir ({storeProfile.paperWidth})
              </h3>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Paper Simulation */}
            <div className="bg-slate-50 border border-dashed border-slate-300 p-4 rounded-xl font-mono text-[11px] text-slate-800 space-y-2 select-text">
              <div className="text-center pb-2 border-b border-dashed border-slate-300">
                <h4 className="font-extrabold text-sm">{storeProfile.name}</h4>
                <p className="text-[10px] text-slate-500 leading-tight">{storeProfile.address}</p>
                <p className="text-[10px] text-slate-500">Telp: {storeProfile.phone}</p>
              </div>

              <div className="text-[10px] space-y-0.5 border-b border-dashed border-slate-300 pb-1.5">
                <div className="flex justify-between">
                  <span>No: {selectedReceiptOrder.orderNumber}</span>
                  <span>{selectedReceiptOrder.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kasir: {selectedReceiptOrder.cashierName}</span>
                  <span>{selectedReceiptOrder.tableNumber}</span>
                </div>
                <div>Pelanggan: {selectedReceiptOrder.customerName}</div>
              </div>

              {/* Items */}
              <div className="space-y-1 py-1 border-b border-dashed border-slate-300">
                {selectedReceiptOrder.items.map((i, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold">
                      <span>{i.menuName}</span>
                      <span>Rp {i.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span>{i.qty} x Rp {(i.price + i.variantPriceAddon).toLocaleString('id-ID')}</span>
                      {i.selectedVariants.length > 0 && (
                        <span>({i.selectedVariants.join(', ')})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-0.5 pt-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp {selectedReceiptOrder.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {selectedReceiptOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Diskon:</span>
                    <span>-Rp {selectedReceiptOrder.discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-slate-200">
                  <span>TOTAL:</span>
                  <span>Rp {selectedReceiptOrder.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Metode: {selectedReceiptOrder.paymentMethod}</span>
                  <span>Status: {selectedReceiptOrder.paymentStatus}</span>
                </div>
                {selectedReceiptOrder.cashPaid !== undefined && (
                  <>
                    <div className="flex justify-between text-[10px]">
                      <span>Tunai Diterima:</span>
                      <span>Rp {selectedReceiptOrder.cashPaid.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>Kembalian:</span>
                      <span>Rp {(selectedReceiptOrder.cashChange || 0).toLocaleString('id-ID')}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="text-center pt-3 text-[10px] text-slate-500 border-t border-dashed border-slate-300">
                <p>{storeProfile.footerMessage}</p>
                <p className="mt-1 font-semibold">Simpan struk ini sebagai bukti pembayaran sah</p>
              </div>
            </div>

            {/* Print & Share actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Thermal</span>
              </button>
              <button
                onClick={() => {
                  const targetPhone = selectedReceiptOrder.customerPhone || customerPhone || '';
                  const text = `*${storeProfile.name}*\nStruk Pembayaran: ${selectedReceiptOrder.orderNumber}\nPelanggan: ${selectedReceiptOrder.customerName}\nTotal: Rp ${selectedReceiptOrder.total.toLocaleString('id-ID')}\nTerima kasih atas kunjungan Anda!`;
                  const waUrl = PelangganService.createWALink(targetPhone, text);
                  window.open(waUrl || `https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Kirim WA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
