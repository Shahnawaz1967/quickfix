const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Admin = require("../models/Admin")
require("dotenv").config()

const seedAdmin = async () => {
  try {
    console.log("🌱 Starting admin user seeding...")

    // Connect to MongoDB
    console.log("📡 Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/quickfix", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Connected to MongoDB")

    // Check if admin already exists
    console.log("🔍 Checking for existing admin user...")
    const existingAdmin = await Admin.findOne({
      $or: [{ username: "admin" }, { email: process.env.ADMIN_EMAIL || "admin@quickfix.com" }],
    })

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists:")
      console.log(`   Username: ${existingAdmin.username}`)
      console.log(`   Email: ${existingAdmin.email}`)
      console.log(`   Created: ${existingAdmin.createdAt}`)

      // Ask if user wants to reset password
      console.log("\n🔄 Updating admin password to default...")
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123456", salt)

      existingAdmin.password = hashedPassword
      await existingAdmin.save()

      console.log("✅ Admin password updated successfully!")
      console.log("\n🔑 Login Credentials:")
      console.log(`   Username: ${existingAdmin.username}`)
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || "admin123456"}`)

      await mongoose.disconnect()
      process.exit(0)
    }

    // Create new admin user
    console.log("👤 Creating new admin user...")
    const adminData = {
      username: process.env.ADMIN_USERNAME || "admin",
      email: process.env.ADMIN_EMAIL || "admin@quickfix.com",
      password: process.env.ADMIN_PASSWORD || "admin123456",
      role: "super-admin",
    }

    const admin = new Admin(adminData)
    await admin.save()

    console.log("✅ Admin user created successfully!")
    console.log("\n🔑 Login Credentials:")
    console.log(`   Username: ${admin.username}`)
    console.log(`   Email: ${admin.email}`)
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || "admin123456"}`)
    console.log(`   Role: ${admin.role}`)

    console.log("\n🚀 You can now login at: http://localhost:3000/admin/login")

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding admin:", error)

    if (error.code === 11000) {
      console.log("\n💡 Duplicate key error - admin might already exist with different credentials")
      console.log("   Try running the script again to update the password")
    }

    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n💡 Cannot connect to MongoDB:")
      console.log("   1. Make sure MongoDB is running")
      console.log("   2. Check your MONGODB_URI in .env file")
      console.log("   3. Verify network access if using MongoDB Atlas")
    }

    process.exit(1)
  }
}

// Add command line argument handling
const args = process.argv.slice(2)
if (args.includes("--force") || args.includes("-f")) {
  console.log("🔄 Force mode: Will recreate admin user")
}

seedAdmin()
