"use client";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from "@/components/Header";
import Footer from "@/app/Footer/page";

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
let stripePromise = null;

if (stripePublicKey) {
    stripePromise = loadStripe(stripePublicKey);
}

export default function ClientLayout({ children }) {
    const content = (
        <AuthProvider>
            <CartProvider>
                <Header />
                {children}
                <Footer />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </CartProvider>
        </AuthProvider>
    );

    if (stripePromise) {
        return (
            <Elements stripe={stripePromise}>
                {content}
            </Elements>
        );
    }

    return content;
}
