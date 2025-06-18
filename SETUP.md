# QuickFix Setup Guide

Follow this step-by-step guide to set up the QuickFix application locally.

## 🔧 Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either local installation or MongoDB Atlas account
- **Git** - [Download here](https://git-scm.com/)
- **Email Account** - Gmail or other SMTP provider

## 📥 1. Clone and Install

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd quickfix-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
\`\`\`

## 🗄️ 2. Database Setup

### Option A: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster (M0 Sandbox - Free)

2. **Configure Database Access**
   - Go to "Database Access" → "Add New Database User"
   - Create username and password
   - Set role to "Read and write to any database"

3. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Add `0.0.0.0/0` (allow access from anywhere) for development
   - For production, add specific IP addresses

4. **Get Connection String**
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Option B: Local MongoDB

\`\`\`bash
# Install MongoDB locally
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongodb  # Ubuntu/Debian
brew services start mongodb-community  # macOS
\`\`\`

## 📧 3. Email Setup

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Security → 2-Step Verification → Turn on

2. **Generate App Password**
   - Go to Security → App passwords
   - Select "Mail" and generate password
   - Copy the 16-character password

### Other Email Providers

- **SendGrid**: Create account and get API key
- **Mailgun**: Create account and get SMTP credentials
- **Outlook**: Use your Outlook credentials with SMTP settings

## ⚙️ 4. Environment Configuration

### Backend Environment (.env)

Create `backend/.env` file:

\`\`\`env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickfix
# For local MongoDB: MONGODB_URI=mongodb://localhost:27017/quickfix

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=QuickFix <noreply@quickfix.com>

# Admin User (for seeding)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@quickfix.com
ADMIN_PASSWORD=admin123456
\`\`\`

### Frontend Environment (.env)

Create `frontend/.env` file:

\`\`\`env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=QuickFix
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
\`\`\`

## 🚀 5. Initialize Database

\`\`\`bash
# Navigate to backend folder
cd backend

# Create admin user
npm run seed:admin
\`\`\`

You should see output like:
\`\`\`
Connected to MongoDB
Admin user created successfully:
Username: admin
Email: admin@quickfix.com
Password: admin123456
\`\`\`

## 🏃‍♂️ 6. Start the Application

### Terminal 1 - Backend
\`\`\`bash
cd backend
npm run dev
\`\`\`

You should see:
\`\`\`
QuickFix server running on port 5000
Connected to MongoDB
\`\`\`

### Terminal 2 - Frontend
\`\`\`bash
cd frontend
npm run dev
\`\`\`

You should see:
\`\`\`
Local:   http://localhost:3000/
Network: http://192.168.x.x:3000/
\`\`\`

## 🧪 7. Test the Application

### Test Regular Booking (No Authentication)
1. Go to http://localhost:3000
2. Click "Book a Service"
3. Fill out the form and submit
4. Check your email for confirmation

### Test Admin Panel (Authentication Required)
1. Go to http://localhost:3000/admin/login
2. Use credentials:
   - **Username**: admin
   - **Password**: admin123456
3. Access the admin dashboard

### Test Booking Tracking
1. Go to http://localhost:3000/track
2. Enter the email used for booking
3. View booking status

## 🔍 8. Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**
\`\`\`bash
# Check MongoDB connection string
# Verify username/password
# Check network access in MongoDB Atlas
\`\`\`

**"Port 5000 already in use"**
\`\`\`bash
# Kill process using port 5000
sudo lsof -ti:5000 | xargs kill -9

# Or change port in .env file
PORT=5001
\`\`\`

**"Email not sending"**
\`\`\`bash
# Verify SMTP credentials
# Check spam folder
# Test with different email provider
\`\`\`

### Frontend Issues

**"Cannot connect to server"**
\`\`\`bash
# Make sure backend is running on port 5000
# Check VITE_API_URL in frontend/.env
# Verify CORS settings in backend
\`\`\`

**"Admin login fails"**
\`\`\`bash
# Run admin seeding again
cd backend
npm run seed:admin

# Check JWT_SECRET is set
# Verify admin credentials
\`\`\`

### Common Commands

\`\`\`bash
# Restart backend
cd backend
npm run dev

# Restart frontend
cd frontend
npm run dev

# Reset admin user
cd backend
npm run seed:admin

# Check backend health
curl http://localhost:5000/api/health

# Check admin API
curl http://localhost:5000/api/admin/test
\`\`\`

## 📱 9. Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] MongoDB connection successful
- [ ] Admin user created successfully
- [ ] Can create a booking (no authentication)
- [ ] Email confirmation received
- [ ] Can track booking by email
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] Can manage bookings in admin panel

## 🔐 10. Security Notes

### For Development
- Use the provided default credentials
- Allow all IPs in MongoDB Atlas
- Use simple JWT secret

### For Production
- Change all default passwords
- Use strong JWT secret (32+ characters)
- Restrict MongoDB access to specific IPs
- Use environment-specific email settings
- Enable HTTPS
- Set secure CORS origins

## 📞 11. Getting Help

If you encounter issues:

1. **Check the logs** in both terminal windows
2. **Verify environment variables** are set correctly
3. **Test API endpoints** using curl or Postman
4. **Check database connection** in MongoDB Atlas
5. **Verify email settings** with your provider

### Common Error Solutions

| Error | Solution |
|-------|----------|
| ECONNREFUSED | Backend not running or wrong port |
| CORS Error | Check FRONTEND_URL in backend .env |
| 401 Unauthorized | Admin token expired, login again |
| Email not sending | Check SMTP credentials |
| MongoDB connection failed | Verify connection string and network access |

---

**You're all set!** 🎉

The QuickFix application should now be running locally with full functionality.
\`\`\`

Let me also create a quick diagnostic script to help troubleshoot:
