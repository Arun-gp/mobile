"use server";

import nodemailer from 'nodemailer';

// Function to send shipping information email to the user
export async function OrdersendEmail(userEmail, orderId, shippingInfo) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NEXT_PUBLIC_SMTP_USER,  // Your Gmail username
      pass: process.env.NEXT_PUBLIC_SMTP_PASS,  // Your Gmail password or app-specific password
    },
  });

  // Email message configuration
  const mailOptions = {
    from: process.env.NEXT_PUBLIC_SMTP_USER,
    to: userEmail,
    subject: `Shipping Information for Order #${orderId}`,
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              color: #333;
              padding: 20px;
            }
            .container {
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              font-size: 24px;
              font-weight: bold;
              color: #2c3e50;
              text-align: center;
            }
            .shipping-info {
              margin-top: 20px;
            }
            .shipping-info p {
              font-size: 16px;
              margin: 8px 0;
            }
            .footer {
              font-size: 12px;
              color: #777;
              text-align: center;
              margin-top: 40px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="header">Shipping Information for Order #${orderId}</h1>
            <p>Dear Customer,</p>
            <p>Your order has been successfully processed and is on its way. Below are the details for your shipping information:</p>

            <div class="shipping-info">
              <p><strong>Name:</strong> ${shippingInfo.fullName}</p>
              <p><strong>Address:</strong> ${shippingInfo.address}</p>
              <p><strong>City:</strong> ${shippingInfo.city}</p>
              <p><strong>Postal Code:</strong> ${shippingInfo.postalCode}</p>
              <p><strong>Phone Number:</strong> ${shippingInfo.phoneNumber}</p>
              <p><strong>Country:</strong> ${shippingInfo.country}</p>
            </div>

            <p>If you have any questions, feel free to contact us. Thank you for shopping with us!</p>

            <p class="footer">This email was sent automatically. Please do not reply to this email.</p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
