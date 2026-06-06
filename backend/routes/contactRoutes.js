import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if SMTP user and pass are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP configuration missing: SMTP_USER or SMTP_PASS is not set.');
    return res.status(500).json({ 
      message: 'SMTP credentials are not configured on the server. Please add SMTP_USER and SMTP_PASS to the backend .env file.' 
    });
  }

  try {
    // Configure transporter flexibly
    const transporterConfig = {
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };

    if (process.env.SMTP_HOST) {
      transporterConfig.host = process.env.SMTP_HOST;
      transporterConfig.port = parseInt(process.env.SMTP_PORT || '587', 10);
      transporterConfig.secure = process.env.SMTP_SECURE === 'true'; // true for 465, false for 587
    } else {
      transporterConfig.service = process.env.SMTP_SERVICE || 'gmail';
    }

    const transporter = nodemailer.createTransport(transporterConfig);

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`, // Send from authenticated user to avoid SMTP rejection
      to: receiverEmail,
      replyTo: email, // Reply-to remains the user's input email
      subject: `✨ New Inquiry from ${name} - Gemstone Shop`,
      text: `You received a new inquiry:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff; color: #333333;">
          <h2 style="color: #b91c1c; font-size: 24px; font-weight: 300; margin-bottom: 20px; border-bottom: 1px solid #eaeaea; padding-bottom: 15px; text-transform: uppercase; letter-spacing: 0.1em;">
            Gemstone Shop Inquiry
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666666; width: 120px; font-size: 14px;">Sender Name:</td>
              <td style="padding: 8px 0; color: #111111; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666666; font-size: 14px;">Email:</td>
              <td style="padding: 8px 0; color: #111111; font-size: 14px;">
                <a href="mailto:${email}" style="color: #b91c1c; text-decoration: none;">${email}</a>
              </td>
            </tr>
          </table>
          <div style="background-color: #fafafa; border: 1px solid #eeeeee; border-radius: 8px; padding: 20px; font-size: 15px; line-height: 1.6; color: #444444; white-space: pre-wrap;">
            ${message}
          </div>
          <div style="margin-top: 30px; font-size: 11px; color: #999999; text-align: center; border-top: 1px solid #eaeaea; padding-top: 15px;">
            This email was sent dynamically via the contact form on your Gemstone Shop web application.
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    res.status(500).json({ message: `Failed to send email: ${error.message}` });
  }
});

export default router;
