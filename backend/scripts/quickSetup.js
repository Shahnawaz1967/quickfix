const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Admin = require("../models/Admin")
require("dotenv").config()

const quickSetup = async () => {
  try {
    console.log("🚀 QuickFix Admin Setup Starting...")
    console.log("=" * 50)

    // Step 1: Connect to MongoDB
    console.log("📡 Step 1: Connecting to MongoDB...")
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/quickfix"
    console.log(`   Using: ${mongoUri.replace(/\/\/.*@/, "//***:***@")}`)

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ MongoDB connected successfully!")

    // Step 2: Check existing admin
    console.log("\n🔍 Step 2: Checking for existing admin...")
    const existingAdmin = await Admin.findOne({})

    if (existingAdmin) {
      console.log("⚠️  Found existing admin, updating password...")

      // Update existing admin with new password
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash("admin123456", salt)

      existingAdmin.password = hashedPassword
      existingAdmin.username = "admin"
      existingAdmin.email = "admin@quickfix.com"
      existingAdmin.isActive = true

      await existingAdmin.save()
      console.log("✅ Existing admin updated!")
    } else {
      console.log("👤 No admin found, creating new one...")

      // Create new admin
      const adminData = {
        username: "admin",
        email: "admin@quickfix.com",
        password: "admin123456",
        role: "super-admin",
        isActive: true,
      }

      const admin = new Admin(adminData)
      await admin.save()
      console.log("✅ New admin created successfully!")
    }

    // Step 3: Verify admin can login
    console.log("\n🔑 Step 3: Verifying admin credentials...")
    const testAdmin = await Admin.findOne({ username: "admin" })
    const passwordMatch = await bcrypt.compare("admin123456", testAdmin.password)

    if (passwordMatch) {
      console.log("✅ Admin credentials verified!")
    } else {
      throw new Error("Password verification failed")
    }

    // Step 4: Display success info
    console.log("\n" + "=" * 50)
    console.log("🎉 SETUP COMPLETE!")
    console.log("=" * 50)
    console.log("🔑 Admin Login Credentials:")
    console.log("   Username: admin")
    console.log("   Password: admin123456")
    console.log("   Email: admin@quickfix.com")
    console.log("\n🌐 Login URL: http://localhost:3000/admin/login")
    console.log("\n💡 Next Steps:")
    console.log("   1. Make sure backend is running: npm run dev")
    console.log("   2. Make sure frontend is running: npm run dev")
    console.log("   3. Go to admin login page")
    console.log("   4. Use the credentials above")
    console.log("=" * 50)

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message)

    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n💡 MongoDB Connection Failed:")
      console.log("   - Make sure MongoDB is running")
      console.log("   - Check MONGODB_URI in .env file")
      console.log("   - For MongoDB Atlas, verify connection string and network access")
    }

    if (error.message.includes("authentication failed")) {
      console.log("\n💡 MongoDB Authentication Failed:")
      console.log("   - Check username/password in connection string")
      console.log("   - Verify database user permissions")
    }

    process.exit(1)
  }
}

quickSetup()
