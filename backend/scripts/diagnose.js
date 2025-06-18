const mongoose = require("mongoose")
const nodemailer = require("nodemailer")
require("dotenv").config()

const diagnose = async () => {
  console.log("🔍 QuickFix Diagnostic Tool")
  console.log("=".repeat(50))

  // Check environment variables
  console.log("\n📋 Environment Variables:")
  const requiredEnvVars = [
    "MONGODB_URI",
    "JWT_SECRET",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "FRONTEND_URL",
  ]

  requiredEnvVars.forEach((envVar) => {
    const value = process.env[envVar]
    if (value) {
      console.log(`✅ ${envVar}: ${envVar.includes("PASS") || envVar.includes("SECRET") ? "***" : value}`)
    } else {
      console.log(`❌ ${envVar}: Not set`)
    }
  })

  // Test MongoDB connection
  console.log("\n🗄️ Testing MongoDB Connection:")
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ MongoDB connection successful")

    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log(`✅ Database accessible, ${collections.length} collections found`)

    await mongoose.disconnect()
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message)
  }

  // Test email configuration
  console.log("\n📧 Testing Email Configuration:")
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.verify()
    console.log("✅ Email configuration is valid")
  } catch (error) {
    console.log("❌ Email configuration failed:", error.message)
  }

  // Check JWT secret strength
  console.log("\n🔐 JWT Secret Analysis:")
  const jwtSecret = process.env.JWT_SECRET
  if (jwtSecret) {
    if (jwtSecret.length >= 32) {
      console.log("✅ JWT secret is strong (32+ characters)")
    } else {
      console.log("⚠️ JWT secret is weak (less than 32 characters)")
    }
  } else {
    console.log("❌ JWT secret not set")
  }

  // Port availability
  console.log("\n🔌 Port Configuration:")
  const port = process.env.PORT || 5000
  console.log(`📍 Backend will run on port: ${port}`)
  console.log(`📍 Frontend should connect to: http://localhost:${port}/api`)

  console.log("\n" + "=".repeat(50))
  console.log("🎯 Diagnostic Complete!")
  console.log("\nIf all items show ✅, your configuration should work.")
  console.log("If you see ❌ or ⚠️, please fix those issues first.")

  process.exit(0)
}

diagnose().catch((error) => {
  console.error("Diagnostic failed:", error)
  process.exit(1)
})
