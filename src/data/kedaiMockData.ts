// src/data/kedaiMockData.ts - Initial Realistic Data for KedaiQu Management Platform
import { 
  MenuItem, 
  OrderTicket, 
  RawIngredient, 
  InboundStockRecord, 
  StockOpnameRecord, 
  KedaiCustomer, 
  KedaiVoucher, 
  StaffMember, 
  StaffShiftRecord, 
  StaffCommissionRecord, 
  StoreProfile, 
  GeminiApiConfig 
} from '../types/kedai';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm-1',
    code: 'KOP-01',
    name: 'Kopi Susu Aren Spesial',
    category: 'Kopi & Minuman',
    price: 18000,
    hppCost: 6800,
    isAvailable: true,
    description: 'Espresso bold arabika blend dengan susu segar creamy dan gula aren cair murni nusantara.',
    badge: 'Favorit',
    soldCountToday: 38,
    variantGroups: [
      {
        id: 'vg-temp',
        name: 'Suhu Penyajian',
        required: true,
        allowMultiple: false,
        options: [
          { id: 'opt-ice', name: 'Dingin (Es Kristal)', additionalPrice: 0 },
          { id: 'opt-hot', name: 'Panas / Hangat', additionalPrice: 0 }
        ]
      },
      {
        id: 'vg-sugar',
        name: 'Tingkat Manis (Gula Aren)',
        required: false,
        allowMultiple: false,
        options: [
          { id: 'opt-s100', name: 'Normal (100%)', additionalPrice: 0 },
          { id: 'opt-s50', name: 'Less Sugar (50%)', additionalPrice: 0 },
          { id: 'opt-s0', name: 'No Sugar (0%)', additionalPrice: 0 }
        ]
      },
      {
        id: 'vg-top-drink',
        name: 'Extra Topping Minuman',
        required: false,
        allowMultiple: true,
        options: [
          { id: 'opt-boba', name: 'Boba Brown Sugar', additionalPrice: 4000 },
          { id: 'opt-shot', name: 'Extra Shot Espresso', additionalPrice: 5000 },
          { id: 'opt-jelly', name: 'Coffee Jelly Cube', additionalPrice: 3500 }
        ]
      }
    ],
    recipeIngredients: [
      { ingredientId: 'ing-kopi', ingredientName: 'Biji Kopi Blend', amountNeeded: 18, unit: 'gram', costPerUnit: 220, subtotalCost: 3960 },
      { ingredientId: 'ing-susu', ingredientName: 'Susu UHT Fresh', amountNeeded: 120, unit: 'ml', costPerUnit: 16, subtotalCost: 1920 },
      { ingredientId: 'ing-aren', ingredientName: 'Gula Aren Cair', amountNeeded: 25, unit: 'ml', costPerUnit: 18, subtotalCost: 450 },
      { ingredientId: 'ing-cup', ingredientName: 'Cup 16oz + Sedotan', amountNeeded: 1, unit: 'pcs', costPerUnit: 470, subtotalCost: 470 }
    ]
  },
  {
    id: 'm-2',
    code: 'KOP-02',
    name: 'Ice Caramel Macchiato',
    category: 'Kopi & Minuman',
    price: 24000,
    hppCost: 9200,
    isAvailable: true,
    description: 'Layered espresso dengan vanilla syrup, steamed fresh milk dan drizzle saus caramel premium.',
    badge: 'Best Seller',
    soldCountToday: 24,
    variantGroups: [
      {
        id: 'vg-size',
        name: 'Ukuran Cup',
        required: true,
        allowMultiple: false,
        options: [
          { id: 'opt-reg', name: 'Reguler (16oz)', additionalPrice: 0 },
          { id: 'opt-large', name: 'Large (22oz)', additionalPrice: 5000 }
        ]
      }
    ]
  },
  {
    id: 'm-3',
    code: 'MIN-03',
    name: 'Matcha Latte Creamy',
    category: 'Kopi & Minuman',
    price: 22000,
    hppCost: 8000,
    isAvailable: true,
    description: 'Bubuk green tea matcha murni berpadu susu segar gurih, rasa manis lembut menenangkan.',
    soldCountToday: 19
  },
  {
    id: 'm-4',
    code: 'MIN-04',
    name: 'Es Teh Melati Solo Jumbo',
    category: 'Kopi & Minuman',
    price: 8000,
    hppCost: 2200,
    isAvailable: true,
    description: 'Seduhan teh melati wangi khas Solo dengan gula batu asli dalam gelas jumbo segar.',
    badge: 'Paling Laris',
    soldCountToday: 52
  },
  {
    id: 'm-5',
    code: 'MAK-01',
    name: 'Nasi Goreng Spesial Kedai',
    category: 'Makanan Utama',
    price: 25000,
    hppCost: 11000,
    isAvailable: true,
    description: 'Nasi goreng racikan bumbu khas kedai dengan suwiran ayam, telur mata sapi, kerupuk udang & acar.',
    badge: 'Chef Choice',
    soldCountToday: 28,
    variantGroups: [
      {
        id: 'vg-pedas',
        name: 'Level Kepedasan',
        required: true,
        allowMultiple: false,
        options: [
          { id: 'opt-p0', name: 'Level 0 (Tidak Pedas)', additionalPrice: 0 },
          { id: 'opt-p1', name: 'Level 1 (Sedang)', additionalPrice: 0 },
          { id: 'opt-p2', name: 'Level 2 (Pedas)', additionalPrice: 0 },
          { id: 'opt-p3', name: 'Level 3 (Ekstra Pedas)', additionalPrice: 2000 }
        ]
      },
      {
        id: 'vg-top-food',
        name: 'Tambah Topping Lauk',
        required: false,
        allowMultiple: true,
        options: [
          { id: 'opt-telur', name: 'Ekstra Telur Ceplok/Dadar', additionalPrice: 4000 },
          { id: 'opt-sosis', name: 'Sosis Sapi Goreng', additionalPrice: 4000 },
          { id: 'opt-ati', name: 'Ati Ampela Bumbu', additionalPrice: 5000 }
        ]
      }
    ],
    recipeIngredients: [
      { ingredientId: 'ing-beras', ingredientName: 'Beras Pandan Wangi', amountNeeded: 150, unit: 'gram', costPerUnit: 16, subtotalCost: 2400 },
      { ingredientId: 'ing-ayam', ingredientName: 'Ayam Fillet Suwir', amountNeeded: 70, unit: 'gram', costPerUnit: 48, subtotalCost: 3360 },
      { ingredientId: 'ing-telur', ingredientName: 'Telur Ayam', amountNeeded: 1, unit: 'butir', costPerUnit: 2200, subtotalCost: 2200 },
      { ingredientId: 'ing-bumbu', ingredientName: 'Bumbu Nasi Goreng', amountNeeded: 40, unit: 'gram', costPerUnit: 35, subtotalCost: 1400 },
      { ingredientId: 'ing-minyak', ingredientName: 'Minyak Goreng', amountNeeded: 25, unit: 'ml', costPerUnit: 18, subtotalCost: 450 },
      { ingredientId: 'ing-box', ingredientName: 'Paper Lunch Box', amountNeeded: 1, unit: 'pcs', costPerUnit: 1190, subtotalCost: 1190 }
    ]
  },
  {
    id: 'm-6',
    code: 'MAK-02',
    name: 'Ayam Geprek Sambal Korek + Nasi',
    category: 'Makanan Utama',
    price: 22000,
    hppCost: 9800,
    isAvailable: true,
    description: 'Ayam krispi renyah digeprek dengan sambal korek bawang rawit merah pedas nendang plus nasi pulen.',
    soldCountToday: 33,
    variantGroups: [
      {
        id: 'vg-sambal',
        name: 'Pilihan Sambal',
        required: true,
        allowMultiple: false,
        options: [
          { id: 'opt-korek', name: 'Sambal Korek Bawang (Juara)', additionalPrice: 0 },
          { id: 'opt-matah', name: 'Sambal Matah Bali Segar', additionalPrice: 2000 },
          { id: 'opt-ijo', name: 'Sambal Ijo Padang', additionalPrice: 0 }
        ]
      }
    ]
  },
  {
    id: 'm-7',
    code: 'MAK-03',
    name: 'Mie Dok-Dok Kuah Nyemek Kedai',
    category: 'Makanan Utama',
    price: 19000,
    hppCost: 7500,
    isAvailable: true,
    description: 'Mie kuah kental gurih dengan telur orak-arik, sawi hijau segar, cabai rawit iris, dan suwir ayam.',
    soldCountToday: 21
  },
  {
    id: 'm-8',
    code: 'SNK-01',
    name: 'Dimsum Mentai Panggang (4 pcs)',
    category: 'Camilan & Snack',
    price: 23000,
    hppCost: 10200,
    isAvailable: true,
    description: 'Dimsum ayam udang lembut diselimuti saus mentai gurih pedas dan di-torched hingga wangi aromatik.',
    badge: 'Favorit Snack',
    soldCountToday: 17
  },
  {
    id: 'm-9',
    code: 'SNK-02',
    name: 'Roti Bakar Cokelat Keju Melt',
    category: 'Camilan & Snack',
    price: 16000,
    hppCost: 6000,
    isAvailable: true,
    description: 'Roti tebal bakar mentega dengan meses cokelat melimpah dan taburan keju cheddar parut tebal.',
    soldCountToday: 15
  },
  {
    id: 'm-10',
    code: 'SNK-03',
    name: 'Kentang Goreng Crispy Seasoning',
    category: 'Camilan & Snack',
    price: 15000,
    hppCost: 5500,
    isAvailable: true,
    description: 'Kentang potong crinkle garing dengan bumbu tabur BBQ / Keju gurih ditemani cocolan saus sambal.',
    soldCountToday: 29
  },
  {
    id: 'm-11',
    code: 'PKT-01',
    name: 'Paket Hemat Kenyang 1',
    category: 'Paket Hemat',
    price: 27000,
    hppCost: 12000,
    isAvailable: true,
    description: '1 Nasi Goreng Spesial + 1 Es Teh Melati Solo Jumbo (Hemat Rp 6.000).',
    badge: 'Promo Hemat',
    soldCountToday: 18
  }
];

export const INITIAL_RAW_INGREDIENTS: RawIngredient[] = [
  {
    id: 'ing-kopi',
    code: 'BAH-001',
    name: 'Biji Kopi Arabika Robusta Blend',
    category: 'Kopi & Susu',
    stock: 8500,
    minStock: 2000,
    unit: 'gram',
    avgBuyPrice: 220,
    supplierName: 'Roastery Nusantara Utama',
    lastRestockDate: 'Kemarin'
  },
  {
    id: 'ing-susu',
    code: 'BAH-002',
    name: 'Susu UHT Fresh Full Cream (1L)',
    category: 'Kopi & Susu',
    stock: 28,
    minStock: 10,
    unit: 'liter',
    avgBuyPrice: 16000,
    supplierName: 'PT Diamond Susu Sejahtera',
    lastRestockDate: '2 Hari Lalu'
  },
  {
    id: 'ing-aren',
    code: 'BAH-003',
    name: 'Gula Aren Cair Murni Organik',
    category: 'Bahan Makanan',
    stock: 4500,
    minStock: 1500,
    unit: 'ml',
    avgBuyPrice: 18,
    supplierName: 'Petani Gula Lebak Banten',
    lastRestockDate: '3 Hari Lalu'
  },
  {
    id: 'ing-beras',
    code: 'BAH-004',
    name: 'Beras Pandan Wangi Super',
    category: 'Bahan Makanan',
    stock: 42,
    minStock: 15,
    unit: 'kg',
    avgBuyPrice: 15500,
    supplierName: 'Agen Beras Pasar Induk',
    lastRestockDate: 'Hari Ini'
  },
  {
    id: 'ing-ayam',
    code: 'BAH-005',
    name: 'Daging Ayam Fillet Segar',
    category: 'Bahan Makanan',
    stock: 12,
    minStock: 5,
    unit: 'kg',
    avgBuyPrice: 48000,
    supplierName: 'Pemasok Ayam Broiler Segar',
    lastRestockDate: 'Hari Ini'
  },
  {
    id: 'ing-telur',
    code: 'BAH-006',
    name: 'Telur Ayam Negeri',
    category: 'Bahan Makanan',
    stock: 65,
    minStock: 30,
    unit: 'butir',
    avgBuyPrice: 2200,
    supplierName: 'Peternakan Unggas Berkah',
    lastRestockDate: 'Hari Ini'
  },
  {
    id: 'ing-cup',
    code: 'BAH-007',
    name: 'Cup Dingin 16oz Sablon + Lid',
    category: 'Kemasan & Packaging',
    stock: 350,
    minStock: 100,
    unit: 'pcs',
    avgBuyPrice: 470,
    supplierName: 'Percetakan Kemasan Maju',
    lastRestockDate: 'Minggu Lalu'
  },
  {
    id: 'ing-box',
    code: 'BAH-008',
    name: 'Paper Lunch Box Bento KedaiQu',
    category: 'Kemasan & Packaging',
    stock: 180,
    minStock: 80,
    unit: 'pcs',
    avgBuyPrice: 1190,
    supplierName: 'Distributor Paper Bag & Box',
    lastRestockDate: 'Minggu Lalu'
  },
  {
    id: 'ing-minyak',
    code: 'BAH-009',
    name: 'Minyak Goreng Kelapa Sawit (2L)',
    category: 'Bahan Makanan',
    stock: 14,
    minStock: 6,
    unit: 'liter',
    avgBuyPrice: 17500,
    supplierName: 'Grosir Sembako Jaya',
    lastRestockDate: 'Kemarin'
  },
  {
    id: 'ing-gas',
    code: 'BAH-010',
    name: 'Tabung Gas Elpiji 3kg / 12kg',
    category: 'Gas & Operasional',
    stock: 2,
    minStock: 2,
    unit: 'pcs',
    avgBuyPrice: 22000,
    supplierName: 'Pangkalan Gas Resmi',
    lastRestockDate: '3 Hari Lalu'
  }
];

export const INITIAL_ORDERS: OrderTicket[] = [
  {
    id: 'ord-101',
    orderNumber: 'KD-01',
    customerName: 'Dimas Prasetyo',
    customerPhone: '081234567890',
    tableNumber: 'Meja 04',
    orderType: 'Dine In',
    time: '12:15 WIB',
    createdAt: Date.now() - 1000 * 60 * 18, // 18 mins ago
    items: [
      {
        id: 'oi-1',
        menuId: 'm-1',
        menuName: 'Kopi Susu Aren Spesial',
        category: 'Kopi & Minuman',
        price: 18000,
        qty: 2,
        selectedVariants: ['Dingin (Es)', 'Normal (100%)'],
        variantPriceAddon: 0,
        notes: 'Sedotan jangan lupa',
        subtotal: 36000
      },
      {
        id: 'oi-2',
        menuId: 'm-5',
        menuName: 'Nasi Goreng Spesial Kedai',
        category: 'Makanan Utama',
        price: 25000,
        qty: 1,
        selectedVariants: ['Level 2 (Pedas)'],
        variantPriceAddon: 0,
        notes: 'Acar dipisah',
        subtotal: 25000
      }
    ],
    subtotal: 61000,
    discount: 0,
    tax: 0,
    total: 61000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    kitchenStatus: 'proses',
    cashierName: 'Rian (Kasir)',
    kitchenNotes: 'Proses masak nasi goreng tinggal plating telur',
    cashPaid: 61000,
    cashChange: 0
  },
  {
    id: 'ord-102',
    orderNumber: 'KD-02',
    customerName: 'Siti Rahmawati',
    customerPhone: '085799887766',
    tableNumber: 'Meja 02',
    orderType: 'Dine In',
    time: '12:22 WIB',
    createdAt: Date.now() - 1000 * 60 * 11, // 11 mins ago
    items: [
      {
        id: 'oi-3',
        menuId: 'm-6',
        menuName: 'Ayam Geprek Sambal Korek + Nasi',
        category: 'Makanan Utama',
        price: 22000,
        qty: 1,
        selectedVariants: ['Sambal Korek Bawang'],
        variantPriceAddon: 0,
        notes: 'Cabai jangan terlalu halus',
        subtotal: 22000
      },
      {
        id: 'oi-4',
        menuId: 'm-4',
        menuName: 'Es Teh Melati Solo Jumbo',
        category: 'Kopi & Minuman',
        price: 8000,
        qty: 1,
        selectedVariants: [],
        variantPriceAddon: 0,
        subtotal: 8000
      }
    ],
    subtotal: 30000,
    discount: 0,
    tax: 0,
    total: 30000,
    paymentMethod: 'Tunai',
    paymentStatus: 'Lunas',
    kitchenStatus: 'menunggu',
    cashierName: 'Rian (Kasir)',
    cashPaid: 50000,
    cashChange: 20000
  },
  {
    id: 'ord-103',
    orderNumber: 'KD-03',
    customerName: 'Bayu Nugroho (GrabFood)',
    customerPhone: '081388776655',
    tableNumber: 'Take Away',
    orderType: 'Online Delivery',
    time: '12:05 WIB',
    createdAt: Date.now() - 1000 * 60 * 28, // 28 mins ago
    items: [
      {
        id: 'oi-5',
        menuId: 'm-8',
        menuName: 'Dimsum Mentai Panggang (4 pcs)',
        category: 'Camilan & Snack',
        price: 23000,
        qty: 2,
        selectedVariants: [],
        variantPriceAddon: 0,
        notes: 'Saus mentai agak dibakar wangi',
        subtotal: 46000
      },
      {
        id: 'oi-6',
        menuId: 'm-2',
        menuName: 'Ice Caramel Macchiato',
        category: 'Kopi & Minuman',
        price: 24000,
        qty: 1,
        selectedVariants: ['Reguler (16oz)'],
        variantPriceAddon: 0,
        subtotal: 24000
      }
    ],
    subtotal: 70000,
    discount: 5000,
    tax: 0,
    total: 65000,
    paymentMethod: 'Transfer Bank',
    paymentStatus: 'Lunas',
    kitchenStatus: 'siap_saji',
    cashierName: 'Rian (Kasir)',
    kitchenNotes: 'Sudah dipacking dalam paper bag + kabel tis',
    cashPaid: 65000,
    cashChange: 0
  }
];

export const INITIAL_TRANSACTIONS_HISTORY: OrderTicket[] = [
  ...INITIAL_ORDERS,
  {
    id: 'ord-099',
    orderNumber: 'KD-99',
    customerName: 'Anissa Putri',
    customerPhone: '081299112233',
    tableNumber: 'Meja 07',
    orderType: 'Dine In',
    time: '11:30 WIB',
    createdAt: Date.now() - 1000 * 60 * 65,
    items: [
      {
        id: 'oi-7',
        menuId: 'm-11',
        menuName: 'Paket Hemat Kenyang 1',
        category: 'Paket Hemat',
        price: 27000,
        qty: 1,
        selectedVariants: [],
        variantPriceAddon: 0,
        subtotal: 27000
      }
    ],
    subtotal: 27000,
    discount: 0,
    tax: 0,
    total: 27000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    kitchenStatus: 'selesai',
    cashierName: 'Rian (Kasir)',
    cashPaid: 27000,
    cashChange: 0
  },
  {
    id: 'ord-098',
    orderNumber: 'KD-98',
    customerName: 'Fajar Maulana',
    customerPhone: '087711223344',
    tableNumber: 'Meja 01',
    orderType: 'Dine In',
    time: '11:10 WIB',
    createdAt: Date.now() - 1000 * 60 * 85,
    items: [
      {
        id: 'oi-8',
        menuId: 'm-7',
        menuName: 'Mie Dok-Dok Kuah Nyemek Kedai',
        category: 'Makanan Utama',
        price: 19000,
        qty: 2,
        selectedVariants: [],
        variantPriceAddon: 0,
        subtotal: 38000
      },
      {
        id: 'oi-9',
        menuId: 'm-1',
        menuName: 'Kopi Susu Aren Spesial',
        category: 'Kopi & Minuman',
        price: 18000,
        qty: 2,
        selectedVariants: ['Dingin (Es)'],
        variantPriceAddon: 0,
        subtotal: 36000
      }
    ],
    subtotal: 74000,
    discount: 0,
    tax: 0,
    total: 74000,
    paymentMethod: 'Tunai',
    paymentStatus: 'Lunas',
    kitchenStatus: 'selesai',
    cashierName: 'Rian (Kasir)',
    cashPaid: 100000,
    cashChange: 26000
  }
];

export const INITIAL_CUSTOMERS: KedaiCustomer[] = [
  {
    id: 'c-1',
    name: 'Dimas Prasetyo',
    phone: '081234567890',
    totalVisits: 14,
    totalSpend: 540000,
    points: 120,
    tier: 'Platinum',
    lastVisit: 'Hari Ini',
    favoriteMenu: 'Kopi Susu Aren Spesial',
    notes: 'Pelanggan tetap kerja remote di meja colokan'
  },
  {
    id: 'c-2',
    name: 'Siti Rahmawati',
    phone: '085799887766',
    totalVisits: 8,
    totalSpend: 285000,
    points: 65,
    tier: 'Gold',
    lastVisit: 'Hari Ini',
    favoriteMenu: 'Ayam Geprek Sambal Korek',
    notes: 'Suka level pedas sedang'
  },
  {
    id: 'c-3',
    name: 'Anissa Putri',
    phone: '081299112233',
    totalVisits: 5,
    totalSpend: 160000,
    points: 40,
    tier: 'Silver',
    lastVisit: 'Hari Ini',
    favoriteMenu: 'Paket Hemat Kenyang 1'
  },
  {
    id: 'c-4',
    name: 'Fajar Maulana',
    phone: '087711223344',
    totalVisits: 11,
    totalSpend: 420000,
    points: 95,
    tier: 'Gold',
    lastVisit: 'Hari Ini',
    favoriteMenu: 'Mie Dok-Dok Nyemek'
  }
];

export const INITIAL_VOUCHERS: KedaiVoucher[] = [
  {
    id: 'v-1',
    code: 'KEDAISANTAI',
    title: 'Diskon Santai Kopi Siang 20%',
    type: 'percent',
    value: 20,
    minSpend: 40000,
    validUntil: '31 Des 2026',
    quota: 100,
    usedCount: 34,
    isActive: true,
    notes: 'Berlaku untuk semua menu minuman'
  },
  {
    id: 'v-2',
    code: 'HEMAT10RB',
    title: 'Potongan Langsung Rp 10.000',
    type: 'nominal',
    value: 10000,
    minSpend: 50000,
    validUntil: '31 Des 2026',
    quota: 50,
    usedCount: 19,
    isActive: true,
    notes: 'Minimal belanja Rp 50.000'
  },
  {
    id: 'v-3',
    code: 'MEMBERVIP',
    title: 'Voucher Khusus Member Gold/Platinum',
    type: 'nominal',
    value: 15000,
    minSpend: 60000,
    validUntil: '31 Des 2026',
    quota: 30,
    usedCount: 12,
    isActive: true,
    notes: 'Reward penukaran 50 poin pelanggan'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'st-1',
    name: 'Budi Santoso',
    role: 'Manager',
    phone: '081233445566',
    pin: '1234',
    shift: 'Full Time',
    dailyCommission: 75000,
    ordersHandled: 42,
    rating: 4.9,
    status: 'Hadir'
  },
  {
    id: 'st-2',
    name: 'Rian Kasir Pratama',
    role: 'Kasir',
    phone: '085611223344',
    pin: '1111',
    shift: 'Pagi (08:00 - 16:00)',
    dailyCommission: 50000,
    ordersHandled: 55,
    rating: 4.8,
    status: 'Hadir'
  },
  {
    id: 'st-3',
    name: 'Gilang Barista Master',
    role: 'Barista',
    phone: '087812345678',
    pin: '2222',
    shift: 'Pagi (08:00 - 16:00)',
    dailyCommission: 65000,
    ordersHandled: 68,
    rating: 4.9,
    status: 'Hadir'
  },
  {
    id: 'st-4',
    name: 'Chef Hendra Wibowo',
    role: 'Koki Dapur',
    phone: '089912341234',
    pin: '3333',
    shift: 'Pagi (08:00 - 16:00)',
    dailyCommission: 70000,
    ordersHandled: 48,
    rating: 4.9,
    status: 'Hadir'
  },
  {
    id: 'st-5',
    name: 'Dewi Waitress',
    role: 'Waiter',
    phone: '081399881122',
    pin: '4444',
    shift: 'Malam (16:00 - 23:00)',
    dailyCommission: 45000,
    ordersHandled: 0,
    rating: 4.7,
    status: 'Shift Libur'
  }
];

export const INITIAL_SHIFTS: StaffShiftRecord[] = [
  {
    id: 'sh-1',
    staffName: 'Rian Kasir Pratama',
    role: 'Kasir',
    date: 'Hari Ini',
    shiftName: 'Shift Pagi (08:00 - 16:00)',
    clockIn: '07:50 WIB',
    status: 'Hadir Tepat Waktu'
  },
  {
    id: 'sh-2',
    staffName: 'Gilang Barista Master',
    role: 'Barista',
    date: 'Hari Ini',
    shiftName: 'Shift Pagi (08:00 - 16:00)',
    clockIn: '07:45 WIB',
    status: 'Hadir Tepat Waktu'
  },
  {
    id: 'sh-3',
    staffName: 'Chef Hendra Wibowo',
    role: 'Koki Dapur',
    date: 'Hari Ini',
    shiftName: 'Shift Pagi (08:00 - 16:00)',
    clockIn: '07:55 WIB',
    status: 'Hadir Tepat Waktu'
  }
];

export const INITIAL_COMMISSIONS: StaffCommissionRecord[] = [
  {
    id: 'com-1',
    staffId: 'st-3',
    staffName: 'Gilang Barista Master',
    date: 'Hari Ini',
    targetCount: 50,
    actualCount: 68,
    commissionPerUnit: 1000,
    totalCommission: 68000,
    status: 'Tertunda'
  },
  {
    id: 'com-2',
    staffId: 'st-4',
    staffName: 'Chef Hendra Wibowo',
    date: 'Hari Ini',
    targetCount: 40,
    actualCount: 48,
    commissionPerUnit: 1500,
    totalCommission: 72000,
    status: 'Tertunda'
  }
];

export const INITIAL_INBOUND_RECORDS: InboundStockRecord[] = [
  {
    id: 'inb-1',
    invoiceNumber: 'INV-ROAST-20261016',
    date: 'Kemarin, 14:00 WIB',
    timestamp: Date.now() - 1000 * 60 * 60 * 20,
    supplier: 'Roastery Nusantara Utama',
    ingredientName: 'Biji Kopi Arabika Robusta Blend',
    category: 'Kopi & Susu',
    qty: 5000,
    unit: 'gram',
    buyPrice: 220,
    totalCost: 1100000,
    receiver: 'Budi Santoso (Manager)',
    notes: 'Kualitas biji kopi fresh roast medium dark'
  },
  {
    id: 'inb-2',
    invoiceNumber: 'INV-SUSU-20261015',
    date: '2 Hari Lalu, 09:30 WIB',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    supplier: 'PT Diamond Susu Sejahtera',
    ingredientName: 'Susu UHT Fresh Full Cream (1L)',
    category: 'Kopi & Susu',
    qty: 24,
    unit: 'liter',
    buyPrice: 16000,
    totalCost: 384000,
    receiver: 'Rian Kasir Pratama',
    notes: 'Expired date aman 9 bulan ke depan'
  }
];

export const INITIAL_OPNAME_RECORDS: StockOpnameRecord[] = [
  {
    id: 'op-1',
    date: 'Kemarin Sore, 17:00 WIB',
    timestamp: Date.now() - 1000 * 60 * 60 * 18,
    ingredientId: 'ing-cup',
    ingredientName: 'Cup Dingin 16oz Sablon + Lid',
    systemStock: 355,
    physicalStock: 350,
    difference: -5,
    unit: 'pcs',
    reason: '5 cup rusak terjatuh saat barista rush hour',
    checkedBy: 'Gilang Barista'
  }
];

export const INITIAL_STORE_PROFILE: StoreProfile = {
  name: 'KedaiQu Coffee & Eatery',
  tagline: 'Kopi Nusantara, Kuliner Istimewa & Suasana Hangat',
  address: 'Jl. Ahmad Yani No. 88, Kota Wisata Kuliner, Indonesia',
  phone: '0812-3456-7890',
  footerMessage: 'Terima Kasih Atas Kunjungan Anda! Follow IG: @kedaiqu.id',
  paperWidth: '58mm',
  taxRate: 0,
  serviceRate: 0,
  qrisMerchantName: 'KEDAIQU COFFEE & EATERY'
};

export const INITIAL_GEMINI_CONFIG: GeminiApiConfig = {
  apiKey: '',
  model: 'gemini-2.5-flash',
  isConnected: true,
  lastTested: 'Aktif Otomatis (Server-side Gemini SDK)',
  testResponse: 'Koneksi Gemini AI 2.5 Flash Aktif. Siap membantu pembuatan deskripsi menu lezat & rekomendasi promo!'
};
