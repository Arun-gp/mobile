"use server"
import Product from "@/models/Product"; // Assuming your Product model is here
import Order from "@/model/OrderModel";
// Helper function to calculate total stock for a product based on sizes
function calculateTotalStock(sizes) {
  return sizes.reduce((acc, size) => acc + size.stock, 0);
}

// Function to update stock after an order is placed
async function updateStock(order) {
  for (const item of order.items) {
    try {
      // Fetch the product by productId
      const product = await Product.findById(item.productId);

      if (!product) {
        console.error(`Product with ID ${item.productId} not found.`);
        continue; // Skip this item if product is not found
      }

      // Find the size object in the product sizes array
      const sizeObj = product.sizes.find((size) => size.size === item.size);
      
      if (!sizeObj) {
        console.error(`Size ${item.size} not found for product ${product.name}`);
        continue; // Skip if the size is not found
      }

      // Update the stock for the found size
      sizeObj.stock -= item.quantity;

      if (sizeObj.stock < 0) {
        console.error(`Not enough stock for ${item.size} in product ${product.name}`);
        continue; // Skip if there is insufficient stock
      }

      // Save the updated product back to the database
      await product.save();
      console.log(`Updated stock for ${item.size} of product ${product.name}.`);

    } catch (error) {
      console.error(`Error updating stock for product ${item.productId}:`, error);
    }
  }
}

// Example of how to call the updateStock function after an order is created
async function handleOrderCreation(orderId) {
  try {
    // Fetch the order
    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      console.error(`Order with ID ${orderId} not found.`);
      return;
    }

    // Update stock based on the order
    await updateStock(order);

    console.log(`Stock updated successfully for order ${orderId}`);
  } catch (error) {
    console.error(`Error processing order ${orderId}:`, error);
  }
}

