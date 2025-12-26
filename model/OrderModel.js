import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  size: {
    type: String,
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }
});

const orderSchema = new mongoose.Schema(
  { 
    totalPrice: {
      type: Number,
      required: true
    },
    itemsPrice: {
      type: Number,
      required: true
    },
    shippingPrice: {
      type: Number,
      required: true
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    shippingInfo: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      country: { type: String, required: true }
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Orderjob || mongoose.model('Orderjob', orderSchema);

export default Order;