import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI, usersAPI } from '../services/api';

const Admin = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: '', image: ''
  });

  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    firstName: '', lastName: '', role: 'customer', isBlocked: false
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Access denied. Admin role required.');
      return;
    }
    fetchProducts();
    fetchUsers();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getAll();
      setProducts(res.data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await usersAPI.getAll();
      setUsers(res.data);
    } catch {
      setError('Failed to load users');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, formData);
      } else {
        await productsAPI.create(formData);
      }
      resetForm();
      setShowAddForm(false);
      fetchProducts();
    } catch {
      setError('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Delete this product?')) {
      try {
        await productsAPI.delete(productId);
        fetchProducts();
      } catch {
        setError('Failed to delete product');
      }
    }
  };

  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleUserEdit = (user) => {
    setEditingUser(user);
    setUserFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isBlocked: user.isBlocked
    });
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.update(editingUser._id, userFormData);
      setEditingUser(null);
      fetchUsers();
    } catch {
      setError('Failed to update user');
    }
  };

  const handleUserDelete = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await usersAPI.delete(id);
        fetchUsers();
      } catch {
        setError('Failed to delete user');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '', stock: '', image: '' });
    setEditingProduct(null);
  };

  const cancelForm = () => {
    resetForm();
    setShowAddForm(false);
  };

  if (user?.role !== 'admin') {
    return <div className="p-10 text-xl text-red-600">Access denied. Admin role required.</div>;
  }

  if (loading) {
    return <div className="p-10 text-xl text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}

        {/* --- Product Section --- */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Products</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Product
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
              </div>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
              <div className="grid grid-cols-3 gap-4">
                <input name="price" type="number" min="0" value={formData.price} onChange={handleChange} placeholder="Price" required />
                <input name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} placeholder="Stock" required />
                <input name="image" type="url" value={formData.image} onChange={handleChange} placeholder="Image URL" />
              </div>
              <div className="space-x-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
                <button type="button" onClick={cancelForm} className="bg-gray-600 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <table className="w-full bg-white shadow rounded overflow-hidden">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">${p.price}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* --- Users Section --- */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Blocked</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.firstName} {u.lastName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.isBlocked ? 'Yes' : 'No'}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleUserEdit(u)} className="text-blue-600">Edit</button>
                    <button onClick={() => handleUserDelete(u._id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingUser && (
            <form onSubmit={handleUserUpdate} className="bg-white p-4 mt-6 rounded shadow space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" value={userFormData.firstName} onChange={handleUserChange} placeholder="First Name" required />
                <input name="lastName" value={userFormData.lastName} onChange={handleUserChange} placeholder="Last Name" required />
              </div>
              <select name="role" value={userFormData.role} onChange={handleUserChange}>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
              <label className="block">
                <input type="checkbox" name="isBlocked" checked={userFormData.isBlocked} onChange={handleUserChange} />
                <span className="ml-2">Blocked</span>
              </label>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update User</button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;
