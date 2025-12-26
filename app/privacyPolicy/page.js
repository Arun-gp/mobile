import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      </div>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Our Commitment to Privacy</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            At Krish, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you visit our website and make purchases.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Information We Collect</h2>
        <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li className="text-lg">Personal details (name, email address, shipping address, phone number)</li>
            <li className="text-lg">Payment information for order processing (handled securely)</li>
            <li className="text-lg">Browsing behavior and preferences via cookies</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">How We Use Your Information</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li className="text-lg">To process and fulfill your orders</li>
            <li className="text-lg">To improve your shopping experience</li>
            <li className="text-lg">To communicate updates and promotions</li>
            <li className="text-lg">To comply with legal obligations</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Contact Us</h2>
        <div className="bg-blue-50 rounded-lg shadow-md p-8 border-2 border-blue-200">
          <p className="text-lg text-gray-700 mb-4">For privacy-related inquiries:</p>
          <div className="space-y-2">
            <p className="text-lg text-gray-700">Email: <a href="mailto:support@krish.com" className="text-blue-600 hover:underline">support@krish.com</a></p>
            <p className="text-lg text-gray-700">Phone: <a href="tel:+91XXXXXXXXXX" className="text-blue-600 hover:underline">+91-XXXXXXXXXX</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
