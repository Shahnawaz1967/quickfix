const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, "ZIP code is required"],
        trim: true,
      },
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      enum: {
        values: ["plumbing", "electrical", "ac-repair", "cleaning", "painting", "carpentry"],
        message: "Please select a valid service type",
      },
    },
    serviceDescription: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    preferredDate: {
      type: Date,
      required: [true, "Preferred date is required"],
      validate: {
        validator: (date) => date > new Date(),
        message: "Preferred date must be in the future",
      },
    },
    preferredTime: {
      type: String,
      required: [true, "Preferred time is required"],
      enum: {
        values: ["morning", "afternoon", "evening"],
        message: "Please select a valid time slot",
      },
    },
    urgency: {
      type: String,
      required: true,
      enum: {
        values: ["low", "medium", "high", "emergency"],
        message: "Please select a valid urgency level",
      },
      default: "medium",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
        message: "Please select a valid status",
      },
      default: "pending",
    },
    estimatedCost: {
      type: Number,
      min: [0, "Cost cannot be negative"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
bookingSchema.index({ email: 1, createdAt: -1 })
bookingSchema.index({ serviceType: 1, status: 1 })

module.exports = mongoose.model("Booking", bookingSchema)
