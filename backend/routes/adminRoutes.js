const express = require("express")
const { body } = require("express-validator")
const {
  adminLogin,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getDashboardStats,
} = require("../controllers/adminController")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

// Login validation
const loginValidation = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
]

// Status update validation
const statusUpdateValidation = [
  body("status")
    .isIn(["pending", "confirmed", "in-progress", "completed", "cancelled"])
    .withMessage("Please provide a valid status"),
  body("estimatedCost").optional().isNumeric().withMessage("Estimated cost must be a number"),
  body("notes").optional().isLength({ max: 1000 }).withMessage("Notes cannot exceed 1000 characters"),
]

// Test route (public)
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin API is working",
    timestamp: new Date().toISOString(),
  })
})

// Public routes
router.post("/login", loginValidation, adminLogin)

// Protected routes (require authentication)
router.use(authMiddleware)

router.get("/bookings", getAllBookings)
router.put("/bookings/:id", statusUpdateValidation, updateBookingStatus)
router.delete("/bookings/:id", deleteBooking)
router.get("/dashboard/stats", getDashboardStats)

module.exports = router
