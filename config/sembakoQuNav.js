// config/sembakoQuNav.js - Dynamic Navigation Config SembakoQu
export const SEMBAKOQU_NAV = [
  {
    id: "order",
    title: "Kasir Toko",
    icon: "cart-outline",
    color: "#2563EB",
    sub_menus: [
      { id: "order_pos", title: "Kasir Cepat & Barcode", mode: "HYBRID" },
      { id: "antrian_dapur", title: "Daftar Belanja & Packing" },
      { id: "riwayat_transaksi", title: "Nota Belanja & Kasbon" }
    ]
  },
  {
    id: "menu_makanan",
    title: "Barang Dagangan",
    icon: "pricetags-outline",
    color: "#D97706",
    sub_menus: [
      { id: "katalog_menu", title: "Katalog Sembako & Kelontong" },
      { id: "varian_porsi", title: "Satuan Multi-Kemasan (Dus/Renceng)" },
      { id: "resep_hpp", title: "Margin Laba & Harga Modal" }
    ]
  },
  {
    id: "stok_bahan",
    title: "Gudang & Stok",
    icon: "cube-outline",
    color: "#059669",
    sub_menus: [
      { id: "data_bahan", title: "Stok Beras, Minyak, Telur" },
      { id: "stok_inbound", title: "Barang Masuk dari Sales" },
      { id: "stok_opname", title: "Opname & Alert Menipis" }
    ]
  },
  {
    id: "marketing_pelanggan",
    title: "Langganan & Bon",
    icon: "people-outline",
    color: "#7C3AED",
    sub_menus: [
      { id: "database_pelanggan", title: "Data Langganan & Saldo Hutang" },
      { id: "broadcast_wa", title: "Info Pasokan Baru via WA" },
      { id: "voucher_diskon", title: "Harga Khusus Reseller" }
    ]
  },
  {
    id: "karyawan",
    title: "Penjaga Toko",
    icon: "briefcase-outline",
    color: "#0891B2",
    sub_menus: [
      { id: "data_staff", title: "Karyawan & Akses Kasir" },
      { id: "absensi_shift", title: "Jadwal Jaga Pagi/Malam" },
      { id: "komisi_staff", title: "Bonus Target Penjualan" }
    ]
  },
  {
    id: "laporan",
    title: "Laporan Toko",
    icon: "bar-chart-outline",
    color: "#EA580C",
    sub_menus: [
      { id: "ringkasan_omzet", title: "Omzet & Laba Bersih" },
      { id: "analisa_menu", title: "Produk Paling Laris" },
      { id: "kas_harian", title: "Buku Kas & Rekap Bon" }
    ]
  },
  {
    id: "pengaturan",
    title: "Pengaturan",
    icon: "settings-outline",
    color: "#4B5563",
    sub_menus: [
      { id: "profil_usaha", title: "Profil Warung & Rekening" },
      { id: "printer_struk", title: "Ukuran Kertas Thermal Struk" },
      { id: "safety_backup", title: "Safety Hub (Backup & Reset)" }
    ]
  }
];
