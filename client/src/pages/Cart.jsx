// src/pages/Cart.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center border rounded p-4 shadow-sm">
            <img
              src={item.productId?.image}
              alt={item.productId?.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1 ml-4">
              <h2 className="font-semibold">{item.productId?.name}</h2>
              <p className="text-sm text-gray-600">{item.productId?.category}</p>
              <p className="text-gray-700 mt-1">₹{item.productId?.price}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Qty</p>
              <p>{item.quantity}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.productId._id || item.productId)}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-lg font-semibold">
          Total: ₹{total.toFixed(2)}
        </div>
        <button
          onClick={handleCheckout}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
