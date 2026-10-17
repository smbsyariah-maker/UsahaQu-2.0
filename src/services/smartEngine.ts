// src/services/smartEngine.ts - Gemini API Voice/Text Parser for KedaiQu Smart POS
import { GoogleGenAI } from '@google/genai';

export interface ParsedOrderItem {
  item_name: string;
  qty: number;
  variant?: string;
  notes?: string;
}

export interface ParsedOrderData {
  order_type: 'DINE_IN' | 'TAKE_AWAY';
  table_number: string;
  items: ParsedOrderItem[];
  payment_method: 'CASH' | 'QRIS' | 'UNPAID';
}

export interface SmartEngineResult {
  success: boolean;
  message?: string;
  data?: ParsedOrderData;
}

export const SmartEngine = {
  
  // Method untuk memproses Voice/Text Order di Kasir
  async parseOrder(inputText: string, apiKey?: string): Promise<SmartEngineResult> {
    let keyToUse = apiKey;
    if (!keyToUse) {
      try {
        const stored = JSON.parse(localStorage.getItem('kq_gemini') || '{}');
        keyToUse = stored.apiKey || '';
      } catch (e) {
        keyToUse = '';
      }
    }
    if (!keyToUse && typeof process !== 'undefined' && (process as any).env) {
      keyToUse = (process as any).env.GEMINI_API_KEY || '';
    }
    if (!keyToUse && typeof import.meta !== 'undefined' && (import.meta as any).env) {
      keyToUse = (import.meta as any).env.VITE_GEMINI_API_KEY || '';
    }

    if (!keyToUse) {
      return { success: false, message: "API Key Gemini belum diatur di menu Setting!" };
    }

    const systemPrompt = `
      Anda adalah parser AI POS KedaiQu. Tugas Anda mengubah teks pesanan lisan/ketikan menjadi JSON transaksi.
      Analisis item, jumlah (qty), varian (panas/es/pedas/porsi), dan catatan khusus.
      Return HANYA JSON murni dengan struktur:
      {
        "order_type": "DINE_IN" atau "TAKE_AWAY",
        "table_number": "nomor meja jika ada atau '-'",
        "items": [
          {
            "item_name": "Nama Menu",
            "qty": 1,
            "variant": "Varian/Ukuran jika ada",
            "notes": "Catatan khusus"
          }
        ],
        "payment_method": "CASH" atau "QRIS" atau "UNPAID"
      }
    `;

    try {
      // First try standard @google/genai SDK
      try {
        const ai = new GoogleGenAI({ apiKey: keyToUse });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: systemPrompt + "\nInput Pesanan: " + inputText,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const rawText = response.text || '';
        const cleanJson = rawText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return { success: true, data: parsed };
      } catch (sdkErr) {
        // Fallback to direct REST endpoint as specified by user
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyToUse}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: systemPrompt + "\nInput Pesanan: " + inputText }]
            }]
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = rawText.replace(/```json|```/g, '').trim();
        return { success: true, data: JSON.parse(cleanJson) };
      }
    } catch (err: any) {
      return { success: false, message: "Gagal memproses pesan AI: " + err.message };
    }
  }
};
