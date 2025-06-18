# QuickFix - Home Service Booking Platform

QuickFix is a full-stack web application built using the MERN Stack. It is designed to make it simple for users to book services online, and for admins to manage those bookings through a secure and easy-to-use dashboard.

Whether it’s for a repair shop, home service, or event management system, QuickFix can be adapted for many use cases. It is fast, mobile-friendly, and secure — with modern features like dark mode, admin setup.

## Pages

### Home

![Qucikfix-homepng](https://github.com/user-attachments/assets/7e60c08a-68c1-4d44-9668-1388333265a3)

### Admin-Dashboard

![Qucikfix admin dashboard](https://github.com/user-attachments/assets/2b6fce34-8242-46bb-b5bb-c175f045f0e1)

### Admin details page


![qucikfix-details-page](https://github.com/user-attachments/assets/e814ba70-3b73-4e11-88f0-b419b2d434ee)



##  Features

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



## 🚀 Quick Start

### Prerequisites
- Node.js 
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository

\`\`\`bash

git clone  https://github.com/Shahnawaz1967/quickfix.git

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

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


##  Acknowledgments

- React team for the amazing framework
- Express.js community for the robust backend framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and testers

---

**QuickFix ** - Making home services accessible and convenient for everyone.

