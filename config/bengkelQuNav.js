// config/bengkelQuNav.js - Dynamic Navigation Config BengkelQu
export const BENGKELQU_NAV = [
  {
    id: "order",
    title: "Servis & Kasir",
    icon: "construct-outline",
    color: "#2563EB",
    sub_menus: [
      { id: "order_pos", title: "SPK & Kasir Servis", mode: "HYBRID" },
      { id: "antrian_dapur", title: "Antrian Mekanik & Pit" },
      { id: "riwayat_transaksi", title: "Riwayat Nota & Garansi" }
    ]
  },
  {
    id: "menu_makanan",
    title: "Sparepart & Jasa",
    icon: "hardware-chip-outline",
    color: "#D97706",
    sub_menus: [
      { id: "katalog_menu", title: "Katalog Sparepart & Oli" },
      { id: "varian_porsi", title: "Merk Motor / Mobil & Grade" },
      { id: "resep_hpp", title: "Tarif Jasa & Estimasi Waktu" }
    ]
  },
  {
    id: "stok_bahan",
    title: "Gudang Part",
    icon: "cube-outline",
    color: "#059669",
    sub_menus: [
      { id: "data_bahan", title: "Daftar Suku Cadang" },
      { id: "stok_inbound", title: "Kulakan / PO Distributor" },
      { id: "stok_opname", title: "Opname & Alert Oli Menipis" }
    ]
  },
  {
    id: "marketing_pelanggan",
    title: "Pelanggan & Nopol",
    icon: "people-outline",
    color: "#7C3AED",
    sub_menus: [
      { id: "database_pelanggan", title: "Data Nopol & Pemilik" },
      { id: "broadcast_wa", title: "WA Reminder Servis / Ganti Oli" },
      { id: "voucher_diskon", title: "Kupon Servis Berkala" }
    ]
  },
  {
    id: "karyawan",
    title: "Mekanik & Staff",
    icon: "briefcase-outline",
    color: "#0891B2",
    sub_menus: [
      { id: "data_staff", title: "Data Mekanik & Kepala Bengkel" },
      { id: "absensi_shift", title: "Jadwal Pit & Shift" },
      { id: "komisi_staff", title: "Bagi Hasil Jasa Servis" }
    ]
  },
  {
    id: "laporan",
    title: "Laporan Bengkel",
    icon: "bar-chart-outline",
    color: "#EA580C",
    sub_menus: [
      { id: "ringkasan_omzet", title: "Laba Rugi Part vs Jasa" },
      { id: "analisa_menu", title: "Fast Moving Part & Oli" },
      { id: "kas_harian", title: "Kas Masuk / Kas Bon" }
    ]
  },
  {
    id: "pengaturan",
    title: "Pengaturan",
    icon: "settings-outline",
    color: "#4B5563",
    sub_menus: [
      { id: "profil_usaha", title: "Profil Bengkel & Garansi" },
      { id: "printer_struk", title: "Setting Thermal & Nota PK" },
      { id: "safety_backup", title: "Safety Hub (Backup & Reset)" }
    ]
  }
];
