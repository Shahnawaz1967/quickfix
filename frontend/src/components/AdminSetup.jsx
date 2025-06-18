"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { Shield, User, CheckCircle, AlertCircle, Loader } from "lucide-react"
import api from "../services/api"

const AdminSetup = ({ onAdminCreated }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [adminStatus, setAdminStatus] = useState(null)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  const checkAdminStatus = async () => {
    setIsCheckingStatus(true)
    try {
      const response = await api.get("/setup/admin-status")
      setAdminStatus(response.data)
    } catch (error) {
      toast.error("Failed to check admin status")
    } finally {
      setIsCheckingStatus(false)
    }
  }

  const createAdmin = async () => {
    setIsCreating(true)
    try {
      const response = await api.post("/setup/create-admin")
      if (response.success) {
        toast.success("Admin created successfully!")
        setAdminStatus({ ...adminStatus, hasAdmin: true })
        if (onAdminCreated) onAdminCreated()
      }
    } catch (error) {
      toast.error(error.message || "Failed to create admin")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="card p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Admin Setup Required</h3>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">
            No admin user found in the database. You need to create an admin user to access the dashboard.
          </p>

          <div className="space-y-4">
            {!adminStatus && (
              <button
                onClick={checkAdminStatus}
                disabled={isCheckingStatus}
                className="btn btn-secondary flex items-center space-x-2"
              >
                {isCheckingStatus ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    <span>Check Admin Status</span>
                  </>
                )}
              </button>
            )}

            {adminStatus && !adminStatus.hasAdmin && (
              <button
                onClick={createAdmin}
                disabled={isCreating}
                className="btn btn-primary flex items-center space-x-2"
              >
                {isCreating ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Creating Admin...</span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4" />
                    <span>Create Admin User</span>
                  </>
                )}
              </button>
            )}

            {adminStatus && adminStatus.hasAdmin && (
              <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-4 w-4" />
                <span>Admin user exists! Try logging in again.</span>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-800/20 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Alternative: Use Command Line
            </h4>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <p>1. Open terminal in backend folder</p>
              <p>
                2. Run: <code className="bg-yellow-200 dark:bg-yellow-700 px-1 rounded">npm run setup:admin</code>
              </p>
              <p>3. Follow the instructions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSetup
