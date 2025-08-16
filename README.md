# Rently

A comprehensive React Native rental property management application with multi-tenant support, maintenance workflows, chat messaging, and role-based access control. Built with a PostgreSQL database and Express.js server.

## 🚀 Features

### **Core Functionality**
- **User Authentication & Authorization**
  - Multi-role user system (tenant, landlord, workman, admin)
  - User registration with organization support for landlords
  - Secure login/logout with JWT tokens
  - Password hashing with bcrypt
  - Role-based access control

- **Multi-Tenancy Support**
  - Organization-based property management
  - Landlords can manage multiple properties under their organization
  - Tenant isolation and data privacy
  - Subscription plan support

- **Property Management**
  - Premises and rental unit management
  - Lease management and tracking
  - Rental listings with status management
  - Property amenities and features

### **Maintenance Request System** ✅ **COMPLETED**
- **Complete Workflow Management**
  - Tenant maintenance request creation with type and priority selection
  - Landlord approval/rejection workflow with comments
  - Work order assignment to workmen with detailed instructions
  - Real-time status tracking with progress visualization
  - Tenant rating and feedback system for completed work

- **Advanced Features**
  - Request types (routine, urgent, emergency)
  - Priority levels (low, medium, high, critical)
  - Cost estimation and tracking
  - Work order management with time tracking
  - Comprehensive status workflow (pending → approved → assigned → in_progress → completed)

- **Role-Based Maintenance UI** ✅ **NEW**
  - **Landlord Maintenance Screen**: Request approval, work order assignment, status monitoring
  - **Workman Maintenance Screen**: Task management, status updates, performance tracking
  - **Tenant Maintenance Screen**: Request submission, progress tracking, work order details, rating system

### **Chat & Communication**
- **Real-time Messaging**
  - Direct messaging between users
  - Landlord-tenant communication
  - Conversation management
  - Message history and threading

### **Profile & Organization Management**
- **User Profiles**
  - Comprehensive user information
  - Profile image support
  - Account verification status
  - Organization membership details

- **Organization Management**
  - Landlord organization setup
  - Property portfolio management
  - Subscription plan management

## 🛠️ Tech Stack

### **Frontend**
- React Native with Expo
- React Navigation (Stack + Bottom Tabs)
- React Native Paper for Material Design UI
- Expo Secure Store for secure storage
- TypeScript for type safety

### **Backend**
- Node.js with Express.js
- PostgreSQL database with advanced indexing
- JWT for authentication
- bcrypt for password hashing
- Express Validator for input validation
- Multi-tenant database architecture

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Expo CLI
- React Native development environment

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd rently
```

### 2. Install dependencies
```bash
# Install all dependencies
npm install
```

### 3. Database Setup

#### Option A: Using the setup script (Recommended)
```bash
# Create a .env file with your database credentials
cp .env.example .env
# Edit .env with your actual database credentials

# Run the complete database setup with sample data
npm run db:push
```

#### Option B: Manual setup
1. Create a PostgreSQL database named `rently`
2. Update the `.env` file with your database credentials
3. Run `node server/setup-db.js` to create tables
4. Run `node server/seed-db.js` to populate sample data

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=rently
DB_PASSWORD=your_password_here
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Server Configuration
PORT=3000

# Environment
NODE_ENV=development
```

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup & Seeding**
   - Create a PostgreSQL database named `rently`
   - Copy `.env.example` to `.env` and update your database credentials
   - Run the complete database setup with sample data:
   ```bash
   npm run db:push
   ```
   
   This will:
   - Create all necessary tables and indexes
   - Seed the database with sample organizations, users, properties, and maintenance data
   - All users have password: `password123`

3. **Start the Backend Server**
   ```bash
   npm run server
   ```
   
   The server will start and show connection information for different device types.

## 🏃‍♂️ Running the Application

### 1. Start the backend server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run server
```

The server will start on `http://localhost:3000`

### 2. Start the React Native app
```bash
# Start Expo development server
npm start

# Or run directly on a device/simulator
npm run android
npm run ios
npm run web
```

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration with organization support
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### **User Management**
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/change-password` - Change password

### **Organization Management**
- `GET /api/organizations/:id` - Get organization details
- `PUT /api/organizations/:id` - Update organization

### **Property Management**
- `GET /api/premises` - List premises (filtered by organization)
- `POST /api/premises` - Create new premises
- `GET /api/rental-units` - List rental units
- `POST /api/rental-units` - Create rental units
- `GET /api/leases` - List leases
- `POST /api/leases` - Create leases
- `GET /api/rental-listings` - List rental listings
- `POST /api/rental-listings` - Create rental listings

### **Maintenance System** ✅ **COMPLETED**
- `POST /api/maintenance-requests` - Create maintenance request (tenants and landlords)
- `GET /api/maintenance-requests` - List requests with filtering
- `GET /api/maintenance-requests/:id` - Get request details
- `PUT /api/maintenance-requests/:id/approve` - Approve/reject request
- `POST /api/maintenance-requests/:id/assign` - Assign work order
- `PUT /api/work-orders/:id/status` - Update work order status
- `POST /api/maintenance-requests/:id/rate` - Rate completed request

### **Landlord-Specific Endpoints** ✅ **NEW**
- `GET /api/landlord/premises` - Get premises for landlord's organization
- `GET /api/landlord/tenants` - Get tenants for landlord's organization
- `POST /api/landlord/maintenance-requests` - Create maintenance request as landlord

### **Chat & Messaging**
- `GET /api/conversations` - List user conversations
- `GET /api/conversations/:id` - Get conversation details
- `GET /api/conversations/:id/messages` - Get conversation messages
- `POST /api/conversations/:id/messages` - Send message
- `POST /api/conversations` - Create new conversation

### **Health Check**
- `GET /api/health` - Server health status

## 🗄️ Database Schema

### **Core Tables**
- `users` - User accounts with role-based access
- `organizations` - Multi-tenant organization support
- `premises` - Property locations and details
- `rental_units` - Individual rental units
- `leases` - Lease agreements and terms
- `rental_listings` - Property listings and availability

### **Maintenance System** ✅ **COMPLETED**
- `maintenance_requests` - Maintenance request tracking with workflow status
- `maintenance_work_orders` - Work order management with time tracking
- `maintenance_approvals` - Approval workflow with comments
- `maintenance_photos` - Photo attachments support
- `maintenance_notifications` - Notification system

### **Communication**
- `conversations` - Chat conversations
- `conversation_participants` - Conversation membership
- `messages` - Individual messages

### **Security & Sessions**
- `user_sessions` - JWT token management

## 📊 Sample Data

The application comes with comprehensive sample data for development and testing:

### **Organizations**
- Sunset Property Management
- Downtown Real Estate Group  
- Riverside Property Solutions

### **Users (Password: `password123`)**
| Email | Name | Role | Organization |
|-------|------|------|--------------|
| john.doe@example.com | John Doe | Tenant | - |
| jane.smith@example.com | Jane Smith | Landlord | Sunset Property Management |
| mike.johnson@example.com | Mike Johnson | Tenant | - |
| sarah.wilson@example.com | Sarah Wilson | Landlord | Downtown Real Estate Group |
| david.brown@example.com | David Brown | Tenant | - |
| emma.davis@example.com | Emma Davis | Landlord | Riverside Property Solutions |
| alex.garcia@example.com | Alex Garcia | Tenant | - |
| lisa.martinez@example.com | Lisa Martinez | Landlord | Sunset Property Management |
| tom.anderson@example.com | Tom Anderson | Workman | - |
| rachel.taylor@example.com | Rachel Taylor | Landlord | Downtown Real Estate Group |

### **Sample Data Includes**
- 5 premises with rental units
- 2 active leases
- 3 rental listings
- 4 maintenance requests with complete workflow examples
- 3 work orders with status tracking and time data
- 4 conversations with sample messages

## 📁 Project Structure

```
rently/
├── server/                 # Backend server
│   ├── index.js           # Main server with all API endpoints
│   ├── config.js          # Server configuration
│   ├── setup-db.js        # Database setup script
│   ├── seed-db.js         # Database seeding script
│   └── reset-db.js        # Database reset utility
├── src/                   # Frontend source code
│   ├── components/        # Reusable UI components
│   │   ├── NetworkStatus.tsx
│   │   └── SideMenu.tsx   # Slide-out navigation menu
│   ├── config/            # Configuration files
│   │   ├── app.ts         # App configuration
│   │   └── api.ts         # API configuration
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── navigation/        # Navigation components
│   │   └── AppNavigator.tsx
│   └── screens/           # App screens
│       ├── HomeScreen.tsx          # Main dashboard
│       ├── LoginScreen.tsx         # Authentication
│       ├── RegisterScreen.tsx      # User registration
│       ├── ProfileScreen.tsx       # User profile
│       ├── OrganizationManagementScreen.tsx  # Organization settings
│       ├── PremisesManagementScreen.tsx      # Property management
│       ├── RentalUnitsScreen.tsx            # Unit management
│       ├── RentalListingsScreen.tsx         # Listing management
│       ├── LeaseManagementScreen.tsx        # Lease management
│       ├── MyLeasesScreen.tsx               # Tenant lease view
│       ├── RentPaymentsScreen.tsx           # Payment tracking
│       ├── MaintenanceRequestsScreen.tsx    # ✅ Tenant maintenance (COMPLETED)
│       ├── LandlordMaintenanceScreen.tsx    # ✅ Landlord maintenance (COMPLETED)
│       ├── WorkmanMaintenanceScreen.tsx     # ✅ Workman tasks (COMPLETED)
│       ├── ConversationsScreen.tsx          # Chat list
│       └── ChatScreen.tsx                   # Individual chat
├── scripts/               # Utility scripts
│   ├── get-ip.js          # Get local IP address
│   └── update-app-name.js # Update app name in config files
├── .env.example           # Environment variables template
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🔧 Development

### **Adding New Features**
1. Create new screen components in `src/screens/`
2. Add navigation routes in `src/navigation/AppNavigator.tsx`
3. Create API endpoints in `server/index.js`
4. Update database schema in `server/setup-db.js` if needed
5. Add sample data in `server/seed-db.js`

### **Database Management**
```bash
# Reset database completely
node server/reset-db.js

# Recreate tables and seed data
npm run db:push

# Start server
npm run server
```

## 🎯 **Maintenance System Implementation** ✅ **COMPLETED**

### **Landlord Maintenance Screen Features**
- **Request Management**: View, approve/reject, and assign work orders
- **Request Creation**: Create new maintenance requests for organization properties
- **Status Tracking**: Monitor requests from pending to completed
- **Work Order Assignment**: Assign approved requests to workmen with detailed instructions
- **Filtering**: Filter by status and priority
- **Summary Dashboard**: Overview of work orders and maintenance status
- **Tenant Rating Display**: View tenant feedback for completed work
- **Property Selection**: Choose from organization premises and rental units
- **Tenant Assignment**: Optionally assign requests to specific tenants

### **Workman Maintenance Screen Features**
- **Performance Dashboard**: Track total orders, hours worked, and efficiency
- **Work Order Management**: View assigned, in-progress, and completed orders
- **Status Updates**: Update work order status (start, pause, complete)
- **Progress Tracking**: Monitor time vs. estimated hours
- **Detailed Information**: Access to maintenance request details, tenant info, and special instructions
- **Notes System**: Add progress notes and completion details

### **Tenant Maintenance Screen Features**
- **Request Creation**: Submit new maintenance requests with type and priority
- **Work Order Integration**: View detailed work order information including:
  - Assigned workman details
  - Work descriptions and progress
  - Estimated vs. actual hours
  - Workman notes and updates
- **Status Progress**: Visual progress bars showing request workflow
- **Rating System**: Rate completed maintenance work with star ratings and feedback
- **Advanced Filtering**: Filter by status and request type
- **Timeline Tracking**: Complete history from request to completion

### **Maintenance Workflow**
1. **Request Creation** → Status: `pending`
   - **Tenants** can create requests for their rented properties
   - **Landlords** can create requests for any property in their organization
2. **Landlord reviews and approves** → Status: `approved`
3. **Landlord assigns work order** → Status: `assigned`
4. **Workman starts work** → Status: `in_progress`
5. **Workman completes work** → Status: `completed`
6. **Tenant rates and provides feedback** → Complete workflow

## 🔧 Troubleshooting

### **App Name Configuration**

The app name is now configurable and automatically read from `app.json`. To change the app name:

1. **Update app.json**: Change the `name` field in `app.json`
2. **Run the update script**: 
   ```bash
   npm run update-app-name
   ```
3. **Restart your development server**

This will automatically update all configuration files with the new app name.

### **Network Connection Issues**

If you encounter "Network request failed" errors:

#### 1. **Check Server Status**
   - Ensure the backend server is running: `npm run server`
   - Check server console for startup messages
   - Verify the server shows network accessibility information

#### 2. **Device-Specific Configuration**

**Android Emulator:**
   - Use `10.0.2.2:3000` (automatically configured)
   - This is the special IP that Android emulator uses to reach your computer

**iOS Simulator:**
   - Use `localhost:3000` (automatically configured)
   - Works out of the box on macOS

**Physical Devices:**
   - Find your computer's local IP address:
     ```bash
     npm run get-ip
     ```
     - **Windows**: `ipconfig` in Command Prompt
     - **macOS/Linux**: `ifconfig` or `ip addr` in Terminal
   - Update `src/config/app.ts` with your computer's IP:
     ```typescript
     BASE_URL: 'http://YOUR_IP_ADDRESS:3000/api'
     ```

#### 3. **Network Configuration**
   - Ensure your computer and device are on the same WiFi network
   - Check firewall settings (Windows Defender, macOS Firewall)
   - Temporarily disable antivirus firewall for testing
   - Verify port 3000 is not blocked

#### 4. **Test Connection**
   - Use the Network Status component in the Home screen
   - Test the health endpoint: `http://YOUR_IP:3000/api/health`
   - Check browser console for CORS errors

#### 5. **Common Solutions**
   ```bash
   # Restart the server
   npm run server
   
   # Check if port 3000 is in use
   netstat -an | findstr :3000
   
   # Kill process using port 3000 (if needed)
   npx kill-port 3000
   ```

### **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check `.env` file configuration
   - Ensure database `rently` exists
   - Run `npm run db:push` to recreate tables

### **Code Style**
- Use TypeScript for type safety
- Follow React Native best practices
- Use React Native Paper components for consistent UI
- Implement proper error handling and loading states

## 🔒 Security Considerations

- JWT tokens are stored securely using Expo Secure Store
- Passwords are hashed using bcrypt with 12 salt rounds
- Input validation is implemented on both client and server
- CORS is configured for security
- JWT tokens are blacklisted on logout
- Role-based access control for all endpoints
- Multi-tenant data isolation

## 🚨 Common Issues

### **Database Issues**
1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database `rently` exists

2. **Schema Changes**
   - Run `node server/reset-db.js` to clear database
   - Run `npm run db:push` to recreate with new schema

### **Server Issues**
1. **Port Already in Use**
   - Change the port in `.env` file
   - Kill existing processes using the port

2. **JWT Token Issues**
   - Clear app data and re-login
   - Check JWT_SECRET in `.env`

### **Expo Issues**
1. **Build Issues**
   - Clear Expo cache: `npx expo start --clear`
   - Update Expo CLI: `npm install -g @expo/cli`

2. **Navigation Issues**
   - Check navigation dependencies are installed
   - Verify screen components are properly exported

### **Getting Help**
- Check the console for error messages
- Verify all dependencies are installed
- Ensure environment variables are set correctly
- Check database schema matches code expectations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with the provided sample data
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

## 🎯 Roadmap

### **Completed Features** ✅
- ✅ **Maintenance Request System**: Complete workflow from request to completion
- ✅ **Role-Based Maintenance UI**: Separate interfaces for landlords, workmen, and tenants
- ✅ **Work Order Management**: Assignment, tracking, and status updates
- ✅ **Tenant Rating System**: Feedback and rating for completed work
- ✅ **Multi-Tenancy**: Organization-based property management
- ✅ **Chat Messaging**: Real-time communication between users
- ✅ **Landlord Maintenance Creation**: Landlords can create and manage maintenance requests for organization properties

### **Planned Features**
- Real-time notifications
- File upload support for maintenance photos
- Advanced reporting and analytics
- Mobile app push notifications
- Integration with payment gateways
- Advanced search and filtering
- Calendar integration for maintenance scheduling 