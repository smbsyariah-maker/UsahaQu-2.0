// src/config/sembakoQuNav.ts - Dynamic Navigation Config SembakoQu with TypeScript
import { KedaiQuNavModule } from './kedaiQuNav';

export const SEMBAKOQU_NAV: KedaiQuNavModule[] = [
  {
    id: "order",
    title: "Kasir Toko",
    icon: "cart-outline",
    color: "#2563EB",
    description: "Kasir kilat minimarket/warung sembako, pencatatan bon/kasbon langganan, dan barcode scan.",
    sub_menus: [
      { id: "order_pos", title: "Kasir Cepat & Barcode", mode: "HYBRID", subtitle: "Transaksi Belanja Sembako", badge: "POS" },
      { id: "antrian_dapur", title: "Daftar Belanja & Packing", subtitle: "Antrian Packing & Pengambilan", badge: "Packing" },
      { id: "riwayat_transaksi", title: "Nota Belanja & Kasbon", subtitle: "Riwayat Transaksi & Piutang" }
    ]
  },
  {
    id: "menu_makanan",
    title: "Barang Dagangan",
    icon: "pricetags-outline",
    color: "#D97706",
    description: "Katalog sembako, multi-satuan renceng/dus/saset/kg, harga grosir vs eceran.",
    sub_menus: [
      { id: "katalog_menu", title: "Katalog Sembako & Kelontong", subtitle: "Daftar Barang & Barcode" },
      { id: "varian_porsi", title: "Satuan Multi-Kemasan (Dus/Renceng)", subtitle: "Konversi Satuan Jual" },
      { id: "resep_hpp", title: "Margin Laba & Harga Modal", subtitle: "Penetapan Margin Grosir & Ecer" }
    ]
  },
  {
    id: "stok_bahan",
    title: "Gudang & Stok",
    icon: "cube-outline",
    color: "#059669",
    description: "Persediaan komoditas beras, minyak goreng, gula pasir, telur, dan peringatan stok menipis.",
    sub_menus: [
      { id: "data_bahan", title: "Stok Beras, Minyak, Telur", subtitle: "Kartu Stok Barang Komoditas" },
      { id: "stok_inbound", title: "Barang Masuk dari Sales", subtitle: "Penerimaan Barang Supplier" },
      { id: "stok_opname", title: "Opname & Alert Menipis", subtitle: "Cek Fisik & Peringatan Kadaluarsa" }
    ]
  },
  {
    id: "marketing_pelanggan",
    title: "Langganan & Bon",
    icon: "people-outline",
    color: "#7C3AED",
    description: "Buku kasbon hutang langganan warga, broadcast info harga sembako baru, dan kupon belanja.",
    sub_menus: [
      { id: "database_pelanggan", title: "Data Langganan & Saldo Hutang", subtitle: "Buku Bon & Limit Piutang" },
      { id: "broadcast_wa", title: "Info Pasokan Baru via WA", subtitle: "Broadcast Promo & Kedatangan Beras" },
      { id: "voucher_diskon", title: "Harga Khusus Reseller", subtitle: "Diskon Belanja Partai Besar" }
    ]
  },
  {
    id: "karyawan",
    title: "Penjaga Toko",
    icon: "briefcase-outline",
    color: "#0891B2",
    description: "Shift jaga toko, penjaga kasir, dan komisi target penjualan bulanan warung.",
    sub_menus: [
      { id: "data_staff", title: "Karyawan & Akses Kasir", subtitle: "Staff Toko & Hak Akses" },
      { id: "absensi_shift", title: "Jadwal Jaga Pagi/Malam", subtitle: "Shift Kerja Toko" },
      { id: "komisi_staff", title: "Bonus Target Penjualan", subtitle: "Reward Penjaga Toko" }
    ]
  },
  {
    id: "laporan",
    title: "Laporan Toko",
    icon: "bar-chart-outline",
    color: "#EA580C",
    description: "Omzet harian, profit margin kotor & bersih, serta buku kas harian.",
    sub_menus: [
      { id: "ringkasan_omzet", title: "Omzet & Laba Bersih", subtitle: "Rekap Penjualan Harian" },
      { id: "analisa_menu", title: "Produk Paling Laris", subtitle: "Barang Tercepat Terjual" },
      { id: "kas_harian", title: "Buku Kas & Rekap Bon", subtitle: "Penerimaan Kas & Pelunasan Bon" }
    ]
  },
  {
    id: "pengaturan",
    title: "Pengaturan",
    icon: "settings-outline",
    color: "#4B5563",
    description: "Data toko, konfigurasi printer nota, dan backup safety hub.",
    sub_menus: [
      { id: "profil_usaha", title: "Profil Warung & Rekening", subtitle: "Nama Toko, Rekening & Info" },
      { id: "printer_struk", title: "Ukuran Kertas Thermal Struk", subtitle: "Kertas 58mm / 80mm" },
      { id: "safety_backup", title: "Safety Hub (Backup & Reset)", subtitle: "Pusat Pengamanan Data" }
    ]
  }
];
