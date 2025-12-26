"use server"
import dbconnect from "@/db/dbconnect";
import Order from "@/model/OrderModel";
import Product from "@/model/ProductModel";

export async function createOrder(totalPrice, itemsPrice, shippingPrice, items, userId, shippingInfo) {
  let session = null;
  
  try {
    console.log('Starting order creation process...');
    console.log('Received data:', { 
      totalPrice, 
      itemsPrice, 
      shippingPrice, 
      itemsCount: items?.length, 
      userId, 
      shippingInfo: shippingInfo ? 'provided' : 'missing' 
    });

    // Validate input parameters
    if (!totalPrice || totalPrice <= 0) {
      throw new Error('Invalid total price');
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('No items provided for order');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Connect to MongoDB
    await dbconnect();
    console.log('Database connected successfully');

    const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    // Format and validate cart items
    const formattedItems = items.map((item, index) => {
      console.log(`Processing item ${index + 1}:`, item);

      // Validate required fields
      if (!item._id) {
        throw new Error(`Item ${index + 1} missing product ID`);
      }
      if (!item.name) {
        throw new Error(`Item ${index + 1} missing name`);
      }
      if (!item.price || item.price <= 0) {
        throw new Error(`Item ${index + 1} has invalid price`);
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new Error(`Item ${index + 1} has invalid quantity`);
      }
      if (!item.size) {
        throw new Error(`Item ${index + 1} missing size`);
      }
      if (!validSizes.includes(item.size)) {
        throw new Error(`Invalid size "${item.size}" for item ${index + 1}. Valid sizes: ${validSizes.join(', ')}`);
      }

      return {
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image || null,
      };
    });

    console.log('Formatted items validated successfully');

    // Create order object
    const orderData = {
      totalPrice,
      itemsPrice,
      shippingPrice,
      items: formattedItems,
      user: userId,
      shippingInfo,
      paymentStatus: 'completed',
      orderStatus: 'processing'
    };

    console.log('Creating order with data:', orderData);

    const newOrder = new Order(orderData);
    const createdOrder = await newOrder.save();
    
    console.log('Order saved successfully with ID:', createdOrder._id);

    // Update product stock for each item
    for (const item of formattedItems) {
      console.log(`Updating stock for product ${item.productId}, size ${item.size}, quantity ${item.quantity}`);
      
      const product = await Product.findById(item.productId);
      
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      console.log('Found product:', product.name);

      // Check if product has sizes object
      if (!product.sizes) {
        throw new Error(`Product ${product.name} does not have size information`);
      }

      // Check if the specific size exists
      if (!product.sizes[item.size]) {
        throw new Error(`Size ${item.size} not available for product: ${product.name}`);
      }

      const currentStock = product.sizes[item.size].stock;
      console.log(`Current stock for ${item.size}: ${currentStock}`);

      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name} (Size: ${item.size}). Available: ${currentStock}, Requested: ${item.quantity}`);
      }

      // Update stock
      product.sizes[item.size].stock -= item.quantity;
      console.log(`New stock for ${item.size}: ${product.sizes[item.size].stock}`);

      // Save updated product
      await product.save();
      console.log(`Stock updated for ${product.name}, size ${item.size}`);
    }

    console.log('All stock updates completed successfully');

    // Convert to plain object and serialize ObjectIds
    const plainOrder = createdOrder.toObject ? createdOrder.toObject() : JSON.parse(JSON.stringify(createdOrder));
    
    // Manually serialize all ObjectId fields to strings
    const serializedOrder = {
      ...plainOrder,
      _id: plainOrder._id?.toString(),
      user: plainOrder.user?.toString(),
      items: plainOrder.items?.map(item => ({
        ...item,
        _id: item._id?.toString(),
        productId: item.productId?.toString()
      }))
    };
    
    console.log('Order creation process completed successfully');
    return serializedOrder;

  } catch (error) {
    console.error('Error in createOrder:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Return specific error messages for known issues
    if (error.message.includes('Insufficient stock')) {
      throw new Error(error.message);
    }
    if (error.message.includes('Product not found')) {
      throw new Error(error.message);
    }
    if (error.message.includes('Invalid size') || error.message.includes('Size not available')) {
      throw new Error(error.message);
    }
    if (error.message.includes('validation failed')) {
      throw new Error('Invalid order data. Please check your information and try again.');
    }

    throw new Error('There was an error creating your order. Please try again or contact support.');
  }
}