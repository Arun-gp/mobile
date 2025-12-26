/* // app/api/verify-payment/route.js
import { NextResponse } from 'next/server';
import dbconnect from "@/db/dbconnect"; // Ensure DB connection
export async function POST(request) {
  try {
    await dbconnect();
    const body = await request.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { message: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Here you would integrate with your UPI payment gateway
    // to verify the transaction status
    // This is a placeholder for the actual verification logic
    const isVerified = await simulatePaymentVerification(transactionId);

    return NextResponse.json(
      { 
        verified: isVerified,
        transactionId,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { message: 'Payment verification failed', error: error.message },
      { status: 500 }
    );
  }
}

// Simulate payment verification (replace with actual payment gateway integration)
async function simulatePaymentVerification(transactionId) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demonstration, verify transactions based on some pattern
  // In production, this would be replaced with actual payment gateway verification
  const isValid = transactionId.startsWith('TXN_') && transactionId.length > 20;
  
  return isValid;
}

// Optional: Handle GET requests to explain API usage
export async function GET() {
  return NextResponse.json(
    {
      message: 'Payment verification endpoint. Please use POST method with transactionId.',
      usage: {
        method: 'POST',
        contentType: 'application/json',
        body: {
          transactionId: 'string (required)'
        }
      }
    },
    { status: 200 }
  );
} */
/* 
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { createOrder } from "../action/OrderAction";
import { PaymentsendEmail } from "../action/PaymentSendMail";

export default function PaymentPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState({
    totalPrice: null,
    itemsPrice: null,
    shippingPrice: null,
    taxPrice: null,
    items: null,
  });
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Load order info once on component mount
  useEffect(() => {
    const orderInfo = sessionStorage.getItem("orderInfo");
    if (orderInfo) {
      const parsedInfo = JSON.parse(orderInfo);
      setPaymentData({
        totalPrice: parsedInfo.totalPrice,
        itemsPrice: parsedInfo.itemsPrice,
        shippingPrice: parsedInfo.shippingPrice,
        taxPrice: parsedInfo.taxPrice,
        items: parsedInfo.items,
      });
    } else {
      console.log("No order information found.");
      setPaymentStatus("failed");
    }
  }, []);

  const generateUPIUrl = useCallback((amount) => {
    const upiId = process.env.NEXT_PUBLIC_UPI_ID || '8778297577@ybl';
    const merchantName = encodeURIComponent('YourShopName');
    const transactionNote = encodeURIComponent('Payment for Order');
    const formattedAmount = parseFloat(amount).toFixed(2);
    
    // Generate transaction ID only if not already set
    const txnId = transactionId || `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    if (!transactionId) {
      setTransactionId(txnId);
    }

    return `upi://pay?pa=${upiId}`
      + `&pn=${merchantName}`
      + `&tn=${transactionNote}`
      + `&am=${formattedAmount}`
      + `&cu=INR`
      + `&tr=${txnId}`
      + `&mode=04`;
  }, [transactionId]);

  const verifyPayment = async (txnId) => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId: txnId }),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const { verified } = await response.json();
      return verified;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePaymentVerification = async () => {
    if (!transactionId) {
      alert("Please initiate payment first");
      return;
    }

    setPaymentStatus('pending');
    const isVerified = await verifyPayment(transactionId);

    if (isVerified) {
      try {
        const userId = localStorage.getItem("userId");
        const userEmail = localStorage.getItem("userEmail");
        const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
        const isBuyNow = orderInfo.isBuyNow;
        const storedShippingInfo = JSON.parse(localStorage.getItem(`shippingInfo_${userId}`)) || {};

        // Create order in database
        await createOrder(
          paymentData.totalPrice,
          paymentData.itemsPrice,
          paymentData.shippingPrice,
          paymentData.taxPrice,
          paymentData.items,
          userId,
          storedShippingInfo
        );
        
        await PaymentsendEmail(userEmail, paymentData.totalPrice, paymentData.items);

        // Clear storage
        if (isBuyNow) {
          localStorage.removeItem(`buyNow_${userId}`);
          localStorage.removeItem(`isBuyNow_${userId}`);
        } else {
          localStorage.removeItem(`cart_${userId}`);
        }
        sessionStorage.removeItem("orderInfo");

        setPaymentStatus('success');
        router.push("/payment-success");
      } catch (error) {
        console.error("Order creation or email sending failed:", error);
        setPaymentStatus("failed");
      }
    } else {
      setPaymentStatus('failed');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Payment Page</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items Price:</span>
            <span>₹{paymentData.itemsPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>₹{paymentData.shippingPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>₹{paymentData.taxPrice}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total:</span>
            <span>₹{paymentData.totalPrice}</span>
          </div>
        </div>
      </div>

      {paymentStatus === 'pending' && (
        <div className="text-yellow-500 mb-4">
          <p className="font-semibold">Verifying Payment...</p>
          <p>Please wait while we confirm your payment</p>
        </div>
      )}

      {paymentStatus === 'success' ? (
        <div className="text-green-500">
          <h3 className="text-2xl font-semibold">Payment Successful!</h3>
          <p className="mt-2">Redirecting to order confirmation...</p>
        </div>
      ) : paymentStatus === 'failed' ? (
        <div className="text-red-500">
          <h3 className="text-2xl font-semibold">Payment Failed</h3>
          <p className="mt-2">There was an error processing your payment. Please try again.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <button
            onClick={() => setShowQRCode(!showQRCode)}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            {showQRCode ? 'Hide QR Code' : 'Pay with UPI'}
          </button>

          {showQRCode && (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-4 bg-white rounded-lg shadow">
                <QRCode
                  value={generateUPIUrl(paymentData.totalPrice)}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-gray-600">Scan with any UPI app to pay</p>
              <p className="text-sm font-semibold">Amount: ₹{paymentData.totalPrice}</p>

              <div className="flex flex-col gap-2 w-full mt-2">
                <a
                  href={`gpay://upi/pay?pa=${process.env.NEXT_PUBLIC_UPI_ID}&pn=YourShopName&am=${paymentData.totalPrice}&cu=INR&tr=${transactionId}`}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded text-center text-sm"
                  onClick={() => setPaymentStatus('pending')}
                >
                  Open in Google Pay
                </a>
                <a
                  href={`phonepe://pay?pa=${process.env.NEXT_PUBLIC_UPI_ID}&pn=YourShopName&am=${paymentData.totalPrice}&cu=INR&tr=${transactionId}`}
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded text-center text-sm"
                  onClick={() => setPaymentStatus('pending')}
                >
                  Open in PhonePe
                </a>
                <a
                  href={`paytm://upi/pay?pa=${process.env.NEXT_PUBLIC_UPI_ID}&pn=YourShopName&am=${paymentData.totalPrice}&cu=INR&tr=${transactionId}`}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded text-center text-sm"
                  onClick={() => setPaymentStatus('pending')}
                >
                  Open in Paytm
                </a>
              </div>

              {transactionId && (
                <button
                  onClick={handlePaymentVerification}
                  disabled={isVerifying}
                  className={`w-full py-2 px-4 rounded text-white ${
                    isVerifying 
                      ? 'bg-gray-400' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isVerifying ? 'Verifying Payment...' : 'Verify Payment'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} */