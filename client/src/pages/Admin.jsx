
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI, usersAPI } from '../services/api';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Table = ({ headers, data, renderRow, className }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-teal-50 text-teal-700">
        <tr>
          {headers.map((header, i) => (
            <th key={i} className="p-4 text-left font-semibold">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item._id || index} className="border-t hover:bg-teal-50">
            {renderRow(item)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UserCard = ({ user, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer">
      <div 
        className="flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {user.isBlocked ? 'Blocked' : 'Active'}
        </span>
      </div>
      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-gray-800">{user.role}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => onEdit(user)}
              className="text-teal-600 hover:text-teal-800"
              aria-label={`Edit ${user.firstName} ${user.lastName}`}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(user._id)}
              className="text-red-600 hover:text-red-800"
              aria-label={`Delete ${user.firstName} ${user.lastName}`}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [productFormData, setProductFormData] = useState({
    name: '', description: '', price: '', category: '', stock: '', image: ''
  });

  const [userFormData, setUserFormData] = useState({
    firstName: '', lastName: '', role: 'customer', isBlocked: false
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Access denied. Admin role required.');
      setLoading(false);
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [productsRes, usersRes] = await Promise.all([
        productsAPI.getAll(),
        usersAPI.getAll()
      ]);
      setProducts(productsRes.data.products);;
      setUsers(usersRes.data);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (e) => {
    setProductFormData({ ...productFormData, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserFormData({ ...userFormData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, productFormData);
      } else {
        await productsAPI.create(productFormData);
      }
      resetProductForm();
      setShowProductModal(false);
      fetchData();
    } catch {
      setError('Failed to save product');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.update(editingUser._id, userFormData);
      setShowUserModal(false);
      setEditingUser(null);
      fetchData();
    } catch {
      setError('Failed to update user');
    }
  };

  const handleDelete = async (id, type) => {
    if (type === 'product') {
      if (window.confirm(`Delete this product?`)) {
        try {
          await productsAPI.delete(id);
          fetchData();
        } catch {
          setError('Failed to delete product');
        }
      }
    } else {
      setDeleteUserId(id);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteUser = async () => {
    try {
      await usersAPI.delete(deleteUserId);
      setShowDeleteModal(false);
      setDeleteUserId(null);
      fetchData();
    } catch {
      setError('Failed to delete user');
    }
  };

  const resetProductForm = () => {
    setProductFormData({ name: '', description: '', price: '', category: '', stock: '', image: '' });
    setEditingProduct(null);
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: product.image || ''
      });
    } else {
      resetProductForm();
    }
    setShowProductModal(true);
  };

  const openUserModal = (user) => {
    setEditingUser(user);
    setUserFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isBlocked: user.isBlocked
    });
    setShowUserModal(true);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
          Access denied. Admin role required.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-6 py-3 rounded-lg flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Products Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
            <button
              onClick={() => openProductModal()}
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
              aria-label="Add new product"
            >
              Add Product
            </button>
          </div>
          <Table
            headers={['Name', 'Category', 'Price', 'Stock', 'Actions']}
            data={products}
            renderRow={(p) => (
              <>
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">${p.price}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => openProductModal(p)}
                    className="text-teal-600 hover:text-teal-800"
                    aria-label={`Edit ${p.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id, 'product')}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Delete ${p.name}`}
                  >
                    Delete
                  </button>
                </td>
              </>
            )}
          />
        </section>

        {/* Users Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onEdit={openUserModal}
                onDelete={(id) => handleDelete(id, 'user')}
              />
            ))}
          </div>
        </section>

        {/* Product Modal */}
        <Modal
          isOpen={showProductModal}
          onClose={() => { setShowProductModal(false); resetProductForm(); }}
          title={editingProduct ? 'Edit Product' : 'Add Product'}
        >
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  value={productFormData.name}
                  onChange={handleProductChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  name="category"
                  value={productFormData.category}
                  onChange={handleProductChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={productFormData.description}
                  onChange={handleProductChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  required
                  aria-required="true"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={productFormData.price}
                    onChange={handleProductChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={productFormData.stock}
                    onChange={handleProductChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                    aria-required="true"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  name="image"
                  type="url"
                  value={productFormData.image}
                  onChange={handleProductChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={() => { setShowProductModal(false); resetProductForm(); }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
            </div>
          </form>
        </Modal>

        {/* User Modal */}
        <Modal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          title="Edit User"
        >
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  name="firstName"
                  value={userFormData.firstName}
                  onChange={handleUserChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  name="lastName"
                  value={userFormData.lastName}
                  onChange={handleUserChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={userFormData.role}
                  onChange={handleUserChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                >
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isBlocked"
                  checked={userFormData.isBlocked}
                  onChange={handleUserChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Blocked</label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Update User
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteUser}
          title="Confirm Delete"
          message="Are you sure you want to delete this user? This action cannot be undone."
        />
      </div>
    </div>
  );
};
export default Admin;