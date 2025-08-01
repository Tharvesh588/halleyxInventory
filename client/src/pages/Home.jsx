import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';


const Home = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { addOrder } = useOrders();
  const [cartItems, setCartItems] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState('');

  const handleAddToCart = (product) => {
  console.log("Adding product to cart:", product); // ✅ Debug log
  addToCart(product);
};


  const handleBuyNow = async (product) => {
    try {
      const item = {
        product: product._id, // 👈 match backend schema
        quantity: 1,
        price: product.price,
      };

      const orderData = {
        items: [item],
        totalAmount: product.price,
      };

      await addOrder(orderData); // ✅ send correct object
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Order failed', error);
      alert('Order failed');
    }
  };




  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.products);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Products Section */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Products</h2>
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products available</p>
                <p className="text-gray-500">Check back later for new items!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-teal-600 font-medium text-lg">
                          ${product.price}
                        </span>
                        <span className="text-gray-500 text-sm">
                          Stock: {product.stock}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="inline-block bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      <div className="mt-4 flex justify-between space-x-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 bg-teal-600 text-white px-3 py-1 text-sm rounded hover:bg-teal-700 transition"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleBuyNow(product)}
                          className="flex-1 bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home; 