"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Truck } from "lucide-react";
import { toast } from "react-toastify";

export default function ShippingPage() {
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    phoneNumber: ""
  });
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) {
      router.push("/login");
      return;
    }

    const fetchData = () => {
      try {
        const storedShippingInfo = localStorage.getItem(`shippingInfo_${userId}`);
        const isBuyNow = localStorage.getItem(`isBuyNow_${userId}`);
        
        const items = isBuyNow === "true" 
          ? JSON.parse(localStorage.getItem(`buyNow_${userId}`) || "[]")
          : JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");

        if (storedShippingInfo) {
          const parsedInfo = JSON.parse(storedShippingInfo);
          setShippingInfo(prev => ({
            ...prev,
            ...parsedInfo,
            country: parsedInfo.country || "India"
          }));
          setIsEditing(false);
        }

        setOrderItems(items);
      } catch (error) {
        console.error("Error loading shipping data:", error);
        toast.error("Failed to load shipping information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateShippingInfo = () => {
    const requiredFields = ['fullName', 'address', 'city', 'state', 'country', 'postalCode', 'phoneNumber'];
    for (const field of requiredFields) {
      if (!shippingInfo[field]?.trim()) {
        const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
        toast.error(`Please fill in your ${fieldName}`);
        return false;
      }
    }
    return true;
  };

  const handleSaveAddress = () => {
    if (validateShippingInfo()) {
      localStorage.setItem(`shippingInfo_${userId}`, JSON.stringify(shippingInfo));
      setIsEditing(false);
      toast.success("Shipping information saved successfully!");
    }
  };

  const calculateDiscountedPrice = (item) => {
    const selectedSizePrice = item.sizes?.[item.selectedSize]?.price || item.price;
    const discountPrice = selectedSizePrice - (selectedSizePrice * ((item.discountPercentage || 0) / 100));
    return discountPrice;
  };

  const subtotal = orderItems.reduce((total, item) => {
    const discountedPrice = calculateDiscountedPrice(item);
    return total + discountedPrice * (item.quantity || 1);
  }, 0);

  // Calculate total quantity of all items
  const totalQuantity = orderItems.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

  // Calculate shipping units based on quantity
  // 1-4 items = 1 unit, 5-8 items = 2 units, 9-12 items = 3 units, etc.
  const calculateShippingUnits = (quantity) => {
    return Math.ceil(quantity / 4);
  };

  const shippingUnits = calculateShippingUnits(totalQuantity);

  // Determine rate per unit based on state with flexible matching
  const getRatePerUnit = () => {
    const state = shippingInfo.state?.trim().toLowerCase();
    
    // Check for various ways users might type Tamil Nadu
    const isTamilNadu = [
      "tamil nadu",
      "tamilnadu", 
      "tamil nadu state",
      "tamilnadu state",
      "tn",
      "t.n.",
      "tamil nadu, india",
      "tamilnadu, india"
    ].includes(state);

    if (isTamilNadu) {
      return 50; // ₹50 per unit for Tamil Nadu
    } else {
      return 80; // ₹80 per unit for other Indian states
    }
  };

  const ratePerUnit = getRatePerUnit();
  const shippingPrice = shippingUnits * ratePerUnit;
  const totalPrice = (subtotal + shippingPrice).toFixed(2);

  // Helper function to check if state is Tamil Nadu for display
  const isTamilNaduState = () => {
    const state = shippingInfo.state?.trim().toLowerCase();
    const tamilNaduVariations = [
      "tamil nadu",
      "tamilnadu", 
      "tamil nadu",
      "tamilnadu",
      "tn",
      "t.n.",
      "tamil nadu",
      "tamilnadu",
      "Tamil Nadu",
      "TAMILNADU",
      "TAMIL NADU"
    ];
    return tamilNaduVariations.includes(state);
  };

  const processPayment = () => {
    if (!validateShippingInfo()) {
      return;
    }

    const data = {
      itemsPrice: subtotal.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      totalPrice,
      items: orderItems.map(item => ({
        _id: item._id,
        name: item.name,
        quantity: item.quantity,
        size: item.selectedSize,
        price: calculateDiscountedPrice(item),
      })),
      isBuyNow: localStorage.getItem(`isBuyNow_${userId}`) === "true",
      shippingInfo: shippingInfo,
      totalQuantity: totalQuantity,
      shippingUnits: shippingUnits
    };
    
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    
    if (data.isBuyNow) {
      localStorage.removeItem(`buyNow_${userId}`);
      localStorage.removeItem(`isBuyNow_${userId}`);
    }
    
    router.push("/payment");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Order Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-1" />
              Cart
            </span>
            <span className="text-gray-300">→</span>
            <span className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-1" />
              Shipping
            </span>
            <span className="text-gray-300">→</span>
            <span className="text-gray-400">Payment</span>
          </div>
        </div>

        {/* Shipping Information Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Truck className="w-6 h-6 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold">Shipping Information</h2>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Edit
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={shippingInfo.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    placeholder="e.g., Tamil Nadu, Karnataka, etc."
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Shipping Rates:</strong> 
                  <br />• Tamil Nadu: ₹50 per unit (1 unit = 1-4 items)
                  <br />• Other States: ₹80 per unit (1 unit = 1-4 items)
                  <br />• Each additional unit (4 items) adds the same charge
                </p>
              </div>
              <button
                onClick={handleSaveAddress}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 mt-4"
              >
                Save Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Full Name</p>
                <p className="font-medium">{shippingInfo.fullName}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone Number</p>
                <p className="font-medium">{shippingInfo.phoneNumber}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Address</p>
                <p className="font-medium">{shippingInfo.address}</p>
              </div>
              <div>
                <p className="text-gray-600">City</p>
                <p className="font-medium">{shippingInfo.city}</p>
              </div>
              <div>
                <p className="text-gray-600">State</p>
                <p className="font-medium">{shippingInfo.state}</p>
              </div>
              <div>
                <p className="text-gray-600">Postal Code</p>
                <p className="font-medium">{shippingInfo.postalCode}</p>
              </div>
              <div>
                <p className="text-gray-600">Country</p>
                <p className="font-medium">{shippingInfo.country}</p>
              </div>
              <div className="col-span-2 bg-blue-50 p-3 rounded-lg mt-2">
                <p className="text-sm text-blue-700">
                  <strong>Shipping Rate:</strong> {isTamilNaduState() ? "₹50/unit" : "₹80/unit"} ({totalQuantity} items = {shippingUnits} units)
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-4">
            {orderItems.map((item, index) => {
              const itemTotal = calculateDiscountedPrice(item) * (item.quantity || 1);
              return (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.selectedSize} | Quantity: {item.quantity || 1}
                    </p>
                  </div>
                  <p className="font-medium">₹{itemTotal.toFixed(2)}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({totalQuantity} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Shipping ({totalQuantity} items = {shippingUnits} units × ₹{ratePerUnit}/unit)
              </span>
              <span>₹{shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-4 border-t">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        </div>

        <button
          onClick={processPayment}
          className="w-full bg-gray-600 text-white py-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isEditing}
        >
          {isEditing ? "Save Address to Continue" : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}