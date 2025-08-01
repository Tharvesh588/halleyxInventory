import React, { useState, useEffect } from 'react';
import { usersAPI, authAPI } from '../services/api'; // Import your API services

const UserDashboard = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user profile details on component mount
    const fetchUserProfile = async () => {
      try {
        const response = await authAPI.getProfile(); // Fetch user profile from your API
        setUser(response.data); // Assuming response contains the user data
      } catch (err) {
        setError('Error fetching user profile');
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await usersAPI.update(user.id, user); // Send updated data to the API
      setLoading(false);
      if (response.status === 200) {
        alert('Profile updated successfully!');
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="user-dashboard">
      <h2>User Dashboard</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={user.mobile}
            onChange={handleInputChange}
            placeholder="Enter your mobile number"
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={user.address}
            onChange={handleInputChange}
            placeholder="Enter your address"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            placeholder="Enter your new password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserDashboard;
