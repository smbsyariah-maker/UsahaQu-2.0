// src/types/kedai.ts - Type Definitions for KedaiQu Management Platform

export type OrderType = 'Dine In' | 'Take Away' | 'Online Delivery';
export type KitchenStatus = 'menunggu' | 'proses' | 'siap_saji' | 'selesai';
export type PaymentMethod = 'Tunai' | 'QRIS' | 'Transfer Bank' | 'Kartu Debit';

export interface MenuVariantOption {
  id: string;
  name: string;
  additionalPrice: number;
}

export interface MenuVariantGroup {
  id: string;
  name: string;
  required: boolean;
  allowMultiple: boolean;
  options: MenuVariantOption[];
}

export interface RecipeIngredientItem {
  ingredientId: string;
  ingredientName: string;
  amountNeeded: number;
  unit: string;
  costPerUnit: number;
  subtotalCost: number;
}

export interface MenuItem {
  id: string;
  code: string;
  name: string;
  category: 'Kopi & Minuman' | 'Makanan Utama' | 'Camilan & Snack' | 'Paket Hemat' | 'Dessert';
  price: number;
  hppCost: number; // Food cost
  isAvailable: boolean;
  description: string;
  badge?: string;
  imageUrl?: string;
  variantGroups?: MenuVariantGroup[];
  recipeIngredients?: RecipeIngredientItem[];
  soldCountToday?: number;
}

export interface OrderItem {
  id: string;
  menuId: string;
  menuName: string;
  category: string;
  price: number;
  qty: number;
  selectedVariants: string[];
  variantPriceAddon: number;
  notes?: string;
  subtotal: number;
}

export interface OrderTicket {
  id: string;
  orderNumber: string; // e.g. "KD-01"
  customerName: string;
  customerPhone?: string;
  tableNumber: string; // e.g. "Meja 03", "Take Away"
  orderType: OrderType;
  time: string;
  createdAt: number;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod | 'Belum Bayar';
  paymentStatus: 'Lunas' | 'Belum Lunas';
  kitchenStatus: KitchenStatus;
  cashierName: string;
  kitchenNotes?: string;
  cashPaid?: number;
  cashChange?: number;
}

export interface RawIngredient {
  id: string;
  code: string;
  name: string;
  category: 'Kopi & Susu' | 'Bahan Makanan' | 'Bumbu & Saus' | 'Kemasan & Packaging' | 'Gas & Operasional';
  stock: number;
  minStock: number;
  unit: string; // gram, ml, kg, liter, pcs, butir
  avgBuyPrice: number;
  supplierName: string;
  lastRestockDate: string;
}

export interface InboundStockRecord {
  id: string;
  invoiceNumber: string;
  date: string;
  timestamp: number;
  supplier: string;
  ingredientName: string;
  category: string;
  qty: number;
  unit: string;
  buyPrice: number;
  totalCost: number;
  receiver: string;
  notes?: string;
}

export interface StockOpnameRecord {
  id: string;
  date: string;
  timestamp: number;
  ingredientId: string;
  ingredientName: string;
  systemStock: number;
  physicalStock: number;
  difference: number;
  unit: string;
  reason: string;
  checkedBy: string;
}

export interface KedaiCustomer {
  id: string;
  name: string;
  phone: string;
  totalVisits: number;
  totalSpend: number;
  points: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  lastVisit: string;
  favoriteMenu: string;
  notes?: string;
}

export interface KedaiVoucher {
  id: string;
  code: string;
  title: string;
  type: 'percent' | 'nominal';
  value: number;
  minSpend: number;
  validUntil: string;
  quota: number;
  usedCount: number;
  isActive: boolean;
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Manager' | 'Kasir' | 'Barista' | 'Koki Dapur' | 'Waiter';
  phone: string;
  pin: string;
  shift: 'Pagi (08:00 - 16:00)' | 'Malam (16:00 - 23:00)' | 'Full Time';
  dailyCommission: number;
  ordersHandled: number;
  rating: number;
  status: 'Hadir' | 'Shift Libur' | 'Istirahat';
}

export interface StaffShiftRecord {
  id: string;
  staffName: string;
  role: string;
  date: string;
  shiftName: string;
  clockIn: string;
  clockOut?: string;
  status: 'Hadir Tepat Waktu' | 'Terlambat' | 'Izin' | 'Sakit';
  notes?: string;
}

export interface StaffCommissionRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  targetCount: number;
  actualCount: number;
  commissionPerUnit: number;
  totalCommission: number;
  status: 'Tertunda' | 'Sudah Ditransfer';
}

export interface StoreProfile {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  footerMessage: string;
  paperWidth: '58mm' | '80mm';
  taxRate: number; // e.g. 0 or 10
  serviceRate: number;
  qrisMerchantName: string;
}

export interface GeminiApiConfig {
  apiKey: string;
  model: string;
  isConnected: boolean;
  lastTested?: string;
  testResponse?: string;
}
