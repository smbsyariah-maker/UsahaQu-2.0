// src/config/bengkelQuNav.ts - Dynamic Navigation Config BengkelQu with TypeScript
import { KedaiQuNavModule } from './kedaiQuNav';

export const BENGKELQU_NAV: KedaiQuNavModule[] = [
  {
    id: "order",
    title: "Servis & Kasir",
    icon: "construct-outline",
    color: "#2563EB",
    description: "SPK mekanik, antrian servis motor/mobil, dan kasir pembayaran suku cadang & jasa.",
    sub_menus: [
      { id: "order_pos", title: "SPK & Kasir Servis", mode: "HYBRID", subtitle: "Input Servis & Penjualan Part", badge: "POS" },
      { id: "antrian_dapur", title: "Antrian Mekanik & Pit", subtitle: "Monitor Pengerjaan Teknisi", badge: "Live Pit" },
      { id: "riwayat_transaksi", title: "Riwayat Nota & Garansi", subtitle: "Rekap Invoice & Klaim Servis" }
    ]
  },
  {
    id: "menu_makanan",
    title: "Sparepart & Jasa",
    icon: "hardware-chip-outline",
    color: "#D97706",
    description: "Katalog suku cadang, oli, ban, serta tarif jasa mekanik dan paket servis.",
    sub_menus: [
      { id: "katalog_menu", title: "Katalog Sparepart & Oli", subtitle: "Daftar Item & Harga Jual" },
      { id: "varian_porsi", title: "Merk Motor / Mobil & Grade", subtitle: "Kategori Kendaraan" },
      { id: "resep_hpp", title: "Tarif Jasa & Estimasi Waktu", subtitle: "Standar Ongkos Kerja Mekanik" }
    ]
  },
  {
    id: "stok_bahan",
    title: "Gudang Part",
    icon: "cube-outline",
    color: "#059669",
    description: "Manajemen persediaan suku cadang, oli, fast-moving parts, dan penerimaan barang.",
    sub_menus: [
      { id: "data_bahan", title: "Daftar Suku Cadang", subtitle: "Monitoring Stok Fisik Part" },
      { id: "stok_inbound", title: "Kulakan / PO Distributor", subtitle: "Penerimaan Part dari Supplier" },
      { id: "stok_opname", title: "Opname & Alert Oli Menipis", subtitle: "Peringatan Stok Kurang" }
    ]
  },
  {
    id: "marketing_pelanggan",
    title: "Pelanggan & Nopol",
    icon: "people-outline",
    color: "#7C3AED",
    description: "Database kendaraan, riwayat kilometer, pengingat servis berkala dan ganti oli via WhatsApp.",
    sub_menus: [
      { id: "database_pelanggan", title: "Data Nopol & Pemilik", subtitle: "Buku Service Pelanggan" },
      { id: "broadcast_wa", title: "WA Reminder Servis / Ganti Oli", subtitle: "Broadcast Jadwal Tune Up" },
      { id: "voucher_diskon", title: "Kupon Servis Berkala", subtitle: "Promo Diskon Jasa / Oli" }
    ]
  },
  {
    id: "karyawan",
    title: "Mekanik & Staff",
    icon: "briefcase-outline",
    color: "#0891B2",
    description: "Bagi hasil komisi servis mekanik, pembagian pit servis, dan presensi bengkel.",
    sub_menus: [
      { id: "data_staff", title: "Data Mekanik & Kepala Bengkel", subtitle: "Daftar Teknisi Aktif" },
      { id: "absensi_shift", title: "Jadwal Pit & Shift", subtitle: "Jadwal Masuk & Libur" },
      { id: "komisi_staff", title: "Bagi Hasil Jasa Servis", subtitle: "Hitung Komisi Mekanik" }
    ]
  },
  {
    id: "laporan",
    title: "Laporan Bengkel",
    icon: "bar-chart-outline",
    color: "#EA580C",
    description: "Laporan keuangan, omzet suku cadang vs jasa, performa teknisi, dan kas harian.",
    sub_menus: [
      { id: "ringkasan_omzet", title: "Laba Rugi Part vs Jasa", subtitle: "Grafik Pendapatan Bengkel" },
      { id: "analisa_menu", title: "Fast Moving Part & Oli", subtitle: "Part Paling Laris & Mutasi" },
      { id: "kas_harian", title: "Kas Masuk / Kas Bon", subtitle: "Arus Kas Harian & Kasbon" }
    ]
  },
  {
    id: "pengaturan",
    title: "Pengaturan",
    icon: "settings-outline",
    color: "#4B5563",
    description: "Konfigurasi nota bengkel, syarat garansi servis, dan backup data aman.",
    sub_menus: [
      { id: "profil_usaha", title: "Profil Bengkel & Garansi", subtitle: "Nama Bengkel, Alamat & Logo" },
      { id: "printer_struk", title: "Setting Thermal & Nota PK", subtitle: "Format Struk & Footer Garansi" },
      { id: "safety_backup", title: "Safety Hub (Backup & Reset)", subtitle: "Ekspor & Pulihkan Basis Data" }
    ]
  }
];
