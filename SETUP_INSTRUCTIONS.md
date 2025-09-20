# Ice Cream Franchise Management System - Setup Instructions

## 🍦 Overview
This is a complete ice cream franchise management system with role-based access control. The system supports both admin and branch user roles with different permissions and features.

## 🚀 Features

### Admin Features
- **Full Access**: Add, edit, delete branches, sales, and ingredient requests
- **Admin Dashboard**: Complete overview of all franchise operations
- **User Management**: View all users and their activities
- **Analytics**: Charts and statistics across all branches

### Branch User Features
- **View Only**: Can view their branch data (sales, ingredients, branches)
- **User Dashboard**: Personalized dashboard with branch-specific metrics
- **Registration**: One-time registration with username, password, and branch
- **Persistent Login**: Users can close and reopen the site, login with same credentials

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### 1. Server Setup
```bash
cd server
npm install
```

### 2. Client Setup
```bash
cd client
npm install
```

### 3. Environment Variables
Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/icecream
JWT_SECRET=your-secret-key-here
PORT=5000
```

### 4. Database Seeding
```bash
cd server
node src/seed.js
```

This will create:
- Admin user: `username=admin`, `password=admin123`
- Branch users: `username=hasthampatti/busstand/chennai/bangalore`, `password=user123`
- Sample branches, sales, and ingredient requests

### 5. Start the Application

#### Start Server
```bash
cd server
npm start
```

#### Start Client
```bash
cd client
npm run dev
```

## 🎯 Testing the Application

### Admin Login Test
1. Go to `http://localhost:5173/login`
2. Login with `admin` / `admin123`
3. You should see the Admin Dashboard with:
   - Complete overview of all operations
   - Ability to add/edit/delete branches, sales, ingredients
   - Analytics and charts

### User Registration Test
1. Go to `http://localhost:5173/login`
2. Click "Don't have an account? Sign up"
3. Fill in registration form:
   - Username: `testuser`
   - Password: `password123`
   - Confirm Password: `password123`
   - Branch Name: `Test Branch`
4. Submit and you should be logged in as a branch user

### User Login Test
1. Use any of the seeded branch users:
   - `hasthampatti` / `user123`
   - `busstand` / `user123`
   - `chennai` / `user123`
   - `bangalore` / `user123`
2. You should see the User Dashboard with:
   - Branch-specific data only
   - View-only access to branches, sales, ingredients
   - No add/edit/delete buttons

## 🔐 Role-Based Access Control

### Admin Permissions
- ✅ View all data across all branches
- ✅ Add, edit, delete branches
- ✅ Add, edit, delete sales
- ✅ Add, edit, delete ingredient requests
- ✅ Approve/reject ingredient requests
- ✅ Access admin dashboard with analytics

### Branch User Permissions
- ✅ View only their branch data
- ✅ View branches, sales, ingredients (read-only)
- ❌ Cannot add, edit, or delete any data
- ✅ Access user dashboard with branch-specific metrics

## 🎨 UI Features

### Animations
- Fade-in animations for page loads
- Bounce effects for interactive elements
- Hover animations for buttons and cards
- Loading spinners for async operations

### Responsive Design
- Mobile-friendly layout
- Grid-based responsive design
- Touch-friendly buttons and inputs

### Visual Elements
- Ice cream themed color palette
- Gradient backgrounds
- Animated emojis and icons
- Card-based layout with shadows

## 📱 Pages Overview

### Admin Pages
- **Admin Home**: Complete dashboard with analytics
- **Dashboard**: Detailed charts and statistics
- **Branches**: Manage all branches (CRUD)
- **Sales**: Manage all sales (CRUD)
- **Ingredients**: Manage ingredient requests (CRUD)

### User Pages
- **User Home**: Welcome page with branch info
- **Dashboard**: Branch-specific metrics
- **Branches**: View branch information (read-only)
- **Sales**: View sales data (read-only)
- **Ingredients**: View ingredient requests (read-only)

## 🔧 Technical Implementation

### Frontend
- React with Vite
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS enabled

### Security
- Role-based route protection
- JWT token authentication
- Password hashing
- Input validation
- Error handling

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Ensure MongoDB is running
2. **Port Conflicts**: Check if ports 3000/5000 are available
3. **CORS Issues**: Verify server CORS configuration
4. **Authentication**: Check JWT secret in environment variables

### Logs
- Server logs: Check terminal where server is running
- Client logs: Check browser console
- Database logs: Check MongoDB logs

## 📞 Support

For any issues or questions:
1. Check the console logs for error messages
2. Verify all environment variables are set
3. Ensure database is properly seeded
4. Check network connectivity between client and server

## 🎉 Success Criteria

The application is working correctly when:
- ✅ Admin can login and see admin dashboard
- ✅ Admin can add/edit/delete branches, sales, ingredients
- ✅ Users can register with username, password, branch
- ✅ Users can login and see only their branch data
- ✅ Users cannot add/edit/delete any data
- ✅ All pages have smooth animations and responsive design
- ✅ Role-based access control is properly enforced
