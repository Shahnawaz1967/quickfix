const express = require("express")
const bcrypt = require("bcryptjs")
const Admin = require("../models/Admin")

const router = express.Router()

// Emergency admin creation endpoint (only works if no admin exists)
router.post("/create-admin", async (req, res) => {
  try {
    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({})

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists. Use the seeding script to reset password.",
        hint: "Run 'npm run setup:admin' in backend folder",
      })
    }

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

    res.status(201).json({
      success: true,
      message: "Admin created successfully!",
      data: {
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      credentials: {
        username: "admin",
        password: "admin123456",
      },
    })
  } catch (error) {
    console.error("Create admin error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create admin",
      error: error.message,
    })
  }
})

// Check admin status endpoint
router.get("/admin-status", async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments({})
    const activeAdmins = await Admin.countDocuments({ isActive: true })

    res.status(200).json({
      success: true,
      data: {
        totalAdmins: adminCount,
        activeAdmins: activeAdmins,
        hasAdmin: adminCount > 0,
        canCreateAdmin: adminCount === 0,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check admin status",
      error: error.message,
    })
  }
})

module.exports = router
