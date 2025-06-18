const nodemailer = require("nodemailer")

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Send booking confirmation email
const sendBookingConfirmation = async (booking) => {
  try {
    const transporter = createTransporter()

    const serviceTypeMap = {
      plumbing: "Plumbing",
      electrical: "Electrical Repair",
      "ac-repair": "AC Repair",
      cleaning: "Cleaning Service",
      painting: "Painting",
      carpentry: "Carpentry",
    }

    const timeSlotMap = {
      morning: "Morning (9 AM - 12 PM)",
      afternoon: "Afternoon (12 PM - 5 PM)",
      evening: "Evening (5 PM - 8 PM)",
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@quickfix.com",
      to: booking.email,
      subject: "QuickFix - Service Booking Confirmation",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #2563eb; }
            .footer { text-align: center; padding: 20px; color: #666; }
            .status-badge { 
              display: inline-block; 
              padding: 4px 12px; 
              background: #fbbf24; 
              color: white; 
              border-radius: 20px; 
              font-size: 12px; 
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔧 QuickFix</h1>
              <h2>Booking Confirmation</h2>
            </div>
            
            <div class="content">
              <p>Dear ${booking.customerName},</p>
              <p>Thank you for choosing QuickFix! Your service booking has been confirmed.</p>
              
              <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                  <span class="label">Booking ID:</span> ${booking._id}
                </div>
                <div class="detail-row">
                  <span class="label">Service Type:</span> ${serviceTypeMap[booking.serviceType]}
                </div>
                <div class="detail-row">
                  <span class="label">Description:</span> ${booking.serviceDescription}
                </div>
                <div class="detail-row">
                  <span class="label">Preferred Date:</span> ${new Date(booking.preferredDate).toLocaleDateString()}
                </div>
                <div class="detail-row">
                  <span class="label">Preferred Time:</span> ${timeSlotMap[booking.preferredTime]}
                </div>
                <div class="detail-row">
                  <span class="label">Urgency:</span> ${booking.urgency.toUpperCase()}
                </div>
                <div class="detail-row">
                  <span class="label">Status:</span> <span class="status-badge">${booking.status.toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Service Address:</span><br>
                  ${booking.address.street}<br>
                  ${booking.address.city}, ${booking.address.state} ${booking.address.zipCode}
                </div>
              </div>
              
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Our team will review your request within 24 hours</li>
                <li>You'll receive a call to confirm the appointment details</li>
                <li>A qualified technician will arrive at your scheduled time</li>
              </ul>
              
              <p>If you have any questions or need to modify your booking, please contact us at:</p>
              <p>📞 Phone: (555) 123-4567<br>
              📧 Email: support@quickfix.com</p>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing QuickFix!</p>
              <p>© 2024 QuickFix. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Confirmation email sent:", result.messageId)
    return result
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

// Send status update email
const sendStatusUpdate = async (booking, oldStatus) => {
  try {
    const transporter = createTransporter()

    const statusMessages = {
      confirmed: "Your booking has been confirmed! Our technician will arrive as scheduled.",
      "in-progress": "Our technician is currently working on your service request.",
      completed: "Your service has been completed successfully. Thank you for choosing QuickFix!",
      cancelled: "Your booking has been cancelled. If you have any questions, please contact us.",
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@quickfix.com",
      to: booking.email,
      subject: `QuickFix - Booking Status Update: ${booking.status.toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1>🔧 QuickFix</h1>
            <h2>Booking Status Update</h2>
          </div>
          
          <div style="padding: 20px;">
            <p>Dear ${booking.customerName},</p>
            <p>${statusMessages[booking.status]}</p>
            
            <div style="background: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 8px;">
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              <p><strong>Status:</strong> ${booking.status.toUpperCase()}</p>
              ${booking.estimatedCost ? `<p><strong>Estimated Cost:</strong> $${booking.estimatedCost}</p>` : ""}
              ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ""}
            </div>
            
            <p>If you have any questions, please contact us at support@quickfix.com or (555) 123-4567.</p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Status update email sent:", result.messageId)
    return result
  } catch (error) {
    console.error("Status update email error:", error)
    throw error
  }
}

module.exports = {
  sendBookingConfirmation,
  sendStatusUpdate,
}
