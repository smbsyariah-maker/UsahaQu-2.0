/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { KEDAIQU_NAV, KedaiQuNavModule, KedaiQuSubMenu } from './config/kedaiQuNav';
import { AppTemplateSwitcher } from './config/appTemplateSwitch';
import { 
  MenuItem, 
  OrderTicket, 
  RawIngredient, 
  InboundStockRecord, 
  StockOpnameRecord, 
  KedaiCustomer, 
  KedaiVoucher, 
  StaffMember, 
  StaffShiftRecord, 
  StaffCommissionRecord, 
  StoreProfile, 
  GeminiApiConfig,
  KitchenStatus
} from './types/kedai';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_RAW_INGREDIENTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_VOUCHERS, 
  INITIAL_STAFF, 
  INITIAL_SHIFTS, 
  INITIAL_COMMISSIONS, 
  INITIAL_INBOUND_RECORDS, 
  INITIAL_OPNAME_RECORDS, 
  INITIAL_STORE_PROFILE, 
  INITIAL_GEMINI_CONFIG 
} from './data/kedaiMockData';
import { AndroidFrame } from './components/common/AndroidFrame';
import { BottomNavBar } from './components/common/BottomNavBar';
import { HomeDashboard } from './components/home/HomeDashboard';
import { SubMenuPage } from './components/submenu/SubMenuPage';
import { OrderModuleView } from './components/views/kedai/OrderModuleView';
import { MenuModuleView } from './components/views/kedai/MenuModuleView';
import { StokModuleView } from './components/views/kedai/StokModuleView';
import { MarketingModuleView } from './components/views/kedai/MarketingModuleView';
import { KaryawanModuleView } from './components/views/kedai/KaryawanModuleView';
import { LaporanModuleView } from './components/views/kedai/LaporanModuleView';
import { PengaturanModuleView } from './components/views/kedai/PengaturanModuleView';
import { PelangganService } from './services/pelangganService';
import { ResepEngine } from './services/resepEngine';
import { AntrianService } from './services/antrianService';

export default function App() {
  // Persistence state aligned with DataManager
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('kq_katalog') || localStorage.getItem('kq_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [orders, setOrders] = useState<OrderTicket[]>(() => {
    const saved = localStorage.getItem('kq_transaksi') || localStorage.getItem('kq_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [rawIngredients, setRawIngredients] = useState<RawIngredient[]>(() => {
    const saved = localStorage.getItem('kq_stok') || localStorage.getItem('kq_ingredients');
    return saved ? JSON.parse(saved) : INITIAL_RAW_INGREDIENTS;
  });

  const [inboundRecords, setInboundRecords] = useState<InboundStockRecord[]>(() => {
    const saved = localStorage.getItem('kq_inbounds');
    return saved ? JSON.parse(saved) : INITIAL_INBOUND_RECORDS;
  });

  const [opnameRecords, setOpnameRecords] = useState<StockOpnameRecord[]>(() => {
    const saved = localStorage.getItem('kq_opnames');
    return saved ? JSON.parse(saved) : INITIAL_OPNAME_RECORDS;
  });

  const [customers, setCustomers] = useState<KedaiCustomer[]>(() => {
    const saved = localStorage.getItem('kq_pelanggan') || localStorage.getItem('kq_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [vouchers, setVouchers] = useState<KedaiVoucher[]>(() => {
    const saved = localStorage.getItem('kq_vouchers');
    return saved ? JSON.parse(saved) : INITIAL_VOUCHERS;
  });

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('kq_karyawan') || localStorage.getItem('kq_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [shiftRecords, setShiftRecords] = useState<StaffShiftRecord[]>(() => {
    const saved = localStorage.getItem('kq_shifts');
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });

  const [commissions, setCommissions] = useState<StaffCommissionRecord[]>(() => {
    const saved = localStorage.getItem('kq_commissions');
    return saved ? JSON.parse(saved) : INITIAL_COMMISSIONS;
  });

  const [storeProfile, setStoreProfile] = useState<StoreProfile>(() => {
    const saved = localStorage.getItem('kq_profil') || localStorage.getItem('kq_profile');
    return saved ? JSON.parse(saved) : INITIAL_STORE_PROFILE;
  });

  const [geminiConfig, setGeminiConfig] = useState<GeminiApiConfig>(() => {
    const saved = localStorage.getItem('kq_gemini');
    return saved ? JSON.parse(saved) : INITIAL_GEMINI_CONFIG;
  });

  // Local storage synchronization (writes to both standard DataManager keys and legacy keys)
  useEffect(() => {
    localStorage.setItem('kq_katalog', JSON.stringify(menuItems));
    localStorage.setItem('kq_menu_items', JSON.stringify(menuItems));

    // Sinkronisasi database resep kq_resep untuk ResepEngine
    try {
      const currentResep = JSON.parse(localStorage.getItem('kq_resep') || '{}');
      menuItems.forEach((menu) => {
        if (menu.name && menu.recipeIngredients && menu.recipeIngredients.length > 0) {
          currentResep[menu.name] = {
            menu_id: menu.id,
            menu_code: menu.code,
            menu_name: menu.name,
            ingredients: menu.recipeIngredients.map((r) => ({
              bahan_id: r.ingredientId,
              bahan_name: r.ingredientName,
              qty_used: r.amountNeeded,
              unit: r.unit
            }))
          };
        }
      });
      localStorage.setItem('kq_resep', JSON.stringify(currentResep));
    } catch (e) {
      // ignore
    }
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('kq_transaksi', JSON.stringify(orders));
    localStorage.setItem('kq_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kq_stok', JSON.stringify(rawIngredients));
    localStorage.setItem('kq_ingredients', JSON.stringify(rawIngredients));
  }, [rawIngredients]);

  useEffect(() => {
    localStorage.setItem('kq_inbounds', JSON.stringify(inboundRecords));
  }, [inboundRecords]);

  useEffect(() => {
    localStorage.setItem('kq_opnames', JSON.stringify(opnameRecords));
  }, [opnameRecords]);

  useEffect(() => {
    localStorage.setItem('kq_pelanggan', JSON.stringify(customers));
    localStorage.setItem('kq_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('kq_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('kq_karyawan', JSON.stringify(staffList));
    localStorage.setItem('kq_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('kq_shifts', JSON.stringify(shiftRecords));
  }, [shiftRecords]);

  useEffect(() => {
    localStorage.setItem('kq_commissions', JSON.stringify(commissions));
  }, [commissions]);

  useEffect(() => {
    localStorage.setItem('kq_profil', JSON.stringify(storeProfile));
    localStorage.setItem('kq_profile', JSON.stringify(storeProfile));
  }, [storeProfile]);

  useEffect(() => {
    localStorage.setItem('kq_gemini', JSON.stringify(geminiConfig));
  }, [geminiConfig]);

  // Reload all states from localStorage
  const handleReloadAllData = () => {
    const savedKatalog = localStorage.getItem('kq_katalog') || localStorage.getItem('kq_menu_items');
    if (savedKatalog) setMenuItems(JSON.parse(savedKatalog));
    else setMenuItems([]);

    const savedTransaksi = localStorage.getItem('kq_transaksi') || localStorage.getItem('kq_orders');
    if (savedTransaksi) setOrders(JSON.parse(savedTransaksi));
    else setOrders([]);

    const savedStok = localStorage.getItem('kq_stok') || localStorage.getItem('kq_ingredients');
    if (savedStok) setRawIngredients(JSON.parse(savedStok));
    else setRawIngredients([]);

    const savedPelanggan = localStorage.getItem('kq_pelanggan') || localStorage.getItem('kq_customers');
    if (savedPelanggan) setCustomers(JSON.parse(savedPelanggan));
    else setCustomers([]);

    const savedKaryawan = localStorage.getItem('kq_karyawan') || localStorage.getItem('kq_staff');
    if (savedKaryawan) setStaffList(JSON.parse(savedKaryawan));
    else setStaffList([]);

    const savedProfil = localStorage.getItem('kq_profil') || localStorage.getItem('kq_profile');
    if (savedProfil) setStoreProfile(JSON.parse(savedProfil));
  };
  // Template & Navigation state
  const [activeTemplate, setActiveTemplate] = useState(() => AppTemplateSwitcher.getActiveTemplate());
  const currentNavModules = activeTemplate.navigation;

  const handleSwitchTemplate = (templateKey: string) => {
    AppTemplateSwitcher.switchTemplate(templateKey);
    setActiveTemplate(AppTemplateSwitcher.getActiveTemplate());
  };

  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'submenu' | 'feature'>('dashboard');
  const [selectedModule, setSelectedModule] = useState<KedaiQuNavModule | null>(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState<KedaiQuSubMenu | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Navigation handlers
  const handleSelectModule = (mod: KedaiQuNavModule) => {
    setSelectedModule(mod);
    setCurrentTab(mod.id);
    setCurrentScreen('submenu');
  };

  const handleSelectSubMenu = (subItem: KedaiQuSubMenu) => {
    setSelectedSubMenu(subItem);
    setCurrentScreen('feature');
  };

  const handleBack = () => {
    if (currentScreen === 'feature') {
      setCurrentScreen('submenu');
    } else if (currentScreen === 'submenu') {
      setCurrentScreen('dashboard');
      setSelectedModule(null);
      setSelectedSubMenu(null);
      setCurrentTab('dashboard');
    }
  };

  const handleGoHome = () => {
    setCurrentScreen('dashboard');
    setSelectedModule(null);
    setSelectedSubMenu(null);
    setCurrentTab('dashboard');
  };

  const handleBottomTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    if (tabId === 'dashboard') {
      handleGoHome();
    } else {
      const targetMod = currentNavModules.find((m) => m.id === tabId);
      if (targetMod) {
        setSelectedModule(targetMod);
        setCurrentScreen('submenu');
      }
    }
  };

  // Direct quick actions
  const handleOpenPOSDirectly = () => {
    const orderMod = currentNavModules.find((m) => m.id === 'order');
    if (orderMod) {
      setSelectedModule(orderMod);
      setSelectedSubMenu(orderMod.sub_menus[0]); // order_pos
      setCurrentTab('order');
      setCurrentScreen('feature');
    }
  };

  const handleOpenKitchenDirectly = () => {
    const orderMod = currentNavModules.find((m) => m.id === 'order');
    if (orderMod) {
      setSelectedModule(orderMod);
      setSelectedSubMenu(orderMod.sub_menus[1]); // antrian_dapur
      setCurrentTab('order');
      setCurrentScreen('feature');
    }
  };

  // Order actions
  const handleAddOrder = (newOrder: OrderTicket) => {
    setOrders([newOrder, ...orders]);

    // Automatically deduct inventory stock via ResepEngine
    const cartPayload = newOrder.items.map((item) => ({
      item_name: item.menuName,
      menuName: item.menuName,
      menuId: item.menuId,
      qty: item.qty
    }));
    const updatedIngredients = ResepEngine.deductBahanBaku(cartPayload);
    if (updatedIngredients && updatedIngredients.length > 0) {
      setRawIngredients(updatedIngredients);
    }

    // Sync to PelangganService if customer phone exists
    if (newOrder.customerPhone) {
      const updatedCusts = PelangganService.syncFromTransaction({
        name: newOrder.customerName,
        phone: newOrder.customerPhone,
        total_spent: newOrder.total,
        favorite_item: newOrder.items[0]?.menuName || '-'
      });
      if (updatedCusts) {
        setCustomers(updatedCusts as any);
      }
    } else if (newOrder.customerName && !newOrder.customerName.startsWith('Tamu')) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.name.toLowerCase() === newOrder.customerName.toLowerCase()
            ? {
                ...c,
                totalVisits: c.totalVisits + 1,
                totalSpend: c.totalSpend + newOrder.total,
                points: c.points + Math.floor(newOrder.total / 10000) * 5,
                lastVisit: 'Hari Ini'
              }
            : c
        )
      );
    }

    // Tambah pesanan ke live queue dapur via AntrianService
    AntrianService.addOrderToQueue({
      order_id: newOrder.orderNumber || newOrder.id,
      table_number: newOrder.tableNumber,
      order_type: newOrder.orderType,
      items: newOrder.items.map((i) => ({
        item_name: i.menuName,
        menuName: i.menuName,
        qty: i.qty,
        variant: i.selectedVariants?.join(', ') || '',
        notes: i.notes || ''
      })),
      customer_name: newOrder.customerName,
      status: 'WAITING'
    });
  };

  const handleUpdateKitchenStatus = (orderId: string, status: KitchenStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, kitchenStatus: status } : o))
    );

    // Update live queue dapur via AntrianService
    const queueStatusMap: Record<KitchenStatus, string> = {
      menunggu: 'WAITING',
      proses: 'COOKING',
      siap_saji: 'READY',
      selesai: 'COMPLETED'
    };
    AntrianService.updateStatus(orderId, queueStatusMap[status] || status);
  };

  // Data Safety Actions
  const handleBackupData = () => {
    const backupObj = {
      version: 'KedaiQu 2.0',
      exportedAt: new Date().toISOString(),
      menuItems,
      orders,
      rawIngredients,
      inboundRecords,
      opnameRecords,
      customers,
      vouchers,
      staffList,
      shiftRecords,
      commissions,
      storeProfile,
      geminiConfig
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kedaiqu_backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRestoreData = (backupJson: any) => {
    if (backupJson.menuItems) setMenuItems(backupJson.menuItems);
    if (backupJson.orders) setOrders(backupJson.orders);
    if (backupJson.rawIngredients) setRawIngredients(backupJson.rawIngredients);
    if (backupJson.inboundRecords) setInboundRecords(backupJson.inboundRecords);
    if (backupJson.opnameRecords) setOpnameRecords(backupJson.opnameRecords);
    if (backupJson.customers) setCustomers(backupJson.customers);
    if (backupJson.vouchers) setVouchers(backupJson.vouchers);
    if (backupJson.staffList) setStaffList(backupJson.staffList);
    if (backupJson.shiftRecords) setShiftRecords(backupJson.shiftRecords);
    if (backupJson.commissions) setCommissions(backupJson.commissions);
    if (backupJson.storeProfile) setStoreProfile(backupJson.storeProfile);
    if (backupJson.geminiConfig) setGeminiConfig(backupJson.geminiConfig);
  };

  const handleResetData = (mode: 'daily' | 'factory' | 'clean_slate') => {
    if (mode === 'daily') {
      // Clear today's orders
      setOrders([]);
      localStorage.setItem('kq_orders', '[]');
      alert('Antrian order dan riwayat transaksi harian telah dibersihkan.');
    } else if (mode === 'clean_slate') {
      setMenuItems([]);
      setOrders([]);
      setRawIngredients([]);
      setInboundRecords([]);
      setOpnameRecords([]);
      setCustomers([]);
      setVouchers([]);
      setStaffList([]);
      setShiftRecords([]);
      setCommissions([]);

      localStorage.setItem('kq_menu_items', '[]');
      localStorage.setItem('kq_orders', '[]');
      localStorage.setItem('kq_ingredients', '[]');
      localStorage.setItem('kq_inbounds', '[]');
      localStorage.setItem('kq_opnames', '[]');
      localStorage.setItem('kq_customers', '[]');
      localStorage.setItem('kq_vouchers', '[]');
      localStorage.setItem('kq_staff', '[]');
      localStorage.setItem('kq_shifts', '[]');
      localStorage.setItem('kq_commissions', '[]');
      alert('Seluruh database KedaiQu telah dibersihkan bersih (0 records tersisa).');
    } else if (mode === 'factory') {
      setMenuItems(INITIAL_MENU_ITEMS);
      setOrders(INITIAL_ORDERS);
      setRawIngredients(INITIAL_RAW_INGREDIENTS);
      setInboundRecords(INITIAL_INBOUND_RECORDS);
      setOpnameRecords(INITIAL_OPNAME_RECORDS);
      setCustomers(INITIAL_CUSTOMERS);
      setVouchers(INITIAL_VOUCHERS);
      setStaffList(INITIAL_STAFF);
      setShiftRecords(INITIAL_SHIFTS);
      setCommissions(INITIAL_COMMISSIONS);
      setStoreProfile(INITIAL_STORE_PROFILE);
      setGeminiConfig(INITIAL_GEMINI_CONFIG);

      localStorage.setItem('kq_menu_items', JSON.stringify(INITIAL_MENU_ITEMS));
      localStorage.setItem('kq_orders', JSON.stringify(INITIAL_ORDERS));
      localStorage.setItem('kq_ingredients', JSON.stringify(INITIAL_RAW_INGREDIENTS));
      localStorage.setItem('kq_inbounds', JSON.stringify(INITIAL_INBOUND_RECORDS));
      localStorage.setItem('kq_opnames', JSON.stringify(INITIAL_OPNAME_RECORDS));
      localStorage.setItem('kq_customers', JSON.stringify(INITIAL_CUSTOMERS));
      localStorage.setItem('kq_vouchers', JSON.stringify(INITIAL_VOUCHERS));
      localStorage.setItem('kq_staff', JSON.stringify(INITIAL_STAFF));
      localStorage.setItem('kq_shifts', JSON.stringify(INITIAL_SHIFTS));
      localStorage.setItem('kq_commissions', JSON.stringify(INITIAL_COMMISSIONS));
      localStorage.setItem('kq_profile', JSON.stringify(INITIAL_STORE_PROFILE));
      localStorage.setItem('kq_gemini', JSON.stringify(INITIAL_GEMINI_CONFIG));
      alert('Data demo sampel F&B KedaiQu berhasil dimuat ulang!');
    }
  };

  // Render main screen router
  const renderCurrentView = () => {
    if (currentScreen === 'dashboard') {
      return (
        <HomeDashboard
          modules={currentNavModules}
          onSelectModule={handleSelectModule}
          orders={orders}
          onOpenPos={handleOpenPOSDirectly}
          onOpenKitchen={handleOpenKitchenDirectly}
          storeProfile={storeProfile}
          rawIngredients={rawIngredients}
          activeTemplateId={activeTemplate.id}
          activeTemplateName={activeTemplate.name}
          onSwitchTemplate={handleSwitchTemplate}
        />
      );
    }

    if (currentScreen === 'submenu' && selectedModule) {
      return (
        <SubMenuPage
          module={selectedModule}
          onBack={handleBack}
          onSelectSubMenu={handleSelectSubMenu}
          activeSubMenuId={selectedSubMenu?.id}
        />
      );
    }

    if (currentScreen === 'feature' && selectedModule) {
      switch (selectedModule.id) {
        case 'order':
          return (
            <OrderModuleView
              initialSubMenu={selectedSubMenu?.id || 'order_pos'}
              onBack={handleBack}
              menuItems={menuItems}
              orders={orders}
              onAddOrder={handleAddOrder}
              onUpdateKitchenStatus={handleUpdateKitchenStatus}
              storeProfile={storeProfile}
              customers={customers}
              vouchers={vouchers}
            />
          );

        case 'menu_makanan':
          return (
            <MenuModuleView
              initialSubMenu={selectedSubMenu?.id || 'katalog_menu'}
              onBack={handleBack}
              menuItems={menuItems}
              onUpdateMenuItems={setMenuItems}
              rawIngredients={rawIngredients}
            />
          );

        case 'stok_bahan':
          return (
            <StokModuleView
              initialSubMenu={selectedSubMenu?.id || 'data_bahan'}
              onBack={handleBack}
              rawIngredients={rawIngredients}
              onUpdateRawIngredients={setRawIngredients}
              inboundRecords={inboundRecords}
              onAddInboundRecord={(rec) => setInboundRecords([rec, ...inboundRecords])}
              opnameRecords={opnameRecords}
              onAddOpnameRecord={(op) => setOpnameRecords([op, ...opnameRecords])}
            />
          );

        case 'marketing_pelanggan':
          return (
            <MarketingModuleView
              initialSubMenu={selectedSubMenu?.id || 'database_pelanggan'}
              onBack={handleBack}
              customers={customers}
              onUpdateCustomers={setCustomers}
              vouchers={vouchers}
              onUpdateVouchers={setVouchers}
              storeProfile={storeProfile}
            />
          );

        case 'karyawan':
          return (
            <KaryawanModuleView
              initialSubMenu={selectedSubMenu?.id || 'data_staff'}
              onBack={handleBack}
              staffList={staffList}
              onUpdateStaffList={setStaffList}
              shiftRecords={shiftRecords}
              onAddShiftRecord={(rec) => setShiftRecords([rec, ...shiftRecords])}
              commissions={commissions}
              onUpdateCommissions={setCommissions}
            />
          );

        case 'laporan':
          return (
            <LaporanModuleView
              initialSubMenu={selectedSubMenu?.id || 'lap_omzet'}
              onBack={handleBack}
              orders={orders}
              menuItems={menuItems}
              storeProfile={storeProfile}
            />
          );

        case 'pengaturan':
          return (
            <PengaturanModuleView
              initialSubMenu={selectedSubMenu?.id || 'profil_kedai'}
              onBack={handleBack}
              storeProfile={storeProfile}
              onSaveProfile={setStoreProfile}
              geminiConfig={geminiConfig}
              onSaveGeminiConfig={setGeminiConfig}
              menuItems={menuItems}
              onReloadAllData={handleReloadAllData}
            />
          );

        default:
          return (
            <div className="p-8 text-center text-slate-500">
              Modul tidak ditemukan.
              <button onClick={handleGoHome} className="block mt-4 text-blue-600 font-bold mx-auto">
                Kembali ke Beranda
              </button>
            </div>
          );
      }
    }

    return null;
  };

  const activeKitchenCount = orders.filter((o) => o.kitchenStatus !== 'selesai').length;

  return (
    <AndroidFrame>
      <div className="flex flex-col flex-1 min-h-screen bg-slate-50 overflow-x-hidden">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{renderCurrentView()}</main>

        {/* Global Bottom Navigation Bar */}
        <BottomNavBar
          currentTab={currentTab}
          onTabChange={handleBottomTabChange}
          activeOrderCount={activeKitchenCount}
        />
      </div>
    </AndroidFrame>
  );
}
