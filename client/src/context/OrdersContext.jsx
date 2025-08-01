import React, { createContext, useContext, useEffect, useState } from 'react';
import { ordersAPI } from '../services/api';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const fetchOrders = async () => {
        try {
          const res = await ordersAPI.getAll();
          setOrders(res.data);
        } catch (error) {
          console.error('Failed to fetch orders', error);
        }
      };
      fetchOrders();
    }
  }, [user, loading]);

  const addOrder = async (orderData) => {
    try {
      const response = await ordersAPI.create(orderData);
      return response.data;
    } catch (err) {
      console.error("Failed to create order", err);
      throw err;
    }
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
