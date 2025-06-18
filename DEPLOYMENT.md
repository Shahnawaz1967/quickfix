# QuickFix Deployment Guide

This guide covers deploying the QuickFix application to various platforms including Vercel, Netlify, Railway, Heroku, and DigitalOcean.

## 📋 Pre-deployment Checklist

- [ ] MongoDB database set up (MongoDB Atlas recommended)
- [ ] Email service configured (Gmail, SendGrid, etc.)
- [ ] Environment variables prepared
- [ ] Admin user credentials secured
- [ ] Domain name ready (optional)

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

Vercel provides excellent React deployment with zero configuration.

#### Steps:
1. **Prepare the frontend**
   \`\`\`bash
   cd frontend
   npm run build
   \`\`\`

2. **Deploy via Vercel CLI**
   \`\`\`bash
   npm i -g vercel
   vercel login
   vercel --prod
   \`\`\`

3. **Or deploy via GitHub**
   - Push code to GitHub
   - Connect repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

#### Environment Variables for Vercel:
\`\`\`
VITE_API_URL=https://your-backend-url.com/api
VITE_APP_NAME=QuickFix
VITE_APP_VERSION=1.0.0
\`\`\`

### Option 2: Netlify

#### Steps:
1. **Build the project**
   \`\`\`bash
   cd frontend
   npm run build
   \`\`\`

2. **Deploy via Netlify CLI**
   \`\`\`bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   \`\`\`

3. **Or drag and drop**
   - Build the project locally
   - Drag the `dist` folder to Netlify dashboard

#### Netlify Configuration (`netlify.toml`):
\`\`\`toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
\`\`\`

### Option 3: GitHub Pages

#### Steps:
1. **Install gh-pages**
   \`\`\`bash
   cd frontend
   npm install --save-dev gh-pages
   \`\`\`

2. **Update package.json**
   \`\`\`json
   {
     "homepage": "https://yourusername.github.io/quickfix-app",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   \`\`\`

3. **Deploy**
   \`\`\`bash
   npm run deploy
   \`\`\`

## 🖥️ Backend Deployment

### Option 1: Railway (Recommended)

Railway offers easy deployment with automatic HTTPS and custom domains.

#### Steps:
1. **Install Railway CLI**
   \`\`\`bash
   npm install -g @railway/cli
   \`\`\`

2. **Login and deploy**
   \`\`\`bash
   cd backend
   railway login
   railway init
   railway up
   \`\`\`

3. **Set environment variables**
   \`\`\`bash
   railway variables set MONGODB_URI=your-mongodb-uri
   railway variables set JWT_SECRET=your-jwt-secret
   railway variables set SMTP_USER=your-email
   railway variables set SMTP_PASS=your-password
   # ... other variables
   \`\`\`

#### Railway Configuration (`railway.toml`):
\`\`\`toml
[build]
  builder = "NIXPACKS"

[deploy]
  startCommand = "npm start"
  restartPolicyType = "ON_FAILURE"
  restartPolicyMaxRetries = 10
\`\`\`

### Option 2: Heroku

#### Steps:
1. **Install Heroku CLI**
   \`\`\`bash
   # Install from https://devcenter.heroku.com/articles/heroku-cli
   \`\`\`

2. **Create Heroku app**
   \`\`\`bash
   cd backend
   heroku create quickfix-api
   \`\`\`

3. **Set environment variables**
   \`\`\`bash
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set SMTP_USER=your-email
   heroku config:set SMTP_PASS=your-password
   # ... other variables
   \`\`\`

4. **Deploy**
   \`\`\`bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   \`\`\`

#### Heroku Configuration (`Procfile`):
\`\`\`
web: node server.js
\`\`\`

### Option 3: DigitalOcean App Platform

#### Steps:
1. **Create app on DigitalOcean**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository
   - Select the backend folder

2. **Configure build settings**
   - Build Command: `npm install`
   - Run Command: `npm start`

3. **Set environment variables**
   - Add all required environment variables in the dashboard

### Option 4: VPS Deployment (Ubuntu)

#### Steps:
1. **Server setup**
   \`\`\`bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   \`\`\`

2. **Deploy application**
   \`\`\`bash
   # Clone repository
   git clone <your-repo-url>
   cd quickfix-app/backend
   
   # Install dependencies
   npm install --production
   
   # Create environment file
   sudo nano .env
   # Add your environment variables
   
   # Start with PM2
   pm2 start server.js --name "quickfix-api"
   pm2 startup
   pm2 save
   \`\`\`

3. **Configure Nginx**
   \`\`\`bash
   sudo nano /etc/nginx/sites-available/quickfix
   \`\`\`
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
   
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   \`\`\`
   
   \`\`\`bash
   sudo ln -s /etc/nginx/sites-available/quickfix /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   \`\`\`

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free account

2. **Create cluster**
   - Choose free tier (M0)
   - Select region closest to your users

3. **Configure access**
   - Add IP addresses (0.0.0.0/0 for all IPs)
   - Create database user

4. **Get connection string**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Local MongoDB (Development)

\`\`\`bash
# Install MongoDB
# Ubuntu
sudo apt install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongodb  # Ubuntu
brew services start mongodb-community  # macOS
\`\`\`

## 📧 Email Service Setup

### Gmail Setup

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2FA

2. **Generate App Password**
   - Go to Security → App passwords
   - Generate password for "Mail"

3. **Environment Variables**
   \`\`\`env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   \`\`\`

### SendGrid Setup

1. **Create SendGrid account**
   - Go to [SendGrid](https://sendgrid.com)
   - Create free account

2. **Create API key**
   - Go to Settings → API Keys
   - Create new API key

3. **Environment Variables**
   \`\`\`env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   \`\`\`

## 🔒 Security Considerations

### Production Environment Variables

\`\`\`env
# Backend
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/quickfix
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=super-long-random-string-min-32-chars
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=QuickFix <noreply@quickfix.com>

# Frontend
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=QuickFix
VITE_APP_VERSION=1.0.0
\`\`\`

### Security Checklist

- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS for both frontend and backend
- [ ] Restrict CORS to specific domains
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Use strong admin passwords
- [ ] Enable MongoDB authentication
- [ ] Configure firewall rules

## 🚀 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

\`\`\`yaml
name: Deploy QuickFix

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE }}
\`\`\`

## 🔍 Monitoring and Logging

### Application Monitoring

1. **Add logging middleware**
   \`\`\`javascript
   // backend/middleware/logger.js
   const logger = (req, res, next) => {
     console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
     next()
   }
   \`\`\`

2. **Error tracking**
   - Consider services like Sentry or LogRocket
   - Add error boundaries in React

3. **Performance monitoring**
   - Use tools like New Relic or DataDog
   - Monitor API response times

### Health Checks

Add health check endpoints:

\`\`\`javascript
// backend/server.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})
\`\`\`

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check FRONTEND_URL in backend environment
   - Ensure correct API URL in frontend

2. **Database Connection**
   - Verify MongoDB URI
   - Check network access in MongoDB Atlas

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check spam folder
   - Test with different email provider

4. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Debugging Commands

\`\`\`bash
# Check logs
pm2 logs quickfix-api  # PM2
heroku logs --tail     # Heroku
railway logs           # Railway

# Test API endpoints
curl -X GET https://your-api-url.com/api/health

# Check database connection
mongo "your-mongodb-uri"
\`\`\`

## 📞 Support

If you encounter deployment issues:

1. Check the logs for specific error messages
2. Verify all environment variables are set correctly
3. Test the application locally first
4. Consult the platform-specific documentation
5. Create an issue in the repository with deployment details

---

**Happy Deploying!** 🚀

For additional help, refer to the main [README.md](./README.md) or create an issue in the repository.
\`\`\`

Now let me add a comprehensive package.json for the frontend with all necessary scripts:
