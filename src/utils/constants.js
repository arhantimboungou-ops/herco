/**
 * HERCO Constants - Données statiques et configurations
 */

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

// Produits par défaut
export const DEFAULT_PRODUCTS = [
  { id: 1, catId: 1, name: 'Saka-Saka au Poisson', unit: 'Portion', costPrice: 1500, priceTTC: 3500, stock: 20, stockMin: 5, active: true },
  { id: 2, catId: 1, name: 'Moambe Poulet', unit: 'Portion', costPrice: 2000, priceTTC: 4500, stock: 15, stockMin: 4, active: true },
  { id: 3, catId: 1, name: 'Maboke Capitaine', unit: 'Portion', costPrice: 2500, priceTTC: 5500, stock: 10, stockMin: 3, active: true },
  { id: 4, catId: 1, name: 'Riz Sauce Arachide', unit: 'Portion', costPrice: 1200, priceTTC: 3000, stock: 25, stockMin: 6, active: true },
  { id: 5, catId: 1, name: 'Ntoba Mbinzo', unit: 'Portion', costPrice: 1800, priceTTC: 4000, stock: 12, stockMin: 3, active: true },
  { id: 6, catId: 2, name: 'Capitaine Braisé', unit: 'Pièce', costPrice: 3000, priceTTC: 6500, stock: 8, stockMin: 2, active: true },
  { id: 7, catId: 2, name: 'Silure Fumé', unit: 'Portion', costPrice: 2000, priceTTC: 4500, stock: 10, stockMin: 3, active: true },
  { id: 8, catId: 2, name: 'Carpe Braisée', unit: 'Pièce', costPrice: 2200, priceTTC: 5000, stock: 8, stockMin: 2, active: true },
  { id: 9, catId: 3, name: 'Poulet Braisé ½', unit: '½ Poulet', costPrice: 2500, priceTTC: 5500, stock: 15, stockMin: 4, active: true },
  { id: 10, catId: 3, name: 'Poulet Entier', unit: 'Entier', costPrice: 4500, priceTTC: 10000, stock: 8, stockMin: 2, active: true },
  { id: 15, catId: 5, name: 'Primus 65cl', unit: 'Bouteille', costPrice: 700, priceTTC: 1500, stock: 100, stockMin: 20, active: true },
  { id: 16, catId: 5, name: 'Ngok 65cl', unit: 'Bouteille', costPrice: 700, priceTTC: 1500, stock: 80, stockMin: 20, active: true },
  { id: 20, catId: 6, name: 'Coca-Cola 50cl', unit: 'Bouteille', costPrice: 350, priceTTC: 800, stock: 100, stockMin: 20, active: true },
];

// Utilisateurs par défaut
export const DEFAULT_USERS = [
  { id: 1, name: 'Admin HERCO', pin: '1234', role: 'admin', active: true },
  { id: 2, name: 'Caissier 1', pin: '0001', role: 'caissier', active: true },
  { id: 3, name: 'Serveur 1', pin: '0002', role: 'serveur', active: true },
];

// Tables par défaut
export const DEFAULT_TABLES = [
  { id: 1, name: 'T01', zone: 'Salle', cap: 4, status: 'libre' },
  { id: 2, name: 'T02', zone: 'Salle', cap: 4, status: 'libre' },
  { id: 3, name: 'T03', zone: 'Salle', cap: 6, status: 'libre' },
  { id: 4, name: 'T04', zone: 'Salle', cap: 2, status: 'libre' },
  { id: 5, name: 'T05', zone: 'Salle', cap: 4, status: 'libre' },
  { id: 6, name: 'T06', zone: 'Salle', cap: 8, status: 'libre' },
  { id: 7, name: 'P01', zone: 'Terrasse', cap: 4, status: 'libre' },
  { id: 8, name: 'P02', zone: 'Terrasse', cap: 6, status: 'libre' },
  { id: 9, name: 'B01', zone: 'Bar', cap: 2, status: 'libre' },
  { id: 10, name: 'B02', zone: 'Bar', cap: 2, status: 'libre' },
  { id: 11, name: 'B03', zone: 'Bar', cap: 2, status: 'libre' },
  { id: 12, name: 'VIP1', zone: 'VIP', cap: 8, status: 'libre' },
];

// Modes de paiement
export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Espèces', icon: '💵', color: '#10B981' },
  { id: 'card', name: 'Carte Bancaire', icon: '💳', color: '#3B82F6' },
  { id: 'mobile', name: 'Mobile Money', icon: '📱', color: '#F59E0B' },
];

// Constantes de calcul
export const TAX_RATE = 0.18; // 18% TVA
export const SERVICE_CHARGE_RATE = 0.05; // 5% frais de service (optionnel)

// Format FCFA
export const formatFCFA = (amount) => {
  return Math.round(amount || 0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

export default {
  PRODUCT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_USERS,
  DEFAULT_TABLES,
  PAYMENT_METHODS,
  TAX_RATE,
  SERVICE_CHARGE_RATE,
  formatFCFA,
};
