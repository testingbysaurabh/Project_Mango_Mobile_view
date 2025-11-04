# Restaurant Discovery & Ordering Platform 🍽️

## Project Overview

A modern, mobile-first restaurant discovery and food ordering platform built with React and Vite. The application showcases a clean, professional design with smooth animations, efficient data loading, and a robust authentication system.

##  Tech Stack

### Core Technologies

- **React 18** - Latest version with improved performance and concurrent features
- **Vite 7** - Lightning-fast build tool and development server
- **React Router v7** - For seamless client-side routing
- **Axios** - For efficient HTTP requests
- **TailwindCSS** - For modern, utility-first styling

### Key Features

1. **Authentication System**

   - Phone number-based authentication
   - OTP verification
   - Secure token management
   - Protected routes

2. **Performance Optimizations**

   - Lazy loading of components
   - Image fallback system
   - Efficient error handling
   - Suspense for better loading states
   - Custom loading skeletons

3. **Modern UI Components**
   - Carousel with touch/swipe support
   - Banner slider with auto-rotation
   - Responsive cards and grids
   - Toast notifications
   - Loading skeletons for better UX

## 📱 Mobile-First Architecture

The application is designed with a mobile-first approach, featuring:

- iPhone-like viewport (375x812)
- Touch-optimized interactions
- Smooth animations and transitions
- Responsive image handling
- Efficient state management

## 🔐 Security Features

1. **Token Management**

   - Secure token storage in localStorage
   - Automatic token injection in API requests
   - Token cleanup on logout
   - Protected route guards

2. **API Security**
   - Axios interceptors for request/response handling
   - Automatic HTTPS upgrade for image URLs
   - Timeout handling for API requests
   - Error boundary implementation

## 💡 Smart Features

1. **Image Handling**

   - Fallback image system
   - Progressive image loading
   - Auto-retry on image load failure
   - Efficient caching strategy

2. **State Management**

   - Context API for global state
   - Custom hooks for reusable logic
   - Efficient component state management
   - Cleanup on component unmount

3. **User Experience**
   - Skeleton loaders for better perceived performance
   - Toast notifications for user feedback
   - Smooth animations and transitions
   - Intuitive error messages

## 🛠️ Development Features

1. **Code Organization**

   - Component-based architecture
   - Utility functions separation
   - Context-based state management
   - Clean and maintainable code structure

2. **Build Tools**
   - Vite for fast development and building
   - ESLint for code quality
   - Modern JavaScript features (ES6+)
   - Development proxy configuration

##  Project Structure

```
src/
├── components/         # React components
│   ├── HomeV2.jsx     # Main home page
│   ├── Register.jsx   # Authentication
│   ├── ProductDetail.jsx
│   └── ...
├── Utils/             # Utilities
│   ├── auth.js        # Authentication utilities
│   └── Context/       # React Context
├── assets/            # Static assets
└── App.jsx           # Main application
```

## 🔧 Installation & Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## 🌟 Best Practices Implemented

1. **Code Quality**

   - ESLint configuration
   - Proper error handling
   - Clean code principles
   - Component reusability

2. **Performance**

   - Lazy loading
   - Image optimization
   - Efficient state updates
   - Proper cleanup in useEffect

3. **Security**

   - Token-based authentication
   - Protected routes
   - Secure data handling
   - Error boundaries

4. **User Experience**
   - Loading states
   - Error feedback
   - Smooth animations
   - Intuitive UI/UX

## 🎯 Key Achievements

1. **Performance**

   - Fast initial load time
   - Smooth animations and transitions
   - Efficient data fetching
   - Optimized image loading

2. **User Experience**

   - Intuitive authentication flow
   - Smooth navigation
   - Professional UI design
   - Responsive layout

3. **Code Quality**
   - Clean and maintainable code
   - Proper error handling
   - Well-organized structure
   - Reusable components

This project demonstrates professional-grade React development with modern best practices, focusing on performance, user experience, and code quality. Perfect for showcasing full-stack development skills in interviews.
