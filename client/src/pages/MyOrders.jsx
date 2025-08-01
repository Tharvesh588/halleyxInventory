import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getAll();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white p-4 shadow mb-4">
            <h3 className="font-bold mb-2">Order ID: {order._id}</h3>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item.product.name}</span>
                <span>Qty: {item.quantity}</span>
              </div>
            ))}
            <p className="text-sm text-gray-500 mt-2">Status: {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
