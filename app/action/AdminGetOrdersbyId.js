"use server"
import dbconnect from "@/db/dbconnect";
import Order from "@/model/OrderModel";  // Order model
  

// Fetch a single order by its ID (Server-side)
export async function getOrderById(id) {
  try {
    // Validate the ID (MongoDB ObjectId format)
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error("Invalid Order ID format");
    }

    await dbconnect(); // Ensure DB is connected

    // Find the order by ID and populate the 'user' field with 'email'
    const order = await Order.findById(id)
        .populate('user', 'email')   // Populate the 'user' field and select only the 'email' field
      .lean(); // Use lean() to return plain JavaScript objects

    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    // Serialize the order to ensure all ObjectIds are converted to strings
    const serializedOrder = {
      _id: order._id.toString(),
      totalPrice: order.totalPrice,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      user: order.user._id.toString(), // Convert the user ObjectId to string
      email: order.user.email, // Add the populated email
      items: order.items.map((item) => ({
        ...item,
        productId: item.productId.toString(), // Convert productId ObjectId to string
        _id: item._id.toString(), // Convert item _id to string
      })),
      shippingInfo: order.shippingInfo,
      createdAt: order.createdAt.toString(),
      updatedAt: order.updatedAt.toString(),
    };

    return serializedOrder;
  } catch (error) {
    console.error("Error fetching order:", error.message); // Log detailed error
    throw new Error(`Unable to fetch order with ID ${id}: ${error.message}`);
  }
}
