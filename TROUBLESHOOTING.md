# QuickFix Troubleshooting Guide

## 🔐 Admin Login Issues

### Problem: "Invalid credentials" error when logging in

**Symptoms:**
- Getting 401 error when trying to login
- "Invalid credentials" message
- Admin login fails even with correct username/password

**Solutions:**

#### Step 1: Check if admin user exists
\`\`\`bash
cd backend
npm run check:admin
\`\`\`

#### Step 2: Create/Reset admin user
\`\`\`bash
cd backend
npm run seed:admin
\`\`\`

#### Step 3: Verify environment variables
Make sure your `backend/.env` file has:
\`\`\`env
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@quickfix.com
ADMIN_PASSWORD=admin123456
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
\`\`\`

#### Step 4: Test with default credentials
- **Username:** admin
- **Password:** admin123456

### Problem: "Cannot connect to server" error

**Solutions:**

#### Check backend is running
\`\`\`bash
cd backend
npm run dev
\`\`\`

Should show:
\`\`\`
QuickFix server running on port 5000
Connected to MongoDB
\`\`\`

#### Check API URL in frontend
Make sure `frontend/.env` has:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

#### Test API connection
\`\`\`bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/admin/test
\`\`\`

## 🗄️ Database Issues

### Problem: MongoDB connection failed

**Solutions:**

#### For MongoDB Atlas:
1. Check connection string format:
   \`\`\`
   mongodb+srv://username:password@cluster.mongodb.net/quickfix
   \`\`\`
2. Verify username/password are correct
3. Check network access (add 0.0.0.0/0 for development)
4. Make sure cluster is running

#### For Local MongoDB:
1. Start MongoDB service:
   \`\`\`bash
   # Ubuntu/Debian
   sudo systemctl start mongodb
   
   # macOS
   brew services start mongodb-community
   \`\`\`
2. Use local connection string:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/quickfix
   \`\`\`

### Problem: Admin user not found in database

**Solution:**
\`\`\`bash
cd backend
npm run seed:admin
\`\`\`

## 📧 Email Issues

### Problem: Email confirmation not sending

**Solutions:**

#### For Gmail:
1. Enable 2-factor authentication
2. Generate app password (16 characters)
3. Use app password in SMTP_PASS
4. Check spam folder

#### Environment variables:
\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
\`\`\`

#### Test email configuration:
\`\`\`bash
cd backend
npm run diagnose
\`\`\`

## 🌐 Frontend Issues

### Problem: API requests failing

**Solutions:**

#### Check CORS settings
Make sure backend `.env` has:
\`\`\`env
FRONTEND_URL=http://localhost:3000
\`\`\`

#### Check API URL
Make sure frontend `.env` has:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

#### Clear browser cache
1. Open Developer Tools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Problem: Dark mode not working

**Solution:**
Clear localStorage:
\`\`\`javascript
// In browser console
localStorage.clear()
\`\`\`

## 🔧 Common Commands

### Backend Commands
\`\`\`bash
cd backend

# Start development server
npm run dev

# Create admin user
npm run seed:admin

# Check admin status
npm run check:admin

# Run diagnostics
npm run diagnose

# Reset admin password
npm run reset:admin
\`\`\`

### Frontend Commands
\`\`\`bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

### Database Commands
\`\`\`bash
# Connect to MongoDB (if local)
mongo quickfix

# Show collections
show collections

# Find admin users
db.admins.find()

# Drop admin collection (reset)
db.admins.drop()
\`\`\`

## 🚨 Emergency Reset

If everything is broken, follow these steps:

### 1. Stop all servers
\`\`\`bash
# Press Ctrl+C in both terminal windows
\`\`\`

### 2. Reset environment
\`\`\`bash
cd backend
rm -rf node_modules
npm install
cp .env.example .env
# Edit .env with your settings
\`\`\`

### 3. Reset database
\`\`\`bash
cd backend
npm run seed:admin
\`\`\`

### 4. Reset frontend
\`\`\`bash
cd frontend
rm -rf node_modules
npm install
cp .env.example .env
# Edit .env with API URL
\`\`\`

### 5. Start fresh
\`\`\`bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
\`\`\`

## 📞 Getting Help

### Check logs
Always check the terminal output for error messages:

**Backend logs show:**
- MongoDB connection status
- API request details
- Authentication attempts
- Email sending status

**Frontend logs show:**
- API connection status
- Authentication state
- Form validation errors

### Test step by step
1. ✅ Backend starts without errors
2. ✅ MongoDB connects successfully
3. ✅ Admin user exists in database
4. ✅ Frontend connects to backend
5. ✅ Admin login works
6. ✅ Dashboard loads

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| ECONNREFUSED | Backend not running | Start backend with `npm run dev` |
| Invalid credentials | Admin user not found/wrong password | Run `npm run seed:admin` |
| CORS error | Frontend URL not allowed | Check FRONTEND_URL in backend .env |
| MongoDB connection failed | Database not accessible | Check MONGODB_URI |
| 401 Unauthorized | Token expired/invalid | Login again |
| Email not sending | SMTP configuration wrong | Check email settings |

---

**Still having issues?** 

1. Run the diagnostic tool: `npm run diagnose`
2. Check all environment variables are set
3. Verify MongoDB and email credentials
4. Test with a fresh database
5. Create an issue with error logs
