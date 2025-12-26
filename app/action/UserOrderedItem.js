"use server";

import dbconnect from "@/db/dbconnect";
import Order from "@/model/OrderModel";

// Fetch orders function (Server-side)
export async function getUserOrderItem(userId) {
  try {
    await dbconnect(); // Ensure DB is connected

    // Fetch orders for the specific user, use 'userId' to filter orders
    const orders = await Order.find({ user: userId }).lean(); // .lean() ensures we get plain JavaScript objects

    // If no orders are found, return a message or empty array
    if (orders.length === 0) {
      return { error: "No orders found for this user" };
    }

    // Serialize the orders, convert MongoDB ObjectId to string, Dates to strings, and handle Buffers
    const serializedOrders = orders.map((order) => {
      return {
        _id: order._id.toString(), // Convert MongoDB ObjectId to string
        totalPrice: order.totalPrice, // Ensure it's a primitive number
        itemsPrice: order.itemsPrice,
        shippingPrice: order.shippingPrice,
        taxPrice: order.taxPrice,
        user: order.user.toString(), // Convert user ObjectId to string
        items: order.items.map((item) => {
          return {
            ...item,
            _id: item._id.toString(),
            productId: item.productId.toString(), // Convert productId to string (ObjectId)
            size: item.size ? item.size.toString() : null, // Convert size to string (if it's an ObjectId)
            quantity: item.quantity ? item.quantity.toString() : null, // Convert quantity to string (if needed)
          };
        }),
        shippingInfo: order.shippingInfo,
        createdAt: order.createdAt.toString(), // Convert Date to ISO string
        updatedAt: order.updatedAt.toString(), // Convert Date to ISO string
      };
    });

    return { orders: serializedOrders }; // Return serialized orders in a structured response
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { error: 'Unable to fetch orders' }; // Return error if something went wrong
  }
}
