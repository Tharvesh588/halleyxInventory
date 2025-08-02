# 🏪 Inventory App - Fullstack MERN Application

A complete inventory management system built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication, role-based access control, and product management.

## ⚠️Cant able to uplaod video⚠️

## 🚀 Features

### ✅ Backend (Node.js + Express + MongoDB)
- **JWT Authentication** with bcrypt password hashing
- **User Management** with admin and customer roles
- **Product CRUD Operations** with admin-only access
- **MongoDB Integration** with Mongoose ODM
- **RESTful API** with proper error handling
- **Middleware** for route protection and role verification

### ✅ Frontend (React + Vite)
- **Modern UI** with Tailwind CSS
- **Responsive Design** for all devices
- **Protected Routes** based on user roles
- **Real-time Updates** with React Context
- **Form Validation** and error handling
- **Admin Panel** for product management

## 📁 Project Structure

```
ProjectHalleyx/
├── server/                 # Backend Node.js application
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Routing configuration
│   │   ├── services/      # API service functions
│   │   └── App.jsx        # Main app component
│   └── package.json       # Frontend dependencies
└── README.md              # Project documentation
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/inventory-app
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full access to product management, user management
- **Customer**: View products, place orders (future feature)

### API Endpoints
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

## 🎨 UI Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, loading states
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Toast notifications for actions

## 🔧 Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## 🚀 Deployment

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Set environment variables in your hosting platform
- Ensure MongoDB connection string is properly configured

### Frontend Deployment
- Build the project: `npm run build`
- Deploy to platforms like Vercel, Netlify, or GitHub Pages
- Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

**Happy Coding! 🎉** 
