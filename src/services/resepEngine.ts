// src/services/resepEngine.ts - Auto Deduct Stok Bahan Baku (TypeScript)
import { RawIngredient } from '../types/kedai';

export interface RecipeIngredientPayload {
  bahan_id: string;
  bahan_name?: string;
  qty_used: number;
  unit?: string;
}

export interface MenuItemRecipe {
  menu_id?: string;
  menu_code?: string;
  menu_name?: string;
  ingredients: RecipeIngredientPayload[];
  updated_at?: string;
}

export interface CartItemDeductPayload {
  item_name?: string;
  menuName?: string;
  menuId?: string;
  qty: number;
  [key: string]: any;
}

export const ResepEngine = {

  // Potong stok bahan baku saat transaksi terjadi
  deductBahanBaku(cartItems: CartItemDeductPayload[]): RawIngredient[] {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return [];

    let resepList: Record<string, MenuItemRecipe> = JSON.parse(localStorage.getItem('kq_resep') || '{}');
    let stokBahan: any[] = JSON.parse(localStorage.getItem('kq_stok') || localStorage.getItem('kq_ingredients') || '[]');

    // Jika kq_resep masih kosong, bangun otomatis dari kq_katalog atau kq_menu_items
    if (Object.keys(resepList).length === 0) {
      const katalog = JSON.parse(localStorage.getItem('kq_katalog') || localStorage.getItem('kq_menu_items') || '[]');
      katalog.forEach((menu: any) => {
        if (menu.name && Array.isArray(menu.recipeIngredients) && menu.recipeIngredients.length > 0) {
          resepList[menu.name] = {
            menu_id: menu.id,
            menu_code: menu.code,
            menu_name: menu.name,
            ingredients: menu.recipeIngredients.map((r: any) => ({
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

    cartItems.forEach((cartItem) => {
      // Cari resep berdasarkan nama menu (support format item_name atau menuName)
      const itemName = cartItem.item_name || cartItem.menuName || '';
      let recipe = resepList[itemName];

      // Fallback pencarian resep case-insensitive atau berdasarkan menuId
      if (!recipe) {
        const foundKey = Object.keys(resepList).find((k) => k.toLowerCase() === itemName.toLowerCase());
        if (foundKey) {
          recipe = resepList[foundKey];
        } else if (cartItem.menuId) {
          const foundByMenuId = Object.values(resepList).find((r) => r.menu_id === cartItem.menuId);
          if (foundByMenuId) recipe = foundByMenuId;
        }
      }

      if (recipe && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach((ing) => {
          // ing = { bahan_id: "BHN-01", qty_used: 15 } // misal 15 gram kopi
          const targetId = ing.bahan_id;
          const qtyUsed = ing.qty_used || 0;

          const bahanIdx = stokBahan.findIndex(
            (b: any) =>
              b.id === targetId ||
              b.code === targetId ||
              (ing.bahan_name && b.name?.toLowerCase() === ing.bahan_name.toLowerCase())
          );

          if (bahanIdx !== -1) {
            const currentStock =
              stokBahan[bahanIdx].stok_sekarang !== undefined
                ? Number(stokBahan[bahanIdx].stok_sekarang)
                : Number(stokBahan[bahanIdx].stock || 0);

            const deduction = qtyUsed * (Number(cartItem.qty) || 1);
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
    return stokBahan as RawIngredient[];
  },

  // Mengambil Data Resep Aktif
  getAllRecipes(): Record<string, MenuItemRecipe> {
    return JSON.parse(localStorage.getItem('kq_resep') || '{}');
  },

  // Menyimpan atau Update Resep Menu
  saveRecipe(menuName: string, ingredients: RecipeIngredientPayload[], extra: Partial<MenuItemRecipe> = {}) {
    let resepList: Record<string, MenuItemRecipe> = JSON.parse(localStorage.getItem('kq_resep') || '{}');
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
