/**
 * HERCO Constants - Multi-Tenancy & Global Config
 */

// Sites (Établissements)
export const INITIAL_SITES = [
  { id: 1, name: 'HERCO Brazzaville', type: 'Restaurant & Bar', status: 'active', createdAt: '2026-01-01' },
  { id: 2, name: 'Oasis Club', type: 'Boîte de Nuit', status: 'active', createdAt: '2026-05-15' },
];

// Catégories de produits
export const PRODUCT_CATEGORIES = [
  { id: 1, name: 'Plats Chauds', icon: '🍽️', color: '#C97D1A' },
  { id: 2, name: 'Poissons', icon: '🐟', color: '#1A7AB5' },
  { id: 3, name: 'Grillades', icon: '🔥', color: '#C84B1A' },
  { id: 4, name: 'Entrées', icon: '🥗', color: '#2E9E6B' },
  { id: 5, name: 'Bières', icon: '🍺', color: '#E6AC00' },
  { id: 6, name: 'Softs', icon: '🥤', color: '#7B5EA7' },
  { id: 7, name: 'Alcools', icon: '🥃', color: '#1A6B7A' },
  { id: 8, name: 'Desserts', icon: '🍰', color: '#C91A7A' },
];

// Produits par défaut avec siteId
export const DEFAULT_PRODUCTS = [
  { id: 1, siteId: 1, catId: 1, name: 'Saka-Saka au Poisson', unit: 'Portion', costPrice: 1500, priceTTC: 3500, stock: 20, active: true, icon: '🍲' },
  { id: 2, siteId: 1, catId: 1, name: 'Moambe Poulet', unit: 'Portion', costPrice: 2000, priceTTC: 4500, stock: 15, active: true, icon: '🍗' },
  { id: 3, siteId: 2, catId: 7, name: 'Champagne Brut', unit: 'Bouteille', costPrice: 45000, priceTTC: 75000, stock: 12, active: true, icon: '🍾' },
  { id: 4, siteId: 1, catId: 5, name: 'Primus 65cl', unit: 'Bouteille', costPrice: 700, priceTTC: 1500, stock: 100, active: true, icon: '🍺' },
];

// Utilisateurs avec siteId et SuperAdmin
export const DEFAULT_USERS = [
  { id: 1, siteId: 1, name: 'Admin HERCO', pin: '1234', role: 'admin', active: true },
  { id: 2, siteId: 1, name: 'Caissier 1', pin: '0001', role: 'caissier', active: true },
  { id: 3, siteId: 1, name: 'Serveur 1', pin: '0002', role: 'serveur', active: true },
  { id: 4, siteId: 2, name: 'Admin Oasis', pin: '1234', role: 'admin', active: true },
  { id: 99, siteId: 0, name: 'SUPER ADMIN', pin: '8888', role: 'superadmin', active: true }, // Code Secret SuperAdmin
];

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Espèces', icon: '💵', color: '#10B981' },
  { id: 'card', name: 'Carte Bancaire', icon: '💳', color: '#3B82F6' },
  { id: 'mobile', name: 'Mobile Money', icon: '📱', color: '#F59E0B' },
];

export const TAX_RATE = 0.18;

export const formatFCFA = (amount) => {
  return Math.round(amount || 0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

export default {
  INITIAL_SITES,
  PRODUCT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_USERS,
  PAYMENT_METHODS,
  TAX_RATE,
  formatFCFA,
};
