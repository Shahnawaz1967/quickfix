const Booking = require("../models/Booking")
const emailService = require("../services/emailService")
const { validationResult } = require("express-validator")

// Create a new booking
const createBooking = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const bookingData = req.body

    // Create new booking
    const booking = new Booking(bookingData)
    await booking.save()

    // Send confirmation email
    try {
      await emailService.sendBookingConfirmation(booking)
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        bookingId: booking._id,
        customerName: booking.customerName,
        serviceType: booking.serviceType,
        preferredDate: booking.preferredDate,
        status: booking.status,
      },
    })
  } catch (error) {
    console.error("Booking creation error:", error)

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }))

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      })
    }

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
}

// Get booking by ID
const getBooking = async (req, res) => {
  try {
    const { id } = req.params

    const booking = await Booking.findById(id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    res.status(200).json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error("Get booking error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve booking",
    })
  }
}

// Get bookings by email (for customer to track their bookings)
const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params

    const bookings = await Booking.find({ email }).sort({ createdAt: -1 }).select("-__v")

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    })
  } catch (error) {
    console.error("Get bookings by email error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
    })
  }
}

module.exports = {
  createBooking,
  getBooking,
  getBookingsByEmail,
}
