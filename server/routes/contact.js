const express = require('express');
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const router = express.Router();

let transporter;
if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
}

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    // Save to Database
    const newContact = await Contact.create({ name, email, message });

    // Send Email if configured
    if (transporter && process.env.RECEIVER_EMAIL) {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.RECEIVER_EMAIL, // Usually your own email where you want to receive messages
        subject: `New Portfolio Message from ${name}`,
        text: `You recieved a new message from your portfolio site:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      };
      
      try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Contact email sent successfully');
      } catch (emailErr) {
        console.error('❌ Failed to send contact email:', emailErr);
        // Continue anyway since we saved to DB
      }
    } else {
       console.log('⚠️ Email not sent. Ensure GMAIL_USER, GMAIL_PASS, and RECEIVER_EMAIL are set in .env');
    }

    res.status(201).json({ success: true, message: 'Message received and saved.', data: newContact });
  } catch (error) {
    console.error('Error saving contact form submission:', error);
    res.status(500).json({ error: 'Internal server error while processing contact form.' });
  }
});

module.exports = router;
