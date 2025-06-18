# QuickFix - Home Service Booking Platform

QuickFix is a full-stack MERN (MongoDB, Express.js, React, Node.js) application that allows users to easily book home services like plumbing, electrical repairs, AC servicing, and more through a clean and responsive interface.

## 🚀 Features

### User Features
- **Service Booking**: Easy-to-use form for booking various home services
- **Booking Tracking**: Track booking status using email address
- **Email Notifications**: Automatic confirmation emails via Nodemailer
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Admin Features
- **Admin Dashboard**: Comprehensive dashboard with booking statistics
- **Booking Management**: View, update, and manage all service bookings
- **Status Updates**: Change booking status and add notes
- **Search & Filter**: Advanced filtering by status, service type, and customer details
- **Secure Authentication**: JWT-based admin authentication

### Technical Features
- **RESTful API**: Well-structured API endpoints
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling middleware
- **Security**: Rate limiting, CORS, and security headers
- **Email Service**: Automated email notifications
- **Database**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Nodemailer** - Email sending service
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

\`\`\`
quickfix-app/
├── backend/                 # Backend API server
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   ├── services/           # Business logic services
│   ├── .env.example        # Environment variables template
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── .env.example        # Frontend environment template
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── README.md               # This file
└── DEPLOYMENT.md           # Deployment guide
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd quickfix-app
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your configuration

# Seed admin user
npm run seed:admin

# Start development server
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
\`\`\`

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin/login

## 🔧 Configuration

### Backend Environment Variables
\`\`\`env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/quickfix
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=QuickFix <noreply@quickfix.com>
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@quickfix.com
ADMIN_PASSWORD=admin123456
\`\`\`

### Frontend Environment Variables
\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=QuickFix
VITE_APP_VERSION=1.0.0
\`\`\`

## 📧 Email Configuration

The application uses Nodemailer for sending emails. Configure your email provider:

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in `SMTP_PASS`

### Other Providers
Update the SMTP settings in your `.env` file according to your email provider's documentation.

## 👤 Default Admin Credentials
- **Username**: admin
- **Password**: admin123456

⚠️ **Important**: Change these credentials in production!

## 🎯 API Endpoints

### Public Endpoints
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/customer/:email` - Get bookings by email

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id` - Update booking
- `DELETE /api/admin/bookings/:id` - Delete booking
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## 🧪 Testing

### Manual Testing
1. Create a booking through the frontend
2. Check email for confirmation
3. Track the booking using email
4. Login to admin panel
5. Manage bookings through admin dashboard

### API Testing
Use tools like Postman or curl to test API endpoints:

\`\`\`bash
# Create a booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345"
    },
    "serviceType": "plumbing",
    "serviceDescription": "Fix leaky faucet",
    "preferredDate": "2024-12-25",
    "preferredTime": "morning",
    "urgency": "medium"
  }'
\`\`\`

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community for the robust backend framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and testers

---

**QuickFix Team** - Making home services accessible and convenient for everyone.
\`\`\`

Now let me create the deployment guide:
