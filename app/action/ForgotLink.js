// app/actions/forgotPassword.js
"use server"

import nodemailer from 'nodemailer';
import crypto from 'crypto';
import UserModels from '@/model/UserModel';

// Assuming this is your MongoDB User model

export async function ForgotLink({email}) {
  // Get the email from the request body
  
  console.log("Received email:", email);  // Log the email that was passed

  // Find user by email (Case-insensitive query)
  const user = await UserModels.findOne({ email: new RegExp('^' + email + '$', 'i') });

  if (!user) {
    console.log("User not found for email:", email); // Log if user is not found
    return { message: 'User not found' };  // Return user not found message
  }

  console.log("User found:", user); // Log user data

  // Generate a reset token
  const token = crypto.randomBytes(32).toString('hex');
  const resetToken = crypto.createHash('sha256').update(token).digest('hex');
  
  // Set token and expiration time in the database
  user.resetToken = resetToken;
  user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
  await user.save();

  // Create the reset link
  const resetLink = `https://www.aadhanaa.com/reset-password/${resetToken}`;
   console.log(resetLink);
   
  // Setup Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_SMTP_HOST,
    port: process.env.NEXT_PUBLIC_SMTP_PORT,
    auth: {
      user: process.env.NEXT_PUBLIC_SMTP_USER,
      pass: process.env.NEXT_PUBLIC_SMTP_PASS,
    },
  });

  // Send email with reset link
  try {
    await transporter.sendMail({
      from: `${process.env.NEXT_PUBLIC_SMTP_FROM_NAME} <${process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    console.log("Password reset email sent to:", email); // Log that the email was sent
    return { message: 'Password reset link sent to your email.' };  // Success response
  } catch (error) {
    console.error("Error sending email:", error);
    return { message: 'Failed to send reset email. Please try again later.' };  // Error response
  }
}