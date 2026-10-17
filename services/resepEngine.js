// services/resepEngine.js - Auto Deduct Stok Bahan Baku
export const ResepEngine = {

  // Potong stok bahan baku saat transaksi terjadi
  deductBahanBaku(cartItems) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return [];

    let resepList = JSON.parse(localStorage.getItem('kq_resep') || '{}');
    let stokBahan = JSON.parse(localStorage.getItem('kq_stok') || localStorage.getItem('kq_ingredients') || '[]');

    // Jika kq_resep masih kosong, bangun otomatis dari kq_katalog atau kq_menu_items
    if (Object.keys(resepList).length === 0) {
      const katalog = JSON.parse(localStorage.getItem('kq_katalog') || localStorage.getItem('kq_menu_items') || '[]');
      katalog.forEach(menu => {
        if (menu.name && Array.isArray(menu.recipeIngredients) && menu.recipeIngredients.length > 0) {
          resepList[menu.name] = {
            menu_id: menu.id,
            menu_code: menu.code,
            ingredients: menu.recipeIngredients.map(r => ({
              bahan_id: r.ingredientId,
              bahan_name: r.ingredientName,
              qty_used: r.amountNeeded,
              unit: r.unit
            }))
          };
        }
      });
      localStorage.setItem('kq_resep', JSON.stringify(resepList));
    }

    cartItems.forEach(cartItem => {
      // Cari resep berdasarkan nama menu (support format item_name atau menuName)
      const itemName = cartItem.item_name || cartItem.menuName;
      let recipe = resepList[itemName];

      // Fallback pencarian resep case-insensitive atau berdasarkan menuId
      if (!recipe) {
        const foundKey = Object.keys(resepList).find(k => k.toLowerCase() === (itemName || '').toLowerCase());
        if (foundKey) {
          recipe = resepList[foundKey];
        } else if (cartItem.menuId) {
          const foundByMenuId = Object.values(resepList).find(r => r.menu_id === cartItem.menuId);
          if (foundByMenuId) recipe = foundByMenuId;
        }
      }

      if (recipe && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(ing => {
          // ing = { bahan_id: "BHN-01", qty_used: 15 } // misal 15 gram kopi
          const targetId = ing.bahan_id || ing.ingredientId;
          const qtyUsed = ing.qty_used || ing.amountNeeded || 0;

          const bahanIdx = stokBahan.findIndex(b => 
            b.id === targetId || 
            b.code === targetId || 
            b.name === ing.bahan_name
          );

          if (bahanIdx !== -1) {
            const currentStock = stokBahan[bahanIdx].stok_sekarang !== undefined 
              ? stokBahan[bahanIdx].stok_sekarang 
              : (stokBahan[bahanIdx].stock !== undefined ? stokBahan[bahanIdx].stock : 0);

            const deduction = qtyUsed * (cartItem.qty || 1);
            let updatedStock = currentStock - deduction;
            if (updatedStock < 0) {
              updatedStock = 0; // Prevent minus
            }

            stokBahan[bahanIdx].stok_sekarang = updatedStock;
            stokBahan[bahanIdx].stock = updatedStock; // Sinkronisasi field stock & stok_sekarang
          }
        });
      }
    });

    localStorage.setItem('kq_stok', JSON.stringify(stokBahan));
    localStorage.setItem('kq_ingredients', JSON.stringify(stokBahan));
    return stokBahan;
  },

  // Mengambil Data Resep Aktif
  getAllRecipes() {
    return JSON.parse(localStorage.getItem('kq_resep') || '{}');
  },

  // Menyimpan atau Update Resep Menu
  saveRecipe(menuName, ingredients, extra = {}) {
    let resepList = JSON.parse(localStorage.getItem('kq_resep') || '{}');
    resepList[menuName] = {
      menu_name: menuName,
      ingredients,
      ...extra,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem('kq_resep', JSON.stringify(resepList));
    return resepList;
  }
};
