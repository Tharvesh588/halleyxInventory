import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const generateAvatar = (firstName, lastName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}&size=40&bold=true&color=FFFFFF&background=0F766E&rounded=true&format=svg`;
  };

  return (
    <nav className="bg-teal-700 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold tracking-tight">Inventory</span>
            <span className="text-teal-300 font-semibold">App</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Avatar and Info */}
                <div className="flex items-center space-x-2">
                  <img
                    src={generateAvatar(user.firstName, user.lastName)}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full border-2 border-teal-300"
                  />
                  
                </div>

                {/* Admin Link */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-600 transition-all duration-200 ease-in-out"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* User Profile Link */}
                <Link
                  to="/profile"
                  className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-600 transition-all duration-200 ease-in-out"
                >
                  Profile
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium px-4 py-2 rounded-lg bg-teal-800 hover:bg-teal-900 transition-all duration-200 ease-in-out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Login Link */}
                <Link
                  to="/login"
                  className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-600 transition-all duration-200 ease-in-out"
                >
                  Login
                </Link>

                {/* Register Link */}
                <Link
                  to="/register"
                  className="text-sm font-medium px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 transition-all duration-200 ease-in-out"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;