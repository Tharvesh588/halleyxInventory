// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // 🧠 Fetch cart from DB on login
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await cartAPI.get();
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error('❌ Error fetching cart:', err);
      }
    };
    if (user) fetchCart();
  }, [user]);

  // 🛒 Add item to cart
  const addToCart = async (product) => {
    try {
      const existingItem = cartItems.find(
        (item) =>
          item.productId._id === product._id || item.productId === product._id
      );

      let updatedCart;
      if (existingItem) {
        updatedCart = cartItems.map((item) =>
          (item.productId._id || item.productId) === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...cartItems,
          { productId: product._id, quantity: 1, price: product.price },
        ];
      }

      setCartItems(updatedCart);
      await cartAPI.save({ items: updatedCart });
      console.log("✅ Cart updated in DB");
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
    }
  };

  // 🗑️ Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const updatedCart = cartItems.filter(
        (item) =>
          (item.productId._id || item.productId) !== productId
      );
      setCartItems(updatedCart);
      await cartAPI.save({ items: updatedCart });
    } catch (err) {
      console.error("❌ Error removing from cart:", err);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCartItems([]);
    } catch (err) {
      console.error("❌ Error clearing cart:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
