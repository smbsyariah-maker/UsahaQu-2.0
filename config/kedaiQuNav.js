// config/kedaiQuNav.js - Dynamic Navigation Config KedaiQu
export const KEDAIQU_NAV = [
  {
    id: "order",
    title: "Order",
    icon: "restaurant-outline",
    color: "#2563EB",
    sub_menus: [
      { id: "order_pos", title: "Smart & Manual Kasir", mode: "HYBRID" },
      { id: "antrian_dapur", title: "Antrian Live Dapur / Bar" },
      { id: "riwayat_transaksi", title: "Riwayat & Cetak Struk" }
    ]
  },
  {
    id: "menu_makanan",
    title: "Menu Makanan",
    icon: "fast-food-outline",
    color: "#D97706",
    sub_menus: [
      { id: "katalog_menu", title: "Katalog Makanan & Minuman" },
      { id: "varian_porsi", title: "Multi-Varian & Porsi" },
      { id: "resep_hpp", title: "Resep & HPP Base" }
    ]
  },
  {
    id: "stok_bahan",
    title: "Stok / Bahan",
    icon: "cube-outline",
    color: "#059669",
    sub_menus: [
      { id: "data_bahan", title: "Data Bahan Baku" },
      { id: "stok_inbound", title: "Entry Stok Masuk (Belanja)" },
      { id: "stok_opname", title: "Opname & Alert Stok Menipis" }
    ]
  },
  {
    id: "marketing_pelanggan",
    title: "Marketing & Pelanggan",
    icon: "people-outline",
    color: "#7C3AED",
    sub_menus: [
      { id: "database_pelanggan", title: "Database Pelanggan & Poin" },
      { id: "broadcast_wa", title: "Broadcast WA Promo" },
      { id: "voucher_diskon", title: "Voucher & Diskon Member" }
    ]
  },
  {
    id: "karyawan",
    title: "Karyawan",
    icon: "briefcase-outline",
    color: "#0891B2",
    sub_menus: [
      { id: "data_staff", title: "Data Staff & Hak Akses" },
      { id: "absensi_shift", title: "Absensi & Shift Kerja" },
      { id: "komisi_staff", title: "Komisi / Bagi Hasil" }
    ]
  },
  {
    id: "laporan",
    title: "Laporan",
    icon: "bar-chart-outline",
    color: "#DC2626",
    sub_menus: [
      { id: "lap_omzet", title: "Laporan Omzet & Laba Rugi" },
      { id: "top_selling", title: "Analisis Menu Terlaris" }
    ]
  },
  {
    id: "pengaturan",
    title: "Pengaturan & Data",
    icon: "settings-outline",
    color: "#4B5563",
    sub_menus: [
      { id: "profil_kedai", title: "Profil Toko & Printer Thermal" },
      { id: "api_gemini", title: "Konfigurasi Gemini API Key" },
      { id: "data_safety_hub", title: "Backup, Restore & Reset Data" }
    ]
  }
];
