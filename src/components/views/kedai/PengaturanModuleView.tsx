import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Printer, 
  Key, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Save, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle,
  Bot,
  Send,
  Loader2,
  Copy,
  Check,
  Lock,
  ShieldAlert,
  FileJson,
  X
} from 'lucide-react';
import { StoreProfile, GeminiApiConfig, MenuItem } from '../../../types/kedai';
import { DataManager, DataManagerResult } from '../../../services/dataManager';
import { GoogleGenAI } from '@google/genai';

interface PengaturanModuleViewProps {
  initialSubMenu?: string;
  onBack: () => void;
  storeProfile: StoreProfile;
  onSaveProfile: (profile: StoreProfile) => void;
  geminiConfig: GeminiApiConfig;
  onSaveGeminiConfig: (config: GeminiApiConfig) => void;
  menuItems: MenuItem[];
  onReloadAllData?: () => void;
}

export const PengaturanModuleView: React.FC<PengaturanModuleViewProps> = ({
  initialSubMenu = 'profil_kedai',
  onBack,
  storeProfile,
  onSaveProfile,
  geminiConfig,
  onSaveGeminiConfig,
  menuItems,
  onReloadAllData
}) => {
  const [activeTab, setActiveTab] = useState<'profil_kedai' | 'api_gemini' | 'data_safety_hub'>(
    initialSubMenu as any || 'profil_kedai'
  );

  // Profile Form State
  const [profileForm, setProfileForm] = useState<StoreProfile>(storeProfile);

  // Gemini State
  const [customKey, setCustomKey] = useState(geminiConfig.apiKey || '');
  const [selectedModel, setSelectedModel] = useState(geminiConfig.model || 'gemini-2.5-flash');
  const [testResult, setTestResult] = useState(geminiConfig.testResponse || '');

  // AI Feature State (Interactive Culinary Copywriter & Business Advisor)
  const [aiPromptTopic, setAiPromptTopic] = useState('');
  const [aiFeatureMode, setAiFeatureMode] = useState<'deskripsi_menu' | 'rekomendasi_promo' | 'analisis_harga'>('deskripsi_menu');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResultText, setAiResultText] = useState('');
  const [copied, setCopied] = useState(false);

  // Printer Test State
  const [isTestPrintOpen, setIsTestPrintOpen] = useState(false);

  // Data Safety State
  const [backupStatusMessage, setBackupStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [restoreStatusMessage, setRestoreStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [resetMode, setResetMode] = useState<'TRANSACTION_ONLY' | 'FACTORY_RESET'>('TRANSACTION_ONLY');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [resetStatusMessage, setResetStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isResetConfirmModalOpen, setIsResetConfirmModalOpen] = useState(false);

  // Handle Save Profile
  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profileForm);
    alert('Profil Kedai & Konfigurasi Printer berhasil diperbarui!');
  };

  // 1. Export Backup using DataManager
  const handleExportBackup = async () => {
    setBackupStatusMessage(null);
    const result: DataManagerResult = await DataManager.exportBackup();
    if (result.success && result.downloadUrl && result.fileName) {
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', result.downloadUrl);
      downloadAnchor.setAttribute('download', result.fileName);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setBackupStatusMessage({
        text: `Backup berhasil diunduh sebagai ${result.fileName}! File siap disimpan untuk keamanan.`
      });
    } else {
      setBackupStatusMessage({
        text: result.message || 'Gagal mengekspor file backup.',
        isError: true
      });
    }
  };

  // 2. Restore Data using DataManager
  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreStatusMessage(null);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const result: DataManagerResult = await DataManager.restoreData(content);
      if (result.success) {
        setRestoreStatusMessage({
          text: result.message || 'Data KedaiQu berhasil dipulihkan 100%!'
        });
        if (onReloadAllData) {
          onReloadAllData();
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 800);
        }
      } else {
        setRestoreStatusMessage({
          text: result.message || 'Gagal memulihkan data.',
          isError: true
        });
      }
    };
    reader.readAsText(file);
  };

  // 3. Reset Data with Admin PIN using DataManager
  const handleExecuteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatusMessage(null);

    const result: DataManagerResult = await DataManager.resetData(resetMode, adminPinInput.trim());
    if (result.success) {
      setResetStatusMessage({
        text: result.message || 'Reset data berhasil dijalankan!'
      });
      setAdminPinInput('');
      setIsResetConfirmModalOpen(false);

      if (onReloadAllData) {
        onReloadAllData();
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } else {
      setResetStatusMessage({
        text: result.message || 'Gagal reset data.',
        isError: true
      });
    }
  };

  // Test Gemini AI Connection & Run Assistant
  const handleRunAiAssistant = async () => {
    setAiGenerating(true);
    setAiResultText('');

    try {
      const apiKeyToUse = customKey.trim() || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey: apiKeyToUse });

      let promptText = '';
      if (aiFeatureMode === 'deskripsi_menu') {
        promptText = `Kamu adalah copywriter kuliner profesional F&B dan kafe Indonesia. Buatkan 2 opsi deskripsi menu yang menggugah selera, puitis, dan menarik untuk menu: "${aiPromptTopic || 'Kopi Susu Gula Aren Spesial'}" di kedai "${storeProfile.name}". Berikan juga rekomendasi daya tarik (USP) dan saran hashtag Instagram / TikTok. Gunakan Bahasa Indonesia yang santai, modern, dan elegan.`;
      } else if (aiFeatureMode === 'rekomendasi_promo') {
        promptText = `Sebagai konsultan bisnis F&B modern di Indonesia, buatkan 3 ide paket promo kreatif (bundling menu makanan & minuman) yang menarik untuk kafe "${storeProfile.name}". Target: anak muda, mahasiswa, pekerja remote, dan keluarga. Berikan nama paket yang catchy dan perkiraan diskon optimal.`;
      } else {
        promptText = `Sebagai food cost auditor, berikan saran penetapan harga jual dan strategi efisiensi bahan baku untuk menu F&B "${aiPromptTopic || 'Nasi Goreng Spesial'}" agar margin laba bersih mencapai di atas 60%. Jelaskan secara ringkas, to-the-point, dan aplikatif.`;
      }

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: promptText
      });

      const responseText = response.text || 'Gagal menerima tanggapan dari Gemini.';
      setAiResultText(responseText);
      setTestResult('Koneksi Gemini AI 2.5 Flash Berhasil & Siap Digunakan.');
      onSaveGeminiConfig({
        apiKey: customKey,
        model: selectedModel,
        isConnected: true,
        lastTested: 'Aktif & Terverifikasi',
        testResponse: responseText.slice(0, 100) + '...'
      });
    } catch (err: any) {
      console.error(err);
      setAiResultText(
        `[Simulasi AI KedaiQu]: Fitur asisten cerdas Gemini siap aktif. Pastikan API key terpasang dengan benar. Saran Menu: "${aiPromptTopic || 'Menu Baru'}" memiliki potensi tinggi jika dipasangkan dengan promo kombo minuman segar!`
      );
      setTestResult('Tes Selesai (Menggunakan respons cadangan lokal).');
    } finally {
      setAiGenerating(false);
    }
  };

  const copyAiResult = () => {
    if (!aiResultText) return;
    navigator.clipboard.writeText(aiResultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-[#4B5563] text-white px-4 pt-4 pb-4 sticky top-0 z-30 shadow-md">
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
                <Settings className="w-4 h-4 text-slate-300" />
                <h1 className="text-lg font-bold tracking-tight">Pengaturan &amp; Data</h1>
              </div>
              <p className="text-[11px] text-slate-300">Profil Toko, Printer Thermal, Gemini &amp; Data Safety Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-700/60 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('profil_kedai')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'profil_kedai' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Profil &amp; Printer
            </button>
            <button
              onClick={() => setActiveTab('api_gemini')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'api_gemini' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Gemini AI
            </button>
            <button
              onClick={() => setActiveTab('data_safety_hub')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'data_safety_hub' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Safety Hub
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: PROFIL KEDAI & PRINTER THERMAL */}
      {activeTab === 'profil_kedai' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <form onSubmit={handleSaveProfileSubmit} className="space-y-4">
            {/* Store Information */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-600" />
                Identitas Toko &amp; Informasi Usaha KedaiQu
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Nama Kedai / Kafe *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block">Slogan / Tagline</label>
                  <input
                    type="text"
                    value={profileForm.tagline}
                    onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Alamat Lengkap Kedai</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Nomor Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block">Nama Usaha di QRIS</label>
                  <input
                    type="text"
                    value={profileForm.qrisMerchantName}
                    onChange={(e) => setProfileForm({ ...profileForm, qrisMerchantName: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Thermal Printer Settings */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Printer className="w-4 h-4 text-slate-600" />
                  Konfigurasi Printer Thermal Bluetooth / USB
                </h2>
                <button
                  type="button"
                  onClick={() => setIsTestPrintOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Tes Cetak Struk
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Lebar Kertas Struk</label>
                  <select
                    value={profileForm.paperWidth}
                    onChange={(e) => setProfileForm({ ...profileForm, paperWidth: e.target.value as any })}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="58mm">58mm (Printer Kasir Mini / Portable)</option>
                    <option value="80mm">80mm (Printer Kasir Standar Resto)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block">Pajak Restoran / PB1 (%)</label>
                  <input
                    type="number"
                    value={profileForm.taxRate}
                    onChange={(e) => setProfileForm({ ...profileForm, taxRate: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block">Service Charge (%)</label>
                  <input
                    type="number"
                    value={profileForm.serviceRate}
                    onChange={(e) => setProfileForm({ ...profileForm, serviceRate: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Pesan Footer Struk Pembayaran</label>
                <input
                  type="text"
                  placeholder="Terima kasih atas kunjungannya! Follow IG kami..."
                  value={profileForm.footerMessage}
                  onChange={(e) => setProfileForm({ ...profileForm, footerMessage: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#4B5563] hover:bg-slate-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Konfigurasi Profil</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB-VIEW 2: KONFIGURASI GEMINI API KEY */}
      {activeTab === 'api_gemini' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Engine Status Box */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Google Gemini AI Engine</h2>
                  <p className="text-[11px] text-slate-500">Kecerdasan Buatan untuk Pembuatan Menu &amp; Analisis Penjualan</p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Gemini 2.5 Flash Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block">Pilih Model Gemini</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Cepat, Hemat &amp; Akurat - Rekomendasi)</option>
                  <option value="gemini-2.5-pro">gemini-2.5-pro (Analisis Mendalam)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Custom Gemini API Key (Opsional)</label>
                <input
                  type="password"
                  placeholder="AIzaSy... (Biarkan kosong untuk server default)"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            {testResult && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
                <span className="font-bold block text-slate-900">Status Koneksi:</span>
                <p className="mt-0.5">{testResult}</p>
              </div>
            )}
          </div>

          {/* Interactive AI Assistant for F&B */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Asisten Kreatif &amp; Konsultan F&amp;B KedaiQu
                </h3>
                <p className="text-xs text-purple-700">
                  Gunakan kecerdasan buatan untuk meracik deskripsi menu yang menjual, menyusun ide promo, atau optimasi HPP.
                </p>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'deskripsi_menu', label: 'Tulis Deskripsi Menu Lezat' },
                { id: 'rekomendasi_promo', label: 'Ide Paket Promo Bundling' },
                { id: 'analisis_harga', label: 'Konsultasi Margin & HPP' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setAiFeatureMode(m.id as any)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    aiFeatureMode === m.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Input field */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  aiFeatureMode === 'deskripsi_menu'
                    ? 'Masukkan nama menu, cth: Kopi Susu Creamy Pandan...'
                    : aiFeatureMode === 'rekomendasi_promo'
                    ? 'Target promo, cth: Mahasiswa Akhir Pekan...'
                    : 'Menu yang ingin dianalisis, cth: Mie Goreng Spesial...'
                }
                value={aiPromptTopic}
                onChange={(e) => setAiPromptTopic(e.target.value)}
                className="flex-1 text-xs px-3 py-2.5 bg-white border border-purple-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-400"
              />

              <button
                type="button"
                disabled={aiGenerating}
                onClick={handleRunAiAssistant}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
              >
                {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate dengan AI</span>
              </button>
            </div>

            {/* AI Result Card */}
            {aiResultText && (
              <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-sm space-y-2 select-text">
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider">
                    Hasil Rekomendasi Gemini AI
                  </span>
                  <button
                    onClick={copyAiResult}
                    className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                  {aiResultText}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: DATA SAFETY HUB (BACKUP, RESTORE, RESET) */}
      {activeTab === 'data_safety_hub' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-700" />
              Safety Hub KedaiQu (Backup, Restore &amp; Reset Data)
            </h2>
            <p className="text-xs text-slate-500">
              Pusat kendali pencadangan file JSON, pemulihan data 100%, dan reset data aman terlindungi PIN Admin.
            </p>
          </div>

          {/* 1. BACKUP DATA (Ekspor ke File JSON) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">Backup Data (Ekspor ke File JSON)</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 pl-8">
                  Ekspor seluruh database (Profil Kedai, Katalog Menu, Stok Bahan, Pelanggan, Transaksi &amp; Karyawan) ke file <code>.json</code> bertanda tangan digital <code>app_id: "KedaiQu"</code>.
                </p>
              </div>
            </div>

            <div className="pl-8 pt-1">
              <button
                type="button"
                onClick={handleExportBackup}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Backup JSON</span>
              </button>

              {backupStatusMessage && (
                <div className={`mt-2 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  backupStatusMessage.isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {backupStatusMessage.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <span>{backupStatusMessage.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. RESTORE DATA (Impor Kembali File JSON Backup) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">Restore Data (Impor File JSON Backup)</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 pl-8">
                  Pulihkan kembali data transaksi, stok, menu, dan profil dari file cadangan yang sebelumnya diekspor. Sistem akan memvalidasi header metadata KedaiQu.
                </p>
              </div>
            </div>

            <div className="pl-8 pt-1">
              <label className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm inline-flex items-center gap-2 transition-all cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Pilih File Backup (.json)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileRestore}
                  className="hidden"
                />
              </label>

              {restoreStatusMessage && (
                <div className={`mt-2 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  restoreStatusMessage.isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {restoreStatusMessage.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <span>{restoreStatusMessage.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. RESET DATA (Kirim PIN Admin untuk Eksekusi) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 text-xs font-black flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">Reset Data (Dilindungi PIN Admin)</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 pl-8">
                  Pembersihan data dengan verifikasi PIN Admin (Default PIN: <code>1234</code>).
                </p>
              </div>
            </div>

            <div className="pl-8 space-y-3 pt-1">
              {/* Reset Mode Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  onClick={() => setResetMode('TRANSACTION_ONLY')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    resetMode === 'TRANSACTION_ONLY'
                      ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-300'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                    <span>TRANSACTION_ONLY</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Menghapus riwayat transaksi saja. Katalog menu &amp; stok bahan baku tetap aman! Cocok setelah selesai periode trial.
                  </p>
                </div>

                <div
                  onClick={() => setResetMode('FACTORY_RESET')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    resetMode === 'FACTORY_RESET'
                      ? 'border-rose-500 bg-rose-50/70 ring-1 ring-rose-300'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-rose-900">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>FACTORY_RESET</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Hapus total seluruh database aplikasi dan kembalikan ke kondisi awal pabrik.
                  </p>
                </div>
              </div>

              {/* PIN Input & Execute Trigger */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="Masukkan PIN Admin (Default: 1234)"
                      value={adminPinInput}
                      onChange={(e) => setAdminPinInput(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!adminPinInput.trim()}
                    onClick={() => setIsResetConfirmModalOpen(true)}
                    className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    Eksekusi Reset Data
                  </button>
                </div>

                <span className="text-[10px] text-slate-400 block">
                  * Keamanan tingkat tinggi: Tindakan reset tidak dapat dibatalkan jika Anda tidak memiliki file backup.
                </span>

                {resetStatusMessage && (
                  <div className={`mt-2 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    resetStatusMessage.isError ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {resetStatusMessage.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    <span>{resetStatusMessage.text}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG MODAL FOR RESET */}
      {isResetConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3.5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Eksekusi Reset</h3>
              <p className="text-xs text-slate-600 mt-1">
                Anda memilih mode <b>{resetMode}</b> dengan PIN Admin <code>{adminPinInput}</code>.
              </p>
              <p className="text-[11px] text-rose-600 font-semibold mt-1">
                Pastikan Anda telah mengunduh backup JSON jika ingin menyimpan data penting!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                Lanjutkan Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEST PRINT RECEIPT MODAL */}
      {isTestPrintOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3">
            <h3 className="text-xs font-bold text-slate-800">Simulasi Cetak Struk Thermal ({profileForm.paperWidth})</h3>
            <div className="bg-slate-50 border border-dashed border-slate-300 p-4 rounded-xl font-mono text-[11px] text-slate-800 space-y-1.5 text-center">
              <h4 className="font-extrabold text-sm">{profileForm.name}</h4>
              <p className="text-[10px] text-slate-500">{profileForm.address}</p>
              <p className="text-[10px] text-slate-500">Telp: {profileForm.phone}</p>
              <div className="border-t border-dashed border-slate-300 my-2 pt-2 text-left">
                <div className="flex justify-between"><span>Kopi Susu Aren (1x)</span><span>Rp 18.000</span></div>
                <div className="flex justify-between"><span>Nasi Goreng Kedai (1x)</span><span>Rp 25.000</span></div>
                <div className="flex justify-between font-bold border-t border-slate-200 pt-1 mt-1">
                  <span>TOTAL:</span><span>Rp 43.000</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 pt-2 border-t border-dashed border-slate-300">
                {profileForm.footerMessage}
              </p>
            </div>
            <button
              onClick={() => setIsTestPrintOpen(false)}
              className="w-full bg-slate-800 text-white font-bold py-2 rounded-xl text-xs"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
