const nodemailer = require('nodemailer');

// Email service is DISABLED by default
// To enable: Set ENABLE_EMAIL=true and configure SMTP_USER and SMTP_PASS in .env
const EMAIL_ENABLED = process.env.ENABLE_EMAIL === 'true';
const hasEmailConfig = EMAIL_ENABLED && process.env.SMTP_USER && process.env.SMTP_PASS;

// Create transporter (configure with your email service)
let transporter = null;

if (hasEmailConfig) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  console.log('✅ Email service enabled');
} else {
  // Email service disabled - no emails will be sent
  transporter = {
    sendMail: async (options) => {
      // Silently skip email sending
      return { messageId: 'disabled-' + Date.now(), accepted: [options.to] };
    }
  };
}

/**
 * Send interview scheduling email to candidate
 */
async function sendInterviewEmail(candidateEmail, interviewDetails) {
  const {
    candidateName,
    interviewDate,
    interviewTime,
    interviewType,
    interviewLink,
    location,
    interviewer
  } = interviewDetails;

  const formattedDate = new Date(interviewDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: `"HR Team" <${process.env.SMTP_USER}>`,
    to: candidateEmail,
    subject: 'Interview Scheduled - Next Steps',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Interview Scheduled</h1>
          </div>
          <div class="content">
            <p>Dear ${candidateName},</p>
            <p>Thank you for your interest in joining our team. We're excited to schedule an interview with you!</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0;">Interview Details</h3>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${interviewTime}</p>
              <p><strong>Type:</strong> ${interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview</p>
              ${interviewLink ? `<p><strong>Meeting Link:</strong> <a href="${interviewLink}">${interviewLink}</a></p>` : ''}
              ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
              <p><strong>Interviewer:</strong> ${interviewer}</p>
            </div>

            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Please confirm your attendance by replying to this email</li>
              <li>Review the job description and prepare any questions</li>
              <li>Use our interview preparation tool to practice: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/interview-preparation">Practice Here</a></li>
              <li>Test your video/audio equipment if it's a video interview</li>
            </ul>

            ${interviewLink ? `<a href="${interviewLink}" class="button">Join Interview</a>` : ''}
            
            <p>We look forward to speaking with you!</p>
            <p>Best regards,<br>HR Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply directly to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    if (!hasEmailConfig) {
      // Email service is disabled - silently skip
      return { messageId: 'disabled-' + Date.now(), accepted: [candidateEmail] };
    }
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Interview confirmation email sent successfully to:', candidateEmail);
    return info;
  } catch (error) {
    console.error('❌ Error sending interview confirmation email:', error.message);
    // Don't throw - allow interview to be scheduled even if email fails
    console.log('⚠️  Interview was scheduled successfully, but email notification failed.');
    // Return success anyway to not block interview scheduling
    return { messageId: 'error-' + Date.now(), accepted: [candidateEmail] };
  }
}

/**
 * Send interview reminder email
 */
async function sendInterviewReminder(candidateEmail, interviewDetails) {
  const mailOptions = {
    from: `"HR Team" <${process.env.SMTP_USER}>`,
    to: candidateEmail,
    subject: 'Interview Reminder - Tomorrow',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #f5576c; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Interview Reminder</h1>
          </div>
          <div class="content">
            <p>Dear ${interviewDetails.candidateName},</p>
            <p>This is a friendly reminder that you have an interview scheduled for tomorrow.</p>
            
            <div class="info-box">
              <p><strong>Date:</strong> ${new Date(interviewDetails.interviewDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${interviewDetails.interviewTime}</p>
              ${interviewDetails.interviewLink ? `<p><strong>Link:</strong> <a href="${interviewDetails.interviewLink}">${interviewDetails.interviewLink}</a></p>` : ''}
            </div>

            <p>Don't forget to prepare! Use our interview preparation tool: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/interview-preparation">Practice Here</a></p>
            
            <p>See you tomorrow!</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Reminder email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending reminder:', error);
    throw error;
  }
}

module.exports = {
  sendInterviewEmail,
  sendInterviewReminder
};

