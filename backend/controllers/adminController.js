const Booking = require("../models/Booking")
const Admin = require("../models/Admin")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")

// Admin login
const adminLogin = async (req, res) => {
  try {
    console.log("🔐 Admin login attempt:", { username: req.body.username })

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("❌ Validation errors:", errors.array())
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { username, password } = req.body

    // Find admin by username or email
    console.log("🔍 Looking for admin with username/email:", username)
    const admin = await Admin.findOne({
      $or: [{ username }, { email: username }],
      isActive: true,
    })

    if (!admin) {
      console.log("❌ Admin not found")
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Admin user not found.",
        hint: "Make sure you have run 'npm run seed:admin' to create an admin user.",
      })
    }

    console.log("✅ Admin found:", { id: admin._id, username: admin.username, email: admin.email })

    // Check password
    console.log("🔑 Verifying password...")
    const isPasswordValid = await admin.comparePassword(password)
    if (!isPasswordValid) {
      console.log("❌ Invalid password")
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Incorrect password.",
        hint: "Use the default password 'admin123456' or run 'npm run seed:admin' to reset.",
      })
    }

    console.log("✅ Password verified")

    // Generate JWT token
    const token = jwt.sign(
      {
        adminId: admin._id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET || "quickfix-secret-key",
      { expiresIn: "24h" },
    )

    console.log("✅ Login successful for:", admin.username)

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      },
    })
  } catch (error) {
    console.error("❌ Admin login error:", error)
    res.status(500).json({
      success: false,
      message: "Login failed due to server error",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
}

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const status = req.query.status
    const serviceType = req.query.serviceType
    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

    // Build filter object
    const filter = {}
    if (status) filter.status = status
    if (serviceType) filter.serviceType = serviceType

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Get bookings with pagination and filtering
    const bookings = await Booking.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("-__v")

    // Get total count for pagination
    const totalBookings = await Booking.countDocuments(filter)
    const totalPages = Math.ceil(totalBookings / limit)

    // Get statistics
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalBookings,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      stats: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count
        return acc
      }, {}),
    })
  } catch (error) {
    console.error("Get all bookings error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
    })
  }
}

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes, estimatedCost } = req.body

    const updateData = { status }
    if (notes) updateData.notes = notes
    if (estimatedCost) updateData.estimatedCost = estimatedCost

    const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    })
  } catch (error) {
    console.error("Update booking error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    })
  }
}

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params

    const booking = await Booking.findByIdAndDelete(id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    })
  } catch (error) {
    console.error("Delete booking error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
    })
  }
}

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments()
    const pendingBookings = await Booking.countDocuments({ status: "pending" })
    const completedBookings = await Booking.countDocuments({ status: "completed" })

    // Get bookings by service type
    const serviceStats = await Booking.aggregate([
      {
        $group: {
          _id: "$serviceType",
          count: { $sum: 1 },
        },
      },
    ])

    // Get recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customerName serviceType status createdAt")

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        completedBookings,
        serviceStats,
        recentBookings,
      },
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard statistics",
    })
  }
}

module.exports = {
  adminLogin,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getDashboardStats,
}
