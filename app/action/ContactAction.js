"use server"
// app/contact/actions.ts
import nodemailer from 'nodemailer';

export async function sendEmail(formData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_SMTP_HOST,
        port: process.env.NEXT_PUBLIC_SMTP_PORT,
        auth: {
            user: process.env.NEXT_PUBLIC_SMTP_USER,
            pass: process.env.NEXT_PUBLIC_SMTP_PASS
        },
  });

  // Define the email options
  const mailOptions = {
    from: email, // From the form data (sender's email)
    to: process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL, // The recipient's email (your email)
    subject: `Contact Submission from ${name}`,
    text: `Message from: ${name} (${email})\n\n${message}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error sending email' };
  }
}
