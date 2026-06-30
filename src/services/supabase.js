import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── USERS ──────────────────────────────────────────────
export const fetchUsers = async () => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const createUser = async (user) => {
  try {
    const { data, error } = await supabase.from('users').insert([user]);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

// ─── PRODUCTS ───────────────────────────────────────────
export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const updateProductStock = async (productId, newStock) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', productId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating product stock:', error);
    return null;
  }
};

// ─── ORDERS ─────────────────────────────────────────────
export const fetchOrders = async (limit = 100) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const createOrder = async (order) => {
  try {
    const { data, error } = await supabase.from('orders').insert([order]);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
};

// ─── TABLES ─────────────────────────────────────────────
export const fetchTables = async () => {
  try {
    const { data, error } = await supabase.from('tables').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];
  }
};

export const updateTableStatus = async (tableId, status) => {
  try {
    const { data, error } = await supabase
      .from('tables')
      .update({ status })
      .eq('id', tableId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating table status:', error);
    return null;
  }
};

// ─── REAL-TIME SUBSCRIPTIONS ────────────────────────────
export const subscribeToOrders = (callback) => {
  const subscription = supabase
    .channel('orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => callback(payload)
    )
    .subscribe();

  return subscription;
};

export const subscribeToTables = (callback) => {
  const subscription = supabase
    .channel('tables')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tables' },
      (payload) => callback(payload)
    )
    .subscribe();

  return subscription;
};

// ─── ANALYTICS ──────────────────────────────────────────
export const fetchDailySales = async (date) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', `${date}T00:00:00`)
      .lte('created_at', `${date}T23:59:59`);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    return [];
  }
};

export const fetchMonthlySales = async (year, month) => {
  try {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', `${startDate}T00:00:00`)
      .lte('created_at', `${endDate}T23:59:59`);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    return [];
  }
};
