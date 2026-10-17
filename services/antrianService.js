// services/antrianService.js - Live Queue Kitchen/Bar
export const AntrianService = {

  // Tambah pesanan baru dari Smart Order ke Antrian Dapur
  addOrderToQueue(orderData) {
    let queue = JSON.parse(localStorage.getItem('kq_antrian') || '[]');
    const newQueueItem = {
      order_id: orderData.order_id || ("KQU-" + Date.now().toString().slice(-6)),
      created_at: orderData.created_at || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      table_number: orderData.table_number || "-",
      order_type: orderData.order_type || "DINE_IN",
      items: orderData.items || [],
      customer_name: orderData.customer_name || orderData.customerName || "Pelanggan",
      status: orderData.status || "WAITING" // WAITING -> COOKING -> READY -> COMPLETED
    };

    queue.push(newQueueItem);
    localStorage.setItem('kq_antrian', JSON.stringify(queue));
    return newQueueItem;
  },

  // Update Status Antrian Pesanan (misal: Chef menekan tombol "Siap Saji")
  updateStatus(orderId, newStatus) {
    let queue = JSON.parse(localStorage.getItem('kq_antrian') || '[]');
    const idx = queue.findIndex(q => q.order_id === orderId || q.id === orderId);
    if (idx !== -1) {
      queue[idx].status = newStatus;
      localStorage.setItem('kq_antrian', JSON.stringify(queue));
    }
    return queue;
  },

  // Mengambil Semua Antrian Aktif
  getQueue() {
    let queue = JSON.parse(localStorage.getItem('kq_antrian') || '[]');
    if (queue.length === 0) {
      const orders = JSON.parse(localStorage.getItem('kq_transaksi') || localStorage.getItem('kq_orders') || '[]');
      if (orders.length > 0) {
        queue = orders.map(ord => ({
          order_id: ord.orderNumber || ord.id,
          created_at: ord.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          table_number: ord.tableNumber || "-",
          order_type: ord.orderType || "DINE_IN",
          items: (ord.items || []).map(i => ({
            item_name: i.menuName || i.item_name,
            qty: i.qty,
            variant: Array.isArray(i.selectedVariants) ? i.selectedVariants.join(', ') : (i.variant || ''),
            notes: i.notes || ''
          })),
          customer_name: ord.customerName || "Pelanggan",
          status: ord.kitchenStatus === 'proses' ? 'COOKING' : ord.kitchenStatus === 'siap_saji' ? 'READY' : ord.kitchenStatus === 'selesai' ? 'COMPLETED' : 'WAITING'
        }));
        localStorage.setItem('kq_antrian', JSON.stringify(queue));
      }
    }
    return queue;
  },

  // Membersihkan antrian dapur
  clearQueue() {
    localStorage.setItem('kq_antrian', '[]');
    return [];
  }
};
