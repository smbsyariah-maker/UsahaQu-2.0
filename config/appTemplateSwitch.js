// config/appTemplateSwitch.js - Master Switch Controller
import { KEDAIQU_NAV } from './kedaiQuNav.js';
import { BENGKELQU_NAV } from './bengkelQuNav.js';
import { SEMBAKOQU_NAV } from './sembakoQuNav.js';

export const AppTemplateSwitcher = {
  
  // Lista Varian Template yang Tersedia
  availableTemplates: [
    { id: 'kedaiqu', name: 'KedaiQu', icon: 'restaurant-outline', desc: 'Kuliner, Kedai, Resto & Warkop' },
    { id: 'bengkelqu', name: 'BengkelQu', icon: 'construct-outline', desc: 'Bengkel Motor, Mobil & Servis' },
    { id: 'sembakoqu', name: 'SembakoQu', icon: 'cart-outline', desc: 'Warung Sembako & Kelontong' }
  ],

  // 1. Ambil Template Aktif (Default: KedaiQu)
  getActiveTemplate() {
    const activeKey = localStorage.getItem('active_app_template') || 'kedaiqu';
    
    switch (activeKey) {
      case 'bengkelqu':
        return {
          id: 'bengkelqu',
          name: 'BengkelQu',
          navigation: BENGKELQU_NAV,
          term_item: 'Sparepart & Jasa',
          term_queue: 'Antrian Mekanik',
          units: ['Pcs', 'Set', 'Liter', 'Jasa', 'Botol', 'Paket']
        };
      case 'sembakoqu':
        return {
          id: 'sembakoqu',
          name: 'SembakoQu',
          navigation: SEMBAKOQU_NAV,
          term_item: 'Barang / Produk',
          term_queue: 'Daftar Belanja',
          units: ['Saset', 'Renteng', 'Dus', 'Pcs', 'Kg', 'Gram', 'Pack', 'Liter']
        };
      case 'kedaiqu':
      default:
        return {
          id: 'kedaiqu',
          name: 'KedaiQu',
          navigation: KEDAIQU_NAV,
          term_item: 'Menu Makanan & Minuman',
          term_queue: 'Antrian Dapur / Bar',
          units: ['Porsi', 'Bungkus', 'Cangkir', 'Gelas', 'Pack', 'Botol', 'Kg']
        };
    }
  },

  // 2. Fungsi Eksekusi Switch Varian Usaha
  switchTemplate(templateKey) {
    if (!this.availableTemplates.find(t => t.id === templateKey)) {
      return { success: false, message: "Template varian tidak ditemukan!" };
    }
    
    localStorage.setItem('active_app_template', templateKey);
    
    // Refresh state/UI secara instan tanpa kehilangan data
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
    
    return { success: true };
  }
};
