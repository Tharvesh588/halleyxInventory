# Inventory App - Backend

A Node.js/Express backend for the Inventory Management System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/inventory-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires token)

### Products
- `GET /api/products` - Get all active products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

## Models

### User
- firstName, lastName, email, password, role, isBlocked

### Product
- name, description, price, category, stock, image, isActive

### Order
- customer, items, totalAmount, status, shippingAddress, paymentStatus

## Authentication

JWT tokens are used for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
``` 