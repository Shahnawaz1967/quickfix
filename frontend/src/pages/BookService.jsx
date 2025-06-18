"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Calendar, MapPin, User, FileText, AlertCircle, CheckCircle, Loader } from "lucide-react"
import { bookingAPI } from "../services/api"

const BookService = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [bookingId, setBookingId] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm()

  const serviceTypes = [
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical Repair" },
    { value: "ac-repair", label: "AC Repair" },
    { value: "cleaning", label: "Cleaning Service" },
    { value: "painting", label: "Painting" },
    { value: "carpentry", label: "Carpentry" },
  ]

  const timeSlots = [
    { value: "morning", label: "Morning (9 AM - 12 PM)" },
    { value: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
    { value: "evening", label: "Evening (5 PM - 8 PM)" },
  ]

  const urgencyLevels = [
    { value: "low", label: "Low - Can wait a few days" },
    { value: "medium", label: "Medium - Within 1-2 days" },
    { value: "high", label: "High - Within 24 hours" },
    { value: "emergency", label: "Emergency - ASAP" },
  ]

  const onSubmit = async (data) => {
    setIsSubmitting(true)

    try {
      const response = await bookingAPI.create(data)

      if (response.success) {
        setBookingId(response.data.bookingId)
        setIsSuccess(true)
        toast.success("Booking submitted successfully! Check your email for confirmation.")
        reset()
      } else {
        throw new Error(response.message || "Failed to submit booking")
      }
    } catch (error) {
      console.error("Booking submission error:", error)
      toast.error(error.message || "Failed to submit booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Booking Confirmed!</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your service request has been submitted successfully. We'll contact you within 24 hours to confirm the
              appointment details.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Booking ID</p>
              <p className="font-mono text-lg font-semibold text-gray-900 dark:text-white">{bookingId}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setIsSuccess(false)
                  setBookingId("")
                }}
                className="btn btn-primary px-6 py-3"
              >
                Book Another Service
              </button>
              <button onClick={() => (window.location.href = `/track`)} className="btn btn-secondary px-6 py-3">
                Track This Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Book a Service</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Fill out the form below and we'll connect you with a qualified professional
          </p>
        </div>

        <div className="card p-8 animate-fade-in">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    className={`input ${errors.customerName ? "border-red-500" : ""}`}
                    placeholder="Enter your full name"
                    {...register("customerName", {
                      required: "Full name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" },
                    })}
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className={`input ${errors.email ? "border-red-500" : ""}`}
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className={`input ${errors.phone ? "border-red-500" : ""}`}
                    placeholder="Enter your phone number"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[+]?[1-9][\d]{0,15}$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Service Address */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Service Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    className={`input ${errors["address.street"] ? "border-red-500" : ""}`}
                    placeholder="Enter street address"
                    {...register("address.street", {
                      required: "Street address is required",
                    })}
                  />
                  {errors["address.street"] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors["address.street"].message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City *</label>
                  <input
                    type="text"
                    className={`input ${errors["address.city"] ? "border-red-500" : ""}`}
                    placeholder="Enter city"
                    {...register("address.city", {
                      required: "City is required",
                    })}
                  />
                  {errors["address.city"] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors["address.city"].message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State *</label>
                  <input
                    type="text"
                    className={`input ${errors["address.state"] ? "border-red-500" : ""}`}
                    placeholder="Enter state"
                    {...register("address.state", {
                      required: "State is required",
                    })}
                  />
                  {errors["address.state"] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors["address.state"].message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    className={`input ${errors["address.zipCode"] ? "border-red-500" : ""}`}
                    placeholder="Enter ZIP code"
                    {...register("address.zipCode", {
                      required: "ZIP code is required",
                    })}
                  />
                  {errors["address.zipCode"] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors["address.zipCode"].message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Service Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Type *
                  </label>
                  <select
                    className={`select ${errors.serviceType ? "border-red-500" : ""}`}
                    {...register("serviceType", {
                      required: "Please select a service type",
                    })}
                  >
                    <option value="">Select a service</option>
                    {serviceTypes.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                  {errors.serviceType && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.serviceType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    className={`select ${errors.urgency ? "border-red-500" : ""}`}
                    {...register("urgency", {
                      required: "Please select urgency level",
                    })}
                  >
                    <option value="">Select urgency</option>
                    {urgencyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  {errors.urgency && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.urgency.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Description *
                  </label>
                  <textarea
                    rows={4}
                    className={`textarea ${errors.serviceDescription ? "border-red-500" : ""}`}
                    placeholder="Please describe the issue or service needed in detail..."
                    {...register("serviceDescription", {
                      required: "Service description is required",
                      minLength: { value: 10, message: "Description must be at least 10 characters" },
                    })}
                  />
                  {errors.serviceDescription && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.serviceDescription.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Scheduling */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Preferred Schedule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    min={getTomorrowDate()}
                    className={`input ${errors.preferredDate ? "border-red-500" : ""}`}
                    {...register("preferredDate", {
                      required: "Please select a preferred date",
                    })}
                  />
                  {errors.preferredDate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.preferredDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Time *
                  </label>
                  <select
                    className={`select ${errors.preferredTime ? "border-red-500" : ""}`}
                    {...register("preferredTime", {
                      required: "Please select a preferred time",
                    })}
                  >
                    <option value="">Select time slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  {errors.preferredTime && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.preferredTime.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Notice */}
            {watch("urgency") === "emergency" && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-slide-up">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Emergency Service Request</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      For immediate emergency assistance, please call us directly at{" "}
                      <a href="tel:+15551234567" className="font-semibold underline">
                        (555) 123-4567
                      </a>
                      . We'll still process this form, but calling ensures the fastest response.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Submit Booking Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookService
