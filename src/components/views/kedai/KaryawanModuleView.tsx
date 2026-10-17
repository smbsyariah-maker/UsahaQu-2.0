import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Briefcase, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  UserCheck, 
  Star, 
  Check, 
  X,
  Phone,
  Award
} from 'lucide-react';
import { 
  StaffMember, 
  StaffShiftRecord, 
  StaffCommissionRecord 
} from '../../../types/kedai';

interface KaryawanModuleViewProps {
  initialSubMenu?: string;
  onBack: () => void;
  staffList: StaffMember[];
  onUpdateStaffList: (staff: StaffMember[]) => void;
  shiftRecords: StaffShiftRecord[];
  onAddShiftRecord: (record: StaffShiftRecord) => void;
  commissions: StaffCommissionRecord[];
  onUpdateCommissions: (comms: StaffCommissionRecord[]) => void;
}

export const KaryawanModuleView: React.FC<KaryawanModuleViewProps> = ({
  initialSubMenu = 'data_staff',
  onBack,
  staffList,
  onUpdateStaffList,
  shiftRecords,
  onAddShiftRecord,
  commissions,
  onUpdateCommissions
}) => {
  const [activeTab, setActiveTab] = useState<'data_staff' | 'absensi_shift' | 'komisi_staff'>(
    initialSubMenu as any || 'data_staff'
  );

  const [searchQuery, setSearchQuery] = useState('');

  // Add Staff Modal
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState<StaffMember['role']>('Kasir');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffPin, setStaffPin] = useState('1234');
  const [staffShift, setStaffShift] = useState<StaffMember['shift']>('Pagi (08:00 - 16:00)');

  // Quick Attendance Clock-in State
  const [selectedStaffForClockIn, setSelectedStaffForClockIn] = useState('');

  const filteredStaff = staffList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) return;

    const newStaff: StaffMember = {
      id: `st-${Date.now()}`,
      name: staffName.trim(),
      role: staffRole,
      phone: staffPhone.trim() || '08xxxxxxxx',
      pin: staffPin.trim() || '1234',
      shift: staffShift,
      dailyCommission: 0,
      ordersHandled: 0,
      rating: 5.0,
      status: 'Hadir'
    };

    onUpdateStaffList([...staffList, newStaff]);
    setIsAddStaffModalOpen(false);
    setStaffName('');
  };

  const handleClockIn = () => {
    if (!selectedStaffForClockIn) return;
    const target = staffList.find((s) => s.id === selectedStaffForClockIn);
    if (!target) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

    const newShiftRec: StaffShiftRecord = {
      id: `sh-${Date.now()}`,
      staffName: target.name,
      role: target.role,
      date: 'Hari Ini',
      shiftName: target.shift,
      clockIn: timeStr,
      status: 'Hadir Tepat Waktu'
    };

    onAddShiftRecord([newShiftRec, ...shiftRecords] as any);
    alert(`Sukses! ${target.name} berhasil tercatat clock-in hadir pada ${timeStr}`);
    setSelectedStaffForClockIn('');
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-[#0891B2] text-white px-4 pt-4 pb-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-9 h-9 rounded-full bg-white/20 active:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-cyan-200" />
                <h1 className="text-lg font-bold tracking-tight">Karyawan KedaiQu</h1>
              </div>
              <p className="text-[11px] text-cyan-100">Manajemen Staf, Absensi Shift & Komisi</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-cyan-900/60 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('data_staff')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'data_staff' ? 'bg-white text-cyan-900 shadow-xs' : 'text-cyan-100 hover:text-white'
              }`}
            >
              Staff
            </button>
            <button
              onClick={() => setActiveTab('absensi_shift')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'absensi_shift' ? 'bg-white text-cyan-900 shadow-xs' : 'text-cyan-100 hover:text-white'
              }`}
            >
              Shift
            </button>
            <button
              onClick={() => setActiveTab('komisi_staff')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'komisi_staff' ? 'bg-white text-cyan-900 shadow-xs' : 'text-cyan-100 hover:text-white'
              }`}
            >
              Komisi
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: DATA STAFF */}
      {activeTab === 'data_staff' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama karyawan atau posisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <button
              onClick={() => setIsAddStaffModalOpen(true)}
              className="bg-[#0891B2] hover:bg-cyan-700 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Tambah Staff</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-cyan-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 uppercase tracking-wider">
                        {staff.role}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{staff.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {staff.phone}
                      </p>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        staff.status === 'Hadir' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {staff.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 mt-3 space-y-1">
                    <div className="flex justify-between">
                      <span>Jadwal Shift:</span>
                      <span className="font-semibold text-slate-800">{staff.shift}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PIN Akses Kasir:</span>
                      <span className="font-mono font-bold text-cyan-700">•••• ({staff.pin})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Order Ditangani:</span>
                      <b className="text-slate-800">{staff.ordersHandled} pesanan</b>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{staff.rating}</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">
                    Insentif: <b>Rp {staff.dailyCommission.toLocaleString('id-ID')}</b>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: ABSENSI & SHIFT */}
      {activeTab === 'absensi_shift' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Quick Clock-in Widget */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-600" />
                Catat Kehadiran Staf (Clock-In Cepat)
              </h2>
              <p className="text-xs text-slate-500">
                Pilih nama karyawan yang hadir bertugas pada shift saat ini untuk mencatat waktu mulai kerja.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <select
                value={selectedStaffForClockIn}
                onChange={(e) => setSelectedStaffForClockIn(e.target.value)}
                className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex-1 min-w-[200px]"
              >
                <option value="">-- Pilih Staf yang Hadir --</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role}) - {s.shift}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleClockIn}
                className="bg-[#0891B2] hover:bg-cyan-700 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
              >
                Clock-In Sekarang
              </button>
            </div>
          </div>

          {/* Attendance Log Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700">Daftar Kehadiran Hari Ini</h3>
            <div className="space-y-2">
              {shiftRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs">
                      {rec.clockIn.slice(0, 5)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rec.staffName}</h4>
                      <p className="text-[11px] text-slate-400">
                        {rec.role} • {rec.shiftName}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: KOMISI & BAGI HASIL */}
      {activeTab === 'komisi_staff' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan-600" />
              Skema Insentif & Bagi Hasil Staf Kedai
            </h2>
            <p className="text-xs text-slate-500">
              Perhitungan komisi otomatis berdasarkan pencapaian target porsi minuman kopi atau masakan harian.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commissions.map((comm) => (
              <div
                key={comm.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{comm.staffName}</h4>
                    <span className="text-[10px] text-slate-400">Periode: {comm.date}</span>
                  </div>

                  <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-lg">
                    Rp {comm.totalCommission.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Target Penjualan:</span>
                    <span>{comm.targetCount} unit</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Realisasi Penjualan:</span>
                    <span className="text-emerald-700">{comm.actualCount} unit (Tercapai!)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Komisi per Unit:</span>
                    <span>Rp {comm.commissionPerUnit.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px]">Status: {comm.status}</span>
                  <button
                    onClick={() => {
                      onUpdateCommissions(
                        commissions.map((c) =>
                          c.id === comm.id ? { ...c, status: 'Sudah Ditransfer' } : c
                        )
                      );
                      alert(`Komisi untuk ${comm.staffName} sebesar Rp ${comm.totalCommission.toLocaleString('id-ID')} berhasil ditandai cair.`);
                    }}
                    className="text-xs font-bold text-cyan-700 hover:underline"
                  >
                    Tandai Cair &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL ADD STAFF */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveStaff}
            className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-base font-bold text-slate-900">Tambah Karyawan Baru</h3>
              <button
                type="button"
                onClick={() => setIsAddStaffModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block">Nama Karyawan *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Posisi / Jabatan</label>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Kasir">Kasir</option>
                    <option value="Barista">Barista</option>
                    <option value="Koki Dapur">Koki Dapur</option>
                    <option value="Waiter">Waiter</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block">PIN Akses (4 Digit)</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={staffPin}
                    onChange={(e) => setStaffPin(e.target.value)}
                    className="w-full text-xs font-mono font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Nomor WhatsApp</label>
                <input
                  type="tel"
                  placeholder="08xxxxxxxx"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Shift Utama</label>
                <select
                  value={staffShift}
                  onChange={(e) => setStaffShift(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Pagi (08:00 - 16:00)">Pagi (08:00 - 16:00)</option>
                  <option value="Malam (16:00 - 23:00)">Malam (16:00 - 23:00)</option>
                  <option value="Full Time">Full Time</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0891B2] hover:bg-cyan-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all"
            >
              Simpan Data Karyawan
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
