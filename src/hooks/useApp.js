import { useState, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer l'état global de l'application HERCO
 */
export const useApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentOrder, setCurrentOrder] = useState({
    items: [],
    table: null,
    notes: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const addToOrder = useCallback((product, quantity = 1) => {
    setCurrentOrder(prev => {
      const existingItem = prev.items.find(item => item.id === product.id);
      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        ...prev,
        items: [...prev.items, { ...product, quantity }],
      };
    });
  }, []);

  const removeFromOrder = useCallback((productId) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== productId),
    }));
  }, []);

  const updateItemQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromOrder(productId);
      return;
    }
    setCurrentOrder(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ),
    }));
  }, [removeFromOrder]);

  const clearOrder = useCallback(() => {
    setCurrentOrder({ items: [], table: null, notes: '' });
  }, []);

  const calculateOrderTotal = useCallback(() => {
    return currentOrder.items.reduce(
      (total, item) => total + item.priceTTC * item.quantity,
      0
    );
  }, [currentOrder.items]);

  const calculateTax = useCallback(() => {
    const total = calculateOrderTotal();
    return Math.round(total - total / 1.18);
  }, [calculateOrderTotal]);

  const login = useCallback((user) => {
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    clearOrder();
  }, [clearOrder]);

  return {
    // User state
    currentUser,
    login,
    logout,

    // Order state
    currentOrder,
    addToOrder,
    removeFromOrder,
    updateItemQuantity,
    clearOrder,
    calculateOrderTotal,
    calculateTax,

    // Search state
    searchQuery,
    setSearchQuery,
  };
};

export default useApp;
