import React from 'react';
import { Package, MapPin, Truck } from 'lucide-react';

const PDFOrderView = ({ orders, SHOP_ADDRESS }) => {
  return (
    <div className="bg-white">
      {orders.map((order, index) => (
        <div 
          key={order._id} 
          className="page-container"
          style={{ 
            margin: '0 auto',
            padding: '20px',
            pageBreakAfter: 'always',
            pageBreakBefore: 'always',
            pageBreakInside: 'avoid',
            width: '100%',
            maxWidth: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '10.5in', // Slightly reduced from letter size for safety
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{ 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px' // Consistent spacing between elements
            }}
          >
            {/* Header - More compact */}
            <div className="border-b pb-2">
              <h2 className="text-lg font-bold">Order #{index + 1}</h2>
              <div className="flex justify-between text-xs text-gray-500">
                <span>ID: {order._id}</span>
                <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Addresses - Reduced padding */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border p-2 rounded">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="font-semibold text-xs">From</span>
                </div>
                <div className="text-xs">
                  <p className="font-medium">{SHOP_ADDRESS.name}</p>
                  <p>{SHOP_ADDRESS.street}</p>
                  <p>{SHOP_ADDRESS.city}, {SHOP_ADDRESS.state} {SHOP_ADDRESS.zipCode}</p>
                  <p>{SHOP_ADDRESS.phone}</p>
                </div>
              </div>

              <div className="border p-2 rounded">
                <div className="flex items-center gap-1 mb-1">
                  <Truck className="h-4 w-4" />
                  <span className="font-semibold text-xs">Ship To</span>
                </div>
                <div className="text-xs">
                  <p className="font-medium">{order.shippingInfo?.fullName}</p>
                  <p>{order.shippingInfo?.address}</p>
                  <p>{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.postalCode}</p>
                  <p>{order.shippingInfo?.phoneNumber}</p>
                </div>
              </div>
            </div>

            {/* Order Items - Optimized spacing */}
            <div className="border rounded p-2">
              <h3 className="font-semibold mb-1 text-xs">Order Items</h3>
              <div className="space-y-1">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b text-xs">
                    <div className="flex items-center gap-2">
                      <Package className="h-3 w-3 text-gray-400" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary - Compact version */}
            <div className="border rounded p-2">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{order.taxPrice}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t">
                  <span>Total</span>
                  <span className="text-green-600">₹{order.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Footer - More compact */}
            <div className="text-right text-xs text-gray-500">
              <p>Page {index + 1} of {orders.length}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PDFOrderView;