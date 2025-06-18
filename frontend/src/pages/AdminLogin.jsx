"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Shield, User, Lock, Eye, EyeOff, Loader, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { adminAPI, testConnection } from "../services/api"
import AdminSetup from "../components/AdminSetup"

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("checking")
  const [showSetup, setShowSetup] = useState(false)
  const [lastError, setLastError] = useState("")
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const token = localStorage.getItem("quickfix-admin-token")
    if (token) {
      navigate("/admin/dashboard")
      return
    }
    checkConnection()
  }, [navigate])

  const checkConnection = async () => {
    try {
      setConnectionStatus("checking")
      const result = await testConnection()
      if (result.success) {
        setConnectionStatus("connected")
        toast.success("Connected to server")
      } else {
        setConnectionStatus("disconnected")
        toast.error("Cannot connect to server")
      }
    } catch (error) {
      setConnectionStatus("disconnected")
      toast.error("Server connection failed")
    }
  }

  const onSubmit = async (data) => {
    if (connectionStatus !== "connected") {
      toast.error("Please wait for server connection")
      return
    }

    setIsLoading(true)
    setLastError("")

    try {
      const response = await adminAPI.login(data)

      if (response.success) {
        localStorage.setItem("quickfix-admin-token", response.data.token)
        localStorage.setItem("quickfix-admin-user", JSON.stringify(response.data.admin))
        toast.success("Login successful!")
        navigate("/admin/dashboard")
      } else {
        throw new Error(response.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setLastError(error.message)

      // Show setup component if admin not found
      if (error.message.includes("Admin user not found") || error.message.includes("not found")) {
        setShowSetup(true)
        toast.error("Admin user not found. Please create an admin user first.")
      } else {
        toast.error(error.message || "Invalid credentials. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminCreated = () => {
    setShowSetup(false)
    setLastError("")
    toast.success("Admin created! You can now login with the credentials below.")
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "checking":
        return <Loader className="h-4 w-4 animate-spin text-yellow-500" />
      case "connected":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "disconnected":
        return <WifiOff className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getConnectionMessage = () => {
    switch (connectionStatus) {
      case "checking":
        return "Checking server connection..."
      case "connected":
        return "Connected to server"
      case "disconnected":
        return "Cannot connect to server. Please check if backend is running."
      default:
        return "Unknown connection status"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center animate-fade-in">
          <div className="mx-auto h-16 w-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to access the admin dashboard</p>
        </div>

        {/* Connection Status */}
        <div
          className={`card p-4 ${connectionStatus === "connected" ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : connectionStatus === "disconnected" ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"}`}
        >
          <div className="flex items-center space-x-2">
            {getConnectionIcon()}
            <span
              className={`text-sm font-medium ${connectionStatus === "connected" ? "text-green-800 dark:text-green-200" : connectionStatus === "disconnected" ? "text-red-800 dark:text-red-200" : "text-yellow-800 dark:text-yellow-200"}`}
            >
              {getConnectionMessage()}
            </span>
            {connectionStatus === "disconnected" && (
              <button
                onClick={checkConnection}
                className="ml-auto text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Retry
              </button>
            )}
          </div>
        </div>

        {/* Admin Setup Component */}
        {showSetup && <AdminSetup onAdminCreated={handleAdminCreated} />}

        <div className="card p-8 animate-slide-up">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`input pl-10 ${errors.username ? "border-red-500" : ""}`}
                  placeholder="Enter username or email"
                  {...register("username", {
                    required: "Username or email is required",
                  })}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  placeholder="Enter password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || connectionStatus !== "connected"}
              className="w-full btn btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This is a secure admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      

        {/* Error Display */}
        {lastError && (
          <div className="card p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Last Error</h3>
            <p className="text-xs text-red-700 dark:text-red-300">{lastError}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminLogin
