"use server"
import dbconnect from "@/db/dbconnect";
import Order from "@/model/OrderModel";


export async function getOrderWithDetails(id) {
  try {
    await dbconnect(); // Connect to the database

    // Fetch the order by ID and populate the user and items (with product details)
    const order = await Order.findById(id)
      .populate('user', 'name email') // Populate the user details
      .populate('items.productId', 'name price') // Populate product details for each item
      .lean() // Convert to plain object
      .exec(); // Execute the query

    if (!order) {
      throw new Error('Order not found');
    }

    return order; // Return the plain object of the populated order
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw new Error('Error fetching order details');
  }
}
