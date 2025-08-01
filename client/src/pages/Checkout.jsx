import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ordersAPI, cartAPI } from '../services/api';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + (item.productId.price || 0) * (item.quantity || 0),
    0
  );

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.productId._id,
          quantity: item.quantity
        }))
      };

      await ordersAPI.create(orderData);
      await cartAPI.clear();
      clearCart();

      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Failed to place order!');
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Address Section */}
        <div className="md:col-span-2 bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-3">Delivery Address</h3>
          <div className="border p-3 rounded">
            <p className="font-medium">Tharvesh Muhaideen</p>
            <p>123, Main Street, Nagapattinam, TN - 611001</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>

          <div className="max-h-56 overflow-y-auto border rounded mb-3">
            {cartItems.map(item => (
              <div
                key={item.productId._id}
                className="flex justify-between items-center border-b p-2"
              >
                <div>
                  <p className="font-semibold">{item.productId.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{item.productId.price} × {item.quantity}
                  </p>
                </div>
                <p>₹{item.productId.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-2 font-semibold text-lg">
            Total: ₹{total.toFixed(2)}
          </div>

          {/* Dummy payment method */}
          <div className="mt-4">
            <label className="block mb-1 font-medium">Payment Method</label>
            <select className="w-full border rounded p-2">
              <option value="cod">Cash on Delivery</option>
              <option value="upi">UPI (Not functional)</option>
              <option value="card">Credit/Debit Card (Mock only)</option>
            </select>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
