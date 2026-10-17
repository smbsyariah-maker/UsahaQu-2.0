// src/services/pelangganService.ts - Database & Management Pelanggan
export interface CustomerTransactionInput {
  name?: string;
  phone: string;
  total_spent: number;
  favorite_item?: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  total_orders: number;
  totalVisits?: number;
  total_spent: number;
  totalSpend?: number;
  points: number;
  favorite_item: string;
  favoriteMenu?: string;
  last_visit: string;
  lastVisit?: string;
  tier?: 'Silver' | 'Gold' | 'Platinum';
  notes?: string;
}

export const PelangganService = {

  // Auto-save / Sync Pelanggan Setiap Selesai Transaksi di Kasir
  syncFromTransaction(customerInput: CustomerTransactionInput): CustomerRecord[] | void {
    if (!customerInput.phone) return;

    let customers: CustomerRecord[] = JSON.parse(
      localStorage.getItem('kq_pelanggan') || localStorage.getItem('kq_customers') || '[]'
    );
    const index = customers.findIndex(c => c.phone.trim() === customerInput.phone.trim());

    const pointsEarned = Math.floor((customerInput.total_spent || 0) / 10000); // 1 poin per Rp10.000

    if (index !== -1) {
      // Update Pelanggan Lama
      const existing = customers[index];
      const newOrders = (existing.total_orders || existing.totalVisits || 0) + 1;
      const newSpent = (existing.total_spent || existing.totalSpend || 0) + customerInput.total_spent;
      const newPoints = (existing.points || 0) + pointsEarned;

      existing.total_orders = newOrders;
      existing.totalVisits = newOrders;
      existing.total_spent = newSpent;
      existing.totalSpend = newSpent;
      existing.points = newPoints;
      existing.last_visit = new Date().toISOString();
      existing.lastVisit = 'Hari Ini';
      if (newPoints >= 100) existing.tier = 'Platinum';
      else if (newPoints >= 50) existing.tier = 'Gold';
      else existing.tier = 'Silver';

      if (customerInput.name && (!existing.name || existing.name === 'Pelanggan Kedai')) {
        existing.name = customerInput.name;
      }
      if (customerInput.favorite_item) {
        existing.favorite_item = customerInput.favorite_item;
        existing.favoriteMenu = customerInput.favorite_item;
      }
    } else {
      // Tambah Pelanggan Baru
      const newCust: CustomerRecord = {
        id: "CUST-" + Date.now(),
        name: customerInput.name || "Pelanggan Kedai",
        phone: customerInput.phone,
        total_orders: 1,
        totalVisits: 1,
        total_spent: customerInput.total_spent || 0,
        totalSpend: customerInput.total_spent || 0,
        points: pointsEarned,
        favorite_item: customerInput.favorite_item || "-",
        favoriteMenu: customerInput.favorite_item || "-",
        last_visit: new Date().toISOString(),
        lastVisit: 'Hari Ini',
        tier: pointsEarned >= 100 ? 'Platinum' : pointsEarned >= 50 ? 'Gold' : 'Silver'
      };
      customers.push(newCust);
    }

    localStorage.setItem('kq_pelanggan', JSON.stringify(customers));
    localStorage.setItem('kq_customers', JSON.stringify(customers));
    return customers;
  },

  // Mengambil Semua Data Pelanggan
  getAllCustomers(): CustomerRecord[] {
    return JSON.parse(
      localStorage.getItem('kq_pelanggan') || localStorage.getItem('kq_customers') || '[]'
    );
  },

  // Generasi Link WA Direct untuk Struk / Promo
  createWALink(phone: string, message: string): string {
    if (!phone) return '';
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
};
