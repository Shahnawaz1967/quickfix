const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "quickfix-secret-key")

    // Check if admin still exists and is active
    const admin = await Admin.findById(decoded.adminId)
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token.",
      })
    }

    req.admin = {
      id: decoded.adminId,
      username: decoded.username,
      role: decoded.role,
    }

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({
      success: false,
      message: "Access denied. Invalid token.",
    })
  }
}

module.exports = authMiddleware
