import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import styles from './Home.module.css';

const Home = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.center}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Welcome Section */}
        {user ? (
          <div className={styles.welcomeBox}>
            <h1>
              Welcome, {user.firstName}!
            </h1>
            <p>
              You are logged in as a <span style={{ fontWeight: 600 }}>{user.role}</span>
            </p>
          </div>
        ) : (
          <div className={styles.welcomeBox}>
            <h1>
              Welcome to Inventory App
            </h1>
            <p>
              Please login or register to access all features
            </p>
          </div>
        )}

        {/* Products Section */}
        <div className={styles.productsBox}>
          <h2>Available Products</h2>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {products.length === 0 ? (
            <div className={styles.empty}>
              <p>No products available</p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <div key={product._id} className={styles.productCard}>
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className={styles.productImage}
                    />
                  )}
                  <div className={styles.productContent}>
                    <h3 className={styles.productTitle}>
                      {product.name}
                    </h3>
                    <p className={styles.productDesc}>
                      {product.description}
                    </p>
                    <div className={styles.productFooter}>
                      <span className={styles.price}>
                        ${product.price}
                      </span>
                      <span className={styles.stock}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div>
                      <span className={styles.category}>
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 