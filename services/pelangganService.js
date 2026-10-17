// services/pelangganService.js - Database & Management Pelanggan
export const PelangganService = {

  // Auto-save / Sync Pelanggan Setiap Selesai Transaksi di Kasir
  syncFromTransaction(customerInput) {
    if (!customerInput.phone) return;

    let customers = JSON.parse(localStorage.getItem('kq_pelanggan') || '[]');
    const index = customers.findIndex(c => c.phone === customerInput.phone);

    const pointsEarned = Math.floor((customerInput.total_spent || 0) / 10000); // 1 poin per Rp10.000

    if (index !== -1) {
      // Update Pelanggan Lama
      customers[index].total_orders = (customers[index].total_orders || customers[index].totalVisits || 0) + 1;
      customers[index].totalVisits = customers[index].total_orders;
      customers[index].total_spent = (customers[index].total_spent || customers[index].totalSpend || 0) + customerInput.total_spent;
      customers[index].totalSpend = customers[index].total_spent;
      customers[index].points = (customers[index].points || 0) + pointsEarned;
      customers[index].last_visit = new Date().toISOString();
      customers[index].lastVisit = 'Hari Ini';
      if (customerInput.name && (!customers[index].name || customers[index].name === 'Pelanggan Kedai')) {
        customers[index].name = customerInput.name;
      }
      if (customerInput.favorite_item) {
        customers[index].favorite_item = customerInput.favorite_item;
        customers[index].favoriteMenu = customerInput.favorite_item;
      }
    } else {
      // Tambah Pelanggan Baru
      const newCust = {
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
  getAllCustomers() {
    return JSON.parse(localStorage.getItem('kq_pelanggan') || localStorage.getItem('kq_customers') || '[]');
  },

  // Generasi Link WA Direct untuk Struk / Promo
  createWALink(phone, message) {
    if (!phone) return '';
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
};
