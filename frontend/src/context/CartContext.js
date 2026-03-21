import React, { createContext, useState, useContext } from 'react';
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { ...product, quantity }];
    });
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));
  const updateQuantity = (id, qty) => { if (qty <= 0) return removeFromCart(id); setCart(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i)); };
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>{children}</CartContext.Provider>;
};
export const useCart = () => useContext(CartContext);
