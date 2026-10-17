// src/services/dataManager.ts - Safety Hub (Backup, Restore, Reset) for KedaiQu
export interface BackupMetadata {
  app_id: string;
  version: string;
  exported_at: string;
}

export interface BackupDatabase {
  profil: any;
  katalog: any[];
  stok: any[];
  pelanggan: any[];
  transaksi: any[];
  karyawan: any[];
  resep?: any;
  antrian?: any[];
}

export interface BackupPayload {
  metadata: BackupMetadata;
  database: BackupDatabase;
}

export interface DataManagerResult {
  success: boolean;
  message?: string;
  fileName?: string;
  downloadUrl?: string;
  rawData?: BackupPayload;
  database?: BackupDatabase;
}

export const DataManager = {

  // 1. BACKUP DATA (Ekspor ke File JSON)
  async exportBackup(): Promise<DataManagerResult> {
    try {
      const backupPayload: BackupPayload = {
        metadata: {
          app_id: "KedaiQu",
          version: "1.0.0",
          exported_at: new Date().toISOString()
        },
        database: {
          profil: JSON.parse(localStorage.getItem('kq_profil') || localStorage.getItem('kq_profile') || '{}'),
          katalog: JSON.parse(localStorage.getItem('kq_katalog') || localStorage.getItem('kq_menu_items') || '[]'),
          stok: JSON.parse(localStorage.getItem('kq_stok') || localStorage.getItem('kq_ingredients') || '[]'),
          pelanggan: JSON.parse(localStorage.getItem('kq_pelanggan') || localStorage.getItem('kq_customers') || '[]'),
          transaksi: JSON.parse(localStorage.getItem('kq_transaksi') || localStorage.getItem('kq_orders') || '[]'),
          karyawan: JSON.parse(localStorage.getItem('kq_karyawan') || localStorage.getItem('kq_staff') || '[]'),
          resep: JSON.parse(localStorage.getItem('kq_resep') || '{}'),
          antrian: JSON.parse(localStorage.getItem('kq_antrian') || '[]')
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
      const fileName = `Backup_KedaiQu_${new Date().toISOString().slice(0, 10)}.json`;

      return { success: true, fileName, downloadUrl: dataStr, rawData: backupPayload };
    } catch (err: any) {
      return { success: false, message: "Gagal membuat backup: " + err.message };
    }
  },

  // 2. RESTORE DATA (Impor Kembali File JSON Backup)
  async restoreData(fileContent: string | any): Promise<DataManagerResult> {
    try {
      const parsed = typeof fileContent === 'string' ? JSON.parse(fileContent) : fileContent;

      if (!parsed.metadata || parsed.metadata.app_id !== "KedaiQu") {
        return { success: false, message: "File backup tidak valid atau bukan milik KedaiQu!" };
      }

      const db: BackupDatabase = parsed.database;
      if (db.profil) {
        localStorage.setItem('kq_profil', JSON.stringify(db.profil));
        localStorage.setItem('kq_profile', JSON.stringify(db.profil));
      }
      if (db.katalog) {
        localStorage.setItem('kq_katalog', JSON.stringify(db.katalog));
        localStorage.setItem('kq_menu_items', JSON.stringify(db.katalog));
      }
      if (db.stok) {
        localStorage.setItem('kq_stok', JSON.stringify(db.stok));
        localStorage.setItem('kq_ingredients', JSON.stringify(db.stok));
      }
      if (db.pelanggan) {
        localStorage.setItem('kq_pelanggan', JSON.stringify(db.pelanggan));
        localStorage.setItem('kq_customers', JSON.stringify(db.pelanggan));
      }
      if (db.transaksi) {
        localStorage.setItem('kq_transaksi', JSON.stringify(db.transaksi));
        localStorage.setItem('kq_orders', JSON.stringify(db.transaksi));
      }
      if (db.karyawan) {
        localStorage.setItem('kq_karyawan', JSON.stringify(db.karyawan));
        localStorage.setItem('kq_staff', JSON.stringify(db.karyawan));
      }
      if (db.resep) {
        localStorage.setItem('kq_resep', JSON.stringify(db.resep));
      }
      if (db.antrian) {
        localStorage.setItem('kq_antrian', JSON.stringify(db.antrian));
      }

      return { success: true, message: "Data KedaiQu berhasil dipulihkan 100%!", database: db };
    } catch (err: any) {
      return { success: false, message: "Gagal restore data: " + err.message };
    }
  },

  // 3. RESET DATA (Kirim PIN Admin untuk Eksekusi)
  async resetData(mode: 'TRANSACTION_ONLY' | 'FACTORY_RESET' | string, pinAdmin: string): Promise<DataManagerResult> {
    const ADMIN_PIN = "1234"; // PIN Standar Default
    if (pinAdmin !== ADMIN_PIN) {
      return { success: false, message: "PIN Admin Salah!" };
    }

    if (mode === "TRANSACTION_ONLY") {
      // Menghapus histori transaksi (Cocok setelah selesai trial 30 hari)
      localStorage.removeItem('kq_transaksi');
      localStorage.removeItem('kq_orders');
      return { success: true, message: "Riwayat transaksi dibersihkan. Katalog menu & stok aman!" };
    }

    if (mode === "FACTORY_RESET") {
      // Hapus total seluruh data
      localStorage.clear();
      return { success: true, message: "Aplikasi di-reset total ke kondisi awal pabrik." };
    }

    return { success: false, message: "Mode reset tidak terdaftar." };
  }
};
