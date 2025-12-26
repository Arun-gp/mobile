"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "../action/OrderAction";
import { PaymentsendEmail } from "../action/PaymentSendMail";

export default function PaymentPage() {
  const [totalPrice, setTotalPrice] = useState(null);
  const [itemsPrice, setItemsPrice] = useState(null);
  const [shippingPrice, setShippingPrice] = useState(null);
  const [items, setItems] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();

  // Load Razorpay script dynamically
  useEffect(() => {
    const loadRazorpayScript = () => {
      if (typeof window !== "undefined" && !window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          console.log("Razorpay script loaded successfully.");
          setRazorpayLoaded(true);
        };
        script.onerror = () => {
          console.error("Failed to load Razorpay script. Retrying...");
          setTimeout(loadRazorpayScript, 3000);
        };
        document.body.appendChild(script);
      } else if (window.Razorpay) {
        setRazorpayLoaded(true);
      }
    };

    loadRazorpayScript();
  }, []);

  // Fetch order information from session storage
  useEffect(() => {
    const orderInfo = sessionStorage.getItem("orderInfo");

    if (orderInfo) {
      try {
        const { totalPrice, itemsPrice, shippingPrice, items } = JSON.parse(orderInfo);
        console.log("Order info loaded:", { totalPrice, itemsPrice, shippingPrice, items });
        
        setTotalPrice(totalPrice);
        setItemsPrice(itemsPrice);
        setShippingPrice(shippingPrice);
        setItems(items);
      } catch (error) {
        console.error("Error parsing order info:", error);
        setPaymentStatus("error");
        setErrorMessage("Invalid order information. Please try again.");
      }
    } else {
      console.log("No order information found in session storage.");
      setPaymentStatus("error");
      setErrorMessage("No order information found. Please start over.");
    }
  }, []);

  // Validate all required data before payment
  const validatePaymentData = () => {
    if (!totalPrice || totalPrice <= 0) {
      throw new Error("Invalid total price");
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items found for order");
    }

    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    const shippingInfo = localStorage.getItem(`shippingInfo_${userId}`);

    if (!userId || !userEmail) {
      throw new Error("User information missing. Please login again.");
    }

    if (!shippingInfo) {
      throw new Error("Shipping information missing.");
    }

    return { userId, userEmail, shippingInfo: JSON.parse(shippingInfo) };
  };

  // Process order after successful payment
  const processOrder = async (paymentResponse) => {
    console.log("Processing order after successful payment...");
    
    try {
      const { userId, userEmail, shippingInfo } = validatePaymentData();
      const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
      const isBuyNow = orderInfo?.isBuyNow || false;

      console.log("Creating order with data:", {
        totalPrice, itemsPrice, shippingPrice, 
        itemsCount: items?.length, userId, shippingInfo
      });

      // Create order in database
      const order = await createOrder(totalPrice, itemsPrice, shippingPrice, items, userId, shippingInfo);
      console.log("Order created successfully:", order);

      // Send confirmation email
      await PaymentsendEmail(userEmail, totalPrice, items);
      console.log("Confirmation email sent");

      // Clear storage based on purchase type
      if (isBuyNow) {
        localStorage.removeItem(`buyNow_${userId}`);
        localStorage.removeItem(`isBuyNow_${userId}`);
        console.log("Buy now storage cleared");
      } else {
        localStorage.removeItem(`cart_${userId}`);
        console.log("Cart storage cleared");
      }
      
      sessionStorage.removeItem("orderInfo");
      console.log("Order info cleared from session storage");

      return true;
    } catch (error) {
      console.error("Order processing failed:", error);
      throw error;
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setPaymentStatus("loading");
    setErrorMessage("");

    try {
      // Validate data before opening Razorpay
      validatePaymentData();

      if (!razorpayLoaded || typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Payment service is not ready. Please wait a moment and try again.");
      }

      if (!totalPrice || totalPrice <= 0) {
        throw new Error("Invalid order amount. Please try again.");
      }

      const userEmail = localStorage.getItem("userEmail") || "";
      const userName = localStorage.getItem("userName") || "Customer";
      const userPhone = localStorage.getItem("userPhone") || "9999999999";

      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(totalPrice * 100), // Convert to paise
        currency: "INR",
        name: "Your Company Name",
        description: "Order Payment",
        image: "/logo.png", // Add your logo
        handler: async function (response) {
          console.log("Razorpay payment successful:", response);
          setPaymentStatus("processing");
          
          try {
            await processOrder(response);
            
            setPaymentStatus("success");
            console.log("Order completed successfully");

            // Redirect to success page after delay
            setTimeout(() => {
              router.push("/payment-success");
            }, 3000);

          } catch (error) {
            console.error("Order processing after payment failed:", error);
            setPaymentStatus("error");
            
            if (error.message.includes('Insufficient stock')) {
              setErrorMessage(`Payment successful but ${error.message}. We will refund your amount within 24 hours.`);
            } else if (error.message.includes('Product not found') || error.message.includes('Invalid size')) {
              setErrorMessage(`Payment successful but ${error.message}. Please contact support.`);
            } else {
              setErrorMessage("Payment was successful but order creation failed. Please contact support with your payment ID.");
            }
            
            // Here you should implement a refund mechanism
            console.log("IMPLEMENT REFUND FOR PAYMENT:", response.razorpay_payment_id);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        notes: {
          order_type: "website_order",
        },
        theme: {
          color: "#F37254"
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            if (paymentStatus === "loading") {
              setPaymentStatus(null);
              setIsProcessing(false);
            }
          }
        }
      };

      // Add payment failure handler
      razorpayOptions.handler = razorpayOptions.handler.bind(this);

      const razorpayObject = new window.Razorpay(razorpayOptions);
      
      // Handle payment failure
      razorpayObject.on('payment.failed', function (response) {
        console.error('Razorpay payment failed:', response.error);
        setPaymentStatus("error");
        setIsProcessing(false);
        setErrorMessage(`Payment failed: ${response.error.description || "Please try again or use a different payment method."}`);
      });

      // Open Razorpay checkout
      razorpayObject.open();

    } catch (error) {
      console.error("Payment initialization failed:", error);
      setPaymentStatus("error");
      setIsProcessing(false);
      setErrorMessage(error.message || "Failed to initialize payment. Please try again.");
    }
  };

  // Retry payment handler
  const handleRetry = () => {
    setPaymentStatus(null);
    setErrorMessage("");
    setIsProcessing(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Payment</h2>

        {/* Order Summary */}
        {items && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items ({items.length}):</span>
                <span>{formatCurrency(itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formatCurrency(shippingPrice)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Status Messages */}
        {paymentStatus === "loading" && (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto mb-2"></div>
            <p className="text-gray-600">Initializing payment...</p>
          </div>
        )}

        {paymentStatus === "processing" && (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Processing your order...</p>
          </div>
        )}

        {paymentStatus === "success" && (
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-green-500 text-4xl mb-2">✓</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h3>
            <p className="text-green-700">Thank you for your purchase! Redirecting to confirmation page...</p>
          </div>
        )}

        {paymentStatus === "error" && (
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <div className="text-red-500 text-4xl mb-2">✗</div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Payment Failed</h3>
            <p className="text-red-700 mb-4">{errorMessage}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Payment Button */}
        {!paymentStatus && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleRazorpayPayment}
              disabled={!razorpayLoaded || isProcessing}
              className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition-colors ${
                !razorpayLoaded || isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-400"
              }`}
            >
              {!razorpayLoaded ? "Loading Payment..." : "Proceed to Pay"}
            </button>
            
            {!razorpayLoaded && (
              <p className="text-sm text-gray-500 text-center">
                Loading payment service...
              </p>
            )}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 Your payment is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
}