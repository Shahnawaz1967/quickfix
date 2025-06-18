const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Admin = require("../models/Admin")
require("dotenv").config()

const checkAdmin = async () => {
  try {
    console.log("🔍 Checking admin user status...")

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/quickfix", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Connected to MongoDB")

    // Find all admin users
    const admins = await Admin.find({})

    if (admins.length === 0) {
      console.log("❌ No admin users found in database")
      console.log("💡 Run 'npm run seed:admin' to create an admin user")
      await mongoose.disconnect()
      process.exit(1)
    }

    console.log(`✅ Found ${admins.length} admin user(s):`)

    for (const admin of admins) {
      console.log(`\n👤 Admin User:`)
      console.log(`   ID: ${admin._id}`)
      console.log(`   Username: ${admin.username}`)
      console.log(`   Email: ${admin.email}`)
      console.log(`   Role: ${admin.role}`)
      console.log(`   Active: ${admin.isActive}`)
      console.log(`   Created: ${admin.createdAt}`)

      // Test password
      const testPassword = process.env.ADMIN_PASSWORD || "admin123456"
      const isPasswordValid = await bcrypt.compare(testPassword, admin.password)

      if (isPasswordValid) {
        console.log(`   ✅ Password matches: ${testPassword}`)
      } else {
        console.log(`   ❌ Password does NOT match: ${testPassword}`)
        console.log(`   💡 Run 'npm run seed:admin' to reset password`)
      }
    }

    console.log("\n🔑 Login URL: http://localhost:3000/admin/login")

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error("❌ Error checking admin:", error)
    process.exit(1)
  }
}

checkAdmin()
