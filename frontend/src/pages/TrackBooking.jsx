"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import {
  Search,
  Mail,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader,
  Phone,
  DollarSign,
} from "lucide-react"
import { bookingAPI } from "../services/api"

const TrackBooking = () => {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setSearchPerformed(true)

    try {
      const response = await bookingAPI.getByEmail(data.email)

      if (response.success) {
        setBookings(response.data)
        if (response.data.length === 0) {
          toast.info("No bookings found for this email address.")
        } else {
          toast.success(`Found ${response.data.length} booking(s)`)
        }
      } else {
        throw new Error(response.message || "Failed to fetch bookings")
      }
    } catch (error) {
      console.error("Booking search error:", error)
      toast.error(error.message || "Failed to search bookings. Please try again.")
      setBookings([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "in-progress":
        return <Loader className="h-5 w-5 text-purple-500 animate-spin" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "in-progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getServiceTypeLabel = (serviceType) => {
    const serviceMap = {
      plumbing: "Plumbing",
      electrical: "Electrical Repair",
      "ac-repair": "AC Repair",
      cleaning: "Cleaning Service",
      painting: "Painting",
      carpentry: "Carpentry",
    }
    return serviceMap[serviceType] || serviceType
  }

  const getTimeSlotLabel = (timeSlot) => {
    const timeMap = {
      morning: "Morning (9 AM - 12 PM)",
      afternoon: "Afternoon (12 PM - 5 PM)",
      evening: "Evening (5 PM - 8 PM)",
    }
    return timeMap[timeSlot] || timeSlot
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Track Your Booking</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Enter your email address to view your service bookings
          </p>
        </div>

        {/* Search Form */}
        <div className="card p-6 mb-8 animate-fade-in">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                className={`input ${errors.email ? "border-red-500" : ""}`}
                placeholder="Enter your email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary px-6 py-3 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search Bookings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {searchPerformed && (
          <div className="animate-fade-in">
            {bookings.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Bookings Found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We couldn't find any bookings associated with this email address.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Make sure you entered the correct email address, or{" "}
                  <a href="/book" className="text-primary-600 dark:text-primary-400 hover:underline">
                    create a new booking
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Bookings ({bookings.length})</h2>

                {bookings.map((booking) => (
                  <div key={booking._id} className="card p-6 animate-slide-up">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="flex items-start space-x-3 mb-4 lg:mb-0">
                        {getStatusIcon(booking.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {getServiceTypeLabel(booking.serviceType)}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Booking ID: {booking._id}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {booking.urgency === "emergency" && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full text-xs font-medium">
                            Emergency
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <User className="h-4 w-4" />
                          <span>{booking.customerName}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <Mail className="h-4 w-4" />
                          <span>{booking.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <Phone className="h-4 w-4" />
                          <span>{booking.phone}</span>
                        </div>
                        <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <div>
                            <div>{booking.address.street}</div>
                            <div>
                              {booking.address.city}, {booking.address.state} {booking.address.zipCode}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(booking.preferredDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <Clock className="h-4 w-4" />
                          <span>{getTimeSlotLabel(booking.preferredTime)}</span>
                        </div>
                        {booking.estimatedCost && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                            <DollarSign className="h-4 w-4" />
                            <span>Estimated Cost: ${booking.estimatedCost}</span>
                          </div>
                        )}
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Created: {formatDate(booking.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Service Description */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-start space-x-2">
                        <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Service Description:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{booking.serviceDescription}</p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Notes:</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{booking.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status-specific messages */}
                    {booking.status === "pending" && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Your booking is being reviewed. We'll contact you within 24 hours to confirm the appointment.
                        </p>
                      </div>
                    )}

                    {booking.status === "confirmed" && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Your appointment is confirmed! Our technician will arrive at the scheduled time.
                        </p>
                      </div>
                    )}

                    {booking.status === "completed" && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Service completed successfully! Thank you for choosing QuickFix.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 card p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If you have questions about your booking or need to make changes, contact us:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="Phone-98186144.." className="btn btn-primary flex items-center justify-center">
              <Phone className="h-4 w-4 mr-2" />
              Call 98186144..
            </a>
            <a href="mailto:heyshah24@gmail.com" className="btn btn-secondary flex items-center justify-center">
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackBooking
