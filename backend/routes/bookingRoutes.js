const express = require("express")
const { body } = require("express-validator")
const { createBooking, getBooking, getBookingsByEmail } = require("../controllers/bookingController")

const router = express.Router()

// Validation middleware for booking creation
const bookingValidation = [
  body("customerName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Customer name must be between 2 and 100 characters"),

  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),

  body("phone")
    .matches(/^[+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),

  body("address.street").trim().notEmpty().withMessage("Street address is required"),

  body("address.city").trim().notEmpty().withMessage("City is required"),

  body("address.state").trim().notEmpty().withMessage("State is required"),

  body("address.zipCode").trim().notEmpty().withMessage("ZIP code is required"),

  body("serviceType")
    .isIn(["plumbing", "electrical", "ac-repair", "cleaning", "painting", "carpentry"])
    .withMessage("Please select a valid service type"),

  body("serviceDescription")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Service description must be between 10 and 500 characters"),

  body("preferredDate")
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error("Preferred date must be in the future")
      }
      return true
    }),

  body("preferredTime").isIn(["morning", "afternoon", "evening"]).withMessage("Please select a valid time slot"),

  body("urgency").isIn(["low", "medium", "high", "emergency"]).withMessage("Please select a valid urgency level"),
]

// Routes
router.post("/", bookingValidation, createBooking)
router.get("/:id", getBooking)
router.get("/customer/:email", getBookingsByEmail)

module.exports = router
