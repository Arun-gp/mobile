import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const { userEmail, orderId, shippingInfo } = await req.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NEXT_PUBLIC_SMTP_USER,
                pass: process.env.NEXT_PUBLIC_SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.NEXT_PUBLIC_SMTP_USER,
            to: userEmail,
            subject: `Shipping Information for Order #${orderId}`,
            html: `
          <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;">
              <div style="background-color: #fff; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h1 style="text-align: center; color: #2c3e50;">Shipping Information for Order #${orderId}</h1>
                <p>Dear Customer,</p>
                <p>Your order has been successfully processed and is on its way.</p>
                <div style="margin-top: 20px; background: #fafafa; padding: 15px; border-radius: 5px;">
                  <p><strong>Name:</strong> ${shippingInfo.fullName}</p>
                  <p><strong>Address:</strong> ${shippingInfo.address}</p>
                  <p><strong>City:</strong> ${shippingInfo.city}</p>
                  <p><strong>Postal Code:</strong> ${shippingInfo.postalCode}</p>
                  <p><strong>Phone Number:</strong> ${shippingInfo.phoneNumber}</p>
                  <p><strong>Country:</strong> ${shippingInfo.country}</p>
                </div>
                <p>Thank you for shopping with us!</p>
              </div>
            </body>
          </html>
        `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Email sent successfully!" });
    } catch (err) {
        console.error("Error in Send Email API:", err);
        return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
    }
}
