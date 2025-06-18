import axios from "axios"

// Get API URL from environment or default to localhost
const getApiUrl = () => {
  // Check if we're in development or production
  const isDevelopment = import.meta.env.DEV
  const envApiUrl = import.meta.env.VITE_API_URL

  if (envApiUrl) {
    return envApiUrl
  }

  // Default URLs based on environment
  if (isDevelopment) {
    return "http://localhost:5000/api"
  }

  // Production fallback - you should set VITE_API_URL in production
  return "/api"
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 15000, // Increased timeout
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)

    // Add auth token for admin routes
    const token = localStorage.getItem("quickfix-admin-token")
    if (token && config.url?.includes("/admin/")) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("❌ Request Error:", error)
    return Promise.reject(error)
  },
)

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response.data
  },
  (error) => {
    console.error("❌ API Error:", error)

    // Handle different error types
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      const message = "Cannot connect to server. Please make sure the backend is running on the correct port."
      console.error("🔌 Connection Error:", message)
      return Promise.reject(new Error(message))
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("quickfix-admin-token")
      localStorage.removeItem("quickfix-admin-user")
      if (window.location.pathname.includes("/admin/dashboard")) {
        window.location.href = "/admin/login"
      }
    }

    const message = error.response?.data?.message || error.message || "An error occurred"
    return Promise.reject(new Error(message))
  },
)

// Test API connection
export const testConnection = async () => {
  try {
    const response = await api.get("/health")
    console.log("✅ Backend connection successful:", response)
    return { success: true, data: response }
  } catch (error) {
    console.error("❌ Backend connection failed:", error.message)
    return { success: false, error: error.message }
  }
}

// Booking API functions
export const bookingAPI = {
  // Create a new booking
  create: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Get booking by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Get bookings by email
  getByEmail: async (email) => {
    try {
      const response = await api.get(`/bookings/customer/${encodeURIComponent(email)}`)
      return response
    } catch (error) {
      throw error
    }
  },
}

// Admin API functions
export const adminAPI = {
  // Test admin connection
  testConnection: async () => {
    try {
      const response = await api.get("/admin/test")
      return response
    } catch (error) {
      throw error
    }
  },

  // Admin login
  login: async (credentials) => {
    try {
      console.log("🔐 Attempting admin login...")
      const response = await api.post("/admin/login", credentials)
      console.log("✅ Login successful")
      return response
    } catch (error) {
      console.error("❌ Login failed:", error.message)
      throw error
    }
  },

  // Get all bookings (admin only)
  getAllBookings: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString()
      const url = `/admin/bookings${queryString ? `?${queryString}` : ""}`
      const response = await api.get(url)
      return response
    } catch (error) {
      throw error
    }
  },

  // Update booking status
  updateBookingStatus: async (id, updateData) => {
    try {
      const response = await api.put(`/admin/bookings/${id}`, updateData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Delete booking
  deleteBooking: async (id) => {
    try {
      const response = await api.delete(`/admin/bookings/${id}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get("/admin/dashboard/stats")
      return response
    } catch (error) {
      throw error
    }
  },
}

export default api
