import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://tsiwhingmchlxcpvrjvw.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── USERS ──────────────────────────────────────────────
export const fetchUsers = async () => {
  try {
    const { data, error } = await supabase.from('app_users').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// ─── PRODUCTS ───────────────────────────────────────────
export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase.from('products').select('*, categories(*)');
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
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const createOrder = async (orderData, items) => {
  try {
    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    
    if (orderError) throw orderError;

    // 2. Create the order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.qty,
      unit_price: item.priceTTC
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

// ─── TABLES ─────────────────────────────────────────────
export const fetchTables = async () => {
  try {
    const { data, error } = await supabase.from('restaurant_tables').select('*');
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
      .from('restaurant_tables')
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
  return supabase
    .channel('orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => callback(payload)
    )
    .subscribe();
};

export const subscribeToTables = (callback) => {
  return supabase
    .channel('restaurant_tables')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'restaurant_tables' },
      (payload) => callback(payload)
    )
    .subscribe();
};
