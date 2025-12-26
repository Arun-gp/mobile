"use server"
import dbconnect from "@/db/dbconnect";
import Order from "@/model/OrderModel"; // Import the Order model

export async function deleteOrderById(id) {
  try {
    await dbconnect(); // Ensure the database is connected

    // Try to find the order by its ID and delete it
    const order = await Order.findByIdAndDelete(id);

    // If no order is found, throw an error
    if (!order) {
      throw new Error("Order not found");
    }

    // Return success message if the order is deleted
    return {
      success: true,
      message: "Order deleted successfully"
    };
  } catch (error) {
    console.error('Error deleting order:', error);
    throw new Error('Failed to delete order');
  }
}
