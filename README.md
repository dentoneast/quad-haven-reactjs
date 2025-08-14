# Rently

A React Native mobile application with member registration, sign up, and profile settings features, backed by a PostgreSQL database and Express.js server.

## Features

- **User Authentication**
  - User registration with email verification
  - Secure login/logout functionality
  - JWT token-based authentication
  - Password hashing with bcrypt

- **Profile Management**
  - View and edit user profile information
  - Change password functionality
  - Profile image support (ready for implementation)
  - Account verification status

- **Security Features**
  - Secure password storage
  - JWT token blacklisting
  - Input validation and sanitization
  - CORS protection

## Tech Stack

### Frontend
- React Native with Expo
- React Navigation for routing
- React Native Paper for UI components
- Expo Secure Store for secure storage

### Backend
- Node.js with Express.js
- PostgreSQL database
- JWT for authentication
- bcrypt for password hashing
- Express Validator for input validation

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Expo CLI
- React Native development environment

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd rently
```

### 2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies (if using Expo)
npx expo install
```

### 3. Database Setup

#### Option A: Using the setup script
```bash
# Create a .env file with your database credentials
cp .env.example .env
# Edit .env with your actual database credentials

# Run the database setup script
node server/setup-db.js
```

#### Option B: Manual setup
1. Create a PostgreSQL database named `rently`
2. Update the `.env` file with your database credentials
3. The tables will be created automatically when you start the server

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
   - Create the necessary tables
   - Seed the database with 10 sample users
   - All users have password: `password123`

3. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   
   The server will start and show connection information for different device types.

## Running the Application

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

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/change-password` - Change password

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  profile_image_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 Sample Data

The application comes with 10 pre-configured test users for development and testing:

| Email | Name | Phone | Location |
|-------|------|-------|----------|
| john.doe@example.com | John Doe | +1-555-0101 | New York, NY |
| jane.smith@example.com | Jane Smith | +1-555-0102 | Los Angeles, CA |
| mike.johnson@example.com | Mike Johnson | +1-555-0103 | Chicago, IL |
| sarah.wilson@example.com | Sarah Wilson | +1-555-0104 | Houston, TX |
| david.brown@example.com | David Brown | +1-555-0105 | Phoenix, AZ |
| emma.davis@example.com | Emma Davis | +1-555-0106 | Philadelphia, PA |
| alex.garcia@example.com | Alex Garcia | +1-555-0107 | San Antonio, TX |
| lisa.martinez@example.com | Lisa Martinez | +1-555-0108 | San Diego, CA |
| tom.anderson@example.com | Tom Anderson | +1-555-0109 | Dallas, TX |
| rachel.taylor@example.com | Rachel Taylor | +1-555-0110 | San Jose, CA |

**All users have the password: `password123`**

## Project Structure

```
rently/
├── server/                 # Backend server
│   ├── index.js           # Main server file
│   ├── config.js          # Server configuration
│   ├── setup-db.js        # Database setup script
│   └── seed-db.js         # Database seeding script
├── src/                   # Frontend source code
│   ├── components/        # Reusable UI components
│   │   └── NetworkStatus.tsx
│   ├── config/            # Configuration files
│   │   ├── app.ts         # App configuration (name, API settings)
│   │   └── api.ts         # API configuration (deprecated, use app.ts)
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── navigation/        # Navigation components
│   │   └── AppNavigator.tsx
│   └── screens/           # App screens
│       ├── HomeScreen.tsx
│       ├── LoginScreen.tsx
│       ├── RegisterScreen.tsx
│       └── ProfileScreen.tsx
├── scripts/               # Utility scripts
│   ├── get-ip.js          # Get local IP address
│   └── update-app-name.js # Update app name in config files
├── .env.example           # Environment variables template
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Development

### Adding New Features
1. Create new screen components in `src/screens/`
2. Add navigation routes in `src/navigation/AppNavigator.tsx`
3. Create API endpoints in `server/index.js`
4. Update database schema if needed

## 🔧 Troubleshooting

### App Name Configuration

The app name is now configurable and automatically read from `app.json`. To change the app name:

1. **Update app.json**: Change the `name` field in `app.json`
2. **Run the update script**: 
   ```bash
   npm run update-app-name
   ```
3. **Restart your development server**

This will automatically update all configuration files with the new app name.

### Network Connection Issues

If you encounter "Network request failed" errors:

#### 1. **Check Server Status**
   - Ensure the backend server is running: `npm run dev`
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
   npm run dev
   
   # Check if port 3000 is in use
   netstat -an | grep 3000
   
   # Kill process using port 3000 (if needed)
   npx kill-port 3000
   ```

### Database Connection Issues
   - Verify PostgreSQL is running
   - Check `.env` file configuration
   - Ensure database `rently` exists
   - Run `npm run db:push` to recreate tables

### Code Style
- Use TypeScript for type safety
- Follow React Native best practices
- Use React Native Paper components for consistent UI
- Implement proper error handling and loading states

## Security Considerations

- JWT tokens are stored securely using Expo Secure Store
- Passwords are hashed using bcrypt with 12 salt rounds
- Input validation is implemented on both client and server
- CORS is configured for security
- JWT tokens are blacklisted on logout

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database `rently` exists

2. **Port Already in Use**
   - Change the port in `.env` file
   - Kill existing processes using the port

3. **Expo Build Issues**
   - Clear Expo cache: `npx expo start --clear`
   - Update Expo CLI: `npm install -g @expo/cli`

### Getting Help
- Check the console for error messages
- Verify all dependencies are installed
- Ensure environment variables are set correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 