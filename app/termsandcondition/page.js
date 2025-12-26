import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
      </div>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">General Terms</h2>
        <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li className="text-lg">Our website sells clothing, focusing on kids and women&apos;s wear</li>
            <li className="text-lg">Users must be 13 years or older to make purchases</li>
            <li className="text-lg">Parental/guardian consent required for users under 13</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Product Information</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-700 mb-4">We strive for accuracy in product descriptions. However:</p>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li className="text-lg">Colors may vary slightly from images</li>
            <li className="text-lg">Slight variations in design details may occur</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Pricing and Payment</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li className="text-lg">All prices are listed in INR (Indian Rupees)</li>
            <li className="text-lg">Prices include applicable taxes</li>
            <li className="text-lg">Payments are processed securely</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Returns and Refunds</h2>
        <div className="bg-red-50 rounded-lg shadow-md p-8 border-2 border-red-200">
          <p className="text-xl font-semibold text-red-800 mb-4">No refunds available</p>
          <p className="text-lg text-gray-700 mb-4">For order issues, contact us at:</p>
          <div className="space-y-2">
            <p className="text-lg text-gray-700">Email: <a href="mailto:support@krish.com" className="text-blue-600 hover:underline">support@krish.com</a></p>
            <p className="text-lg text-gray-700">Phone: <a href="tel:+91XXXXXXXXXX" className="text-blue-600 hover:underline">+91-XXXXXXXXXX</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
