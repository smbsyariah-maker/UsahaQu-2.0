// src/config/kedaiQuNav.ts - Dynamic Navigation Config KedaiQu with TypeScript types
export interface KedaiQuSubMenu {
  id: string;
  title: string;
  mode?: string;
  subtitle?: string;
  badge?: string;
}

export interface KedaiQuNavModule {
  id: string;
  title: string;
  icon: string;
  color: string;
  description?: string;
  sub_menus: KedaiQuSubMenu[];
}

export const KEDAIQU_NAV: KedaiQuNavModule[] = [
  {
    id: "order",
    title: "Order",
    icon: "restaurant-outline",
    color: "#2563EB",
    description: "Kasir POS cerdas hybrid, antrian langsung dapur / bar, dan cetak struk pembayaran.",
    sub_menus: [
      { 
        id: "order_pos", 
        title: "Smart & Manual Kasir", 
        mode: "HYBRID",
        subtitle: "Input Pesanan Meja / Takeaway & Pembayaran",
        badge: "POS"
      },
      { 
        id: "antrian_dapur", 
        title: "Antrian Live Dapur / Bar",
        subtitle: "Kitchen Display System (KDS) & Bar Monitor",
        badge: "Live KDS"
      },
      { 
        id: "riwayat_transaksi", 
        title: "Riwayat & Cetak Struk",
        subtitle: "Daftar Transaksi, Cetak Ulang & Kirim WA",
        badge: "Struk"
      }
    ]
  },
  {
    id: "menu_makanan",
    title: "Menu Makanan",
    icon: "fast-food-outline",
    color: "#D97706",
    description: "Manajemen katalog menu makanan minuman, multi-varian porsi, dan kalkulasi HPP resep.",
    sub_menus: [
      { 
        id: "katalog_menu", 
        title: "Katalog Makanan & Minuman",
        subtitle: "Daftar Menu, Harga Jual & Status Tersedia/Habis",
        badge: "Master Menu"
      },
      { 
        id: "varian_porsi", 
        title: "Multi-Varian & Porsi",
        subtitle: "Porsi Jumbo, Suhu Es/Panas, Level Pedas & Topping",
        badge: "Varian"
      },
      { 
        id: "resep_hpp", 
        title: "Resep & HPP Base",
        subtitle: "Food Costing, Komposisi Bahan & Margin Laba",
        badge: "HPP"
      }
    ]
  },
  {
    id: "stok_bahan",
    title: "Stok / Bahan",
    icon: "cube-outline",
    color: "#059669",
    description: "Monitoring inventaris bahan baku dapur & bar, entry belanja supplier, dan stok opname.",
    sub_menus: [
      { 
        id: "data_bahan", 
        title: "Data Bahan Baku",
        subtitle: "Database Bahan Mentah, Satuan & Harga Beli",
        badge: "Bahan"
      },
      { 
        id: "stok_inbound", 
        title: "Entry Stok Masuk (Belanja)",
        subtitle: "Pencatatan Belanja Pasar / Pasokan Suplier",
        badge: "Restock"
      },
      { 
        id: "stok_opname", 
        title: "Opname & Alert Stok Menipis",
        subtitle: "Cek Selisih Fisik & Notifikasi Stok Kritis",
        badge: "Audit"
      }
    ]
  },
  {
    id: "marketing_pelanggan",
    title: "Marketing & Pelanggan",
    icon: "people-outline",
    color: "#7C3AED",
    description: "Database loyalitas pelanggan, promosi otomatis via WhatsApp, dan voucher diskon.",
    sub_menus: [
      { 
        id: "database_pelanggan", 
        title: "Database Pelanggan & Poin",
        subtitle: "Member CRM, Riwayat Kunjungan & Reward Poin",
        badge: "CRM"
      },
      { 
        id: "broadcast_wa", 
        title: "Broadcast WA Promo",
        subtitle: "Kirim Promo Personal Otomatis ke WhatsApp",
        badge: "WhatsApp"
      },
      { 
        id: "voucher_diskon", 
        title: "Voucher & Diskon Member",
        subtitle: "Kode Kupon Diskon Persen / Nominal Belanja",
        badge: "Diskon"
      }
    ]
  },
  {
    id: "karyawan",
    title: "Karyawan",
    icon: "briefcase-outline",
    color: "#0891B2",
    description: "Pengelolaan staf kasir, barista, koki dapur, jadwal shift kerja, dan komisi insentif.",
    sub_menus: [
      { 
        id: "data_staff", 
        title: "Data Staff & Hak Akses",
        subtitle: "Data Barista, Koki, Kasir & PIN Akses",
        badge: "Staff"
      },
      { 
        id: "absensi_shift", 
        title: "Absensi & Shift Kerja",
        subtitle: "Jadwal Shift Pagi/Sore & Log Kehadiran",
        badge: "Shift"
      },
      { 
        id: "komisi_staff", 
        title: "Komisi / Bagi Hasil",
        subtitle: "Perhitungan Insentif Target Menu & Tip",
        badge: "Komisi"
      }
    ]
  },
  {
    id: "laporan",
    title: "Laporan",
    icon: "bar-chart-outline",
    color: "#DC2626",
    description: "Rekapitulasi omzet penjualan, laba kotor, laba bersih, dan analisis performa menu terlaris.",
    sub_menus: [
      { 
        id: "lap_omzet", 
        title: "Laporan Omzet & Laba Rugi",
        subtitle: "Ringkasan Penjualan, HPP, Biaya & Laba Bersih",
        badge: "Finansial"
      },
      { 
        id: "top_selling", 
        title: "Analisis Menu Terlaris",
        subtitle: "Peringkat Menu Paling Laku & Kontribusi Margin",
        badge: "Analisis"
      }
    ]
  },
  {
    id: "pengaturan",
    title: "Pengaturan & Data",
    icon: "settings-outline",
    color: "#4B5563",
    description: "Pengaturan profil kedai, printer thermal bluetooth 58/80mm, Gemini AI, dan data safety.",
    sub_menus: [
      { 
        id: "profil_kedai", 
        title: "Profil Toko & Printer Thermal",
        subtitle: "Nama Kedai, Alamat, Header/Footer & Cetak Struk",
        badge: "Printer"
      },
      { 
        id: "api_gemini", 
        title: "Konfigurasi Gemini API Key",
        subtitle: "Status Server Gemini AI, Key Test & AI Assistant",
        badge: "Gemini AI"
      },
      { 
        id: "data_safety_hub", 
        title: "Backup, Restore & Reset Data",
        subtitle: "Unduh Backup JSON, Impor Data & Reset Aman",
        badge: "Backup"
      }
    ]
  }
];
