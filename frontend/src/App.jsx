"use client"

import React from "react"
import { Routes, Route } from "react-router-dom"
import { useTheme } from "./contexts/ThemeContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import BookService from "./pages/BookService"
import TrackBooking from "./pages/TrackBooking"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const { theme } = useTheme()

  React.useEffect(() => {
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Set CSS custom properties for toast styling
    const root = document.documentElement
    if (theme === "dark") {
      root.style.setProperty("--toast-bg", "#1f2937")
      root.style.setProperty("--toast-color", "#f9fafb")
      root.style.setProperty("--toast-border", "#374151")
    } else {
      root.style.setProperty("--toast-bg", "#ffffff")
      root.style.setProperty("--toast-color", "#111827")
      root.style.setProperty("--toast-border", "#e5e7eb")
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-theme">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookService />} />
          <Route path="/track" element={<TrackBooking />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
