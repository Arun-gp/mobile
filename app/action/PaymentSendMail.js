"use server"

import nodemailer from 'nodemailer';

// Server Action to send email (Using 'use server' directive)
export async function PaymentsendEmail(userEmail, totalPrice, cartItems) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NEXT_PUBLIC_SMTP_USER,
      pass: process.env.NEXT_PUBLIC_SMTP_PASS,
    },
  });

  // Email message configuration
  const mailOptions = {
    from: process.env.NEXT_PUBLIC_SMTP_USER,
    to: userEmail,
    subject: 'Order Placed Successfully',
    html: `
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-gray-100 text-gray-900">
          <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h1 class="text-2xl font-semibold text-center text-blue-600">Order Confirmation</h1>
            <p class="text-center text-lg mt-4">Your order has been placed successfully!</p>
            
            <div class="mt-6">
              <h3 class="text-xl font-semibold text-gray-800">Order Details:</h3>
              <p class="text-lg text-gray-600 mt-2"><strong>Total Price:</strong> ₹${totalPrice}</p>
            </div>

            <div class="mt-6">
              <p class="text-lg text-gray-600"><strong>Items:</strong></p>
              <ul class="list-none pl-4 mt-2">
                ${cartItems?.map(item => `
                  <li class="text-gray-600 text-sm mb-2">${item.name} - ₹${item.price}</li>
                `).join('') || '<li class="text-gray-600 text-sm mb-2">No items in the cart</li>'}
              </ul>
            </div>

            <p class="text-center text-sm text-gray-600 mt-6">Thank you for shopping with us!</p>
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
