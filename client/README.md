# Inventory App - Frontend

A React frontend for the Inventory Management System built with Vite.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

## Features

- **Authentication**: Login and registration with JWT tokens
- **User Roles**: Admin and customer roles with different permissions
- **Product Management**: View, add, edit, and delete products (admin only)
- **Responsive Design**: Built with Tailwind CSS for mobile-friendly interface
- **Protected Routes**: Role-based access control

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context providers
├── pages/          # Page components
├── routes/         # Routing configuration
├── services/       # API service functions
└── App.jsx         # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Backend Integration

Make sure the backend server is running on `http://localhost:5000` before using the frontend.
