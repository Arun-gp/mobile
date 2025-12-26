import React from 'react';

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Shipping Policy</h1>
      </div>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Processing Time</h2>
        <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li className="text-lg">Orders are processed within 1-3 business days</li>
            <li className="text-lg">Processing may take longer during holidays and sales</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Delivery Information</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Domestic Shipping</h3>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li className="text-lg">Delivery within 3-7 business days</li>
            <li className="text-lg">Free shipping available on orders above threshold</li>
            <li className="text-lg">Shipping costs calculated at checkout</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Tracking Orders</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-700">
            Once your order is shipped, you&apos;ll receive a tracking number via email to monitor your package&apos;s status.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Lost or Damaged Packages</h2>
        <div className="bg-blue-50 rounded-lg shadow-md p-8 border-2 border-blue-200">
          <p className="text-lg text-gray-700 mb-4">Please report any issues within 7 days of delivery.</p>
          <div className="space-y-2">
            <p className="text-lg text-gray-700">Email: <a href="mailto:support@krish.com" className="text-blue-600 hover:underline">support@krish.com</a></p>
            <p className="text-lg text-gray-700">Phone: <a href="tel:+91XXXXXXXXXX" className="text-blue-600 hover:underline">+91-XXXXXXXXXX</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
