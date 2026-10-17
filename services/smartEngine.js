// services/smartEngine.js - Gemini API Voice/Text Parser
export const SmartEngine = {
  
  // Method untuk memproses Voice/Text Order di Kasir
  async parseOrder(inputText, apiKey) {
    // Check provided apiKey or fallback to storage or environment
    let keyToUse = apiKey;
    if (!keyToUse) {
      try {
        const stored = JSON.parse(localStorage.getItem('kq_gemini') || '{}');
        keyToUse = stored.apiKey || '';
      } catch (e) {
        keyToUse = '';
      }
    }
    if (!keyToUse && typeof process !== 'undefined' && process.env) {
      keyToUse = process.env.GEMINI_API_KEY || '';
    }
    if (!keyToUse && typeof import.meta !== 'undefined' && import.meta.env) {
      keyToUse = import.meta.env.VITE_GEMINI_API_KEY || '';
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
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJson = rawText.replace(/```json|```/g, '').trim();
      
      return { success: true, data: JSON.parse(cleanJson) };
    } catch (err) {
      return { success: false, message: "Gagal memproses pesan AI: " + err.message };
    }
  }
};
