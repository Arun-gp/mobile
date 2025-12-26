import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number,required:true },  // No longer required at the root level
    discountPercentage: { type: Number, default: 0 },
    image: { type: [String], default: [] },
    category: { type: String, required: true },
    stock: { type: Number },  // No longer required at the root level
    sizes: {
      XS: {
        stock: { type: Number, default: 0, required: true },
        price: { type: Number, required: true },
      },
      S: {
        stock: { type: Number, default: 0, required: true },
        price: { type: Number, required: true },
      },
      M: {
        stock: { type: Number, default: 0, required: true },
        price: { type: Number, required: true },
      },
      L: {
        stock: { type: Number, default: 0, required: true },
        price: { type: Number, required: true },
      },
      XL: {
        stock: { type: Number, default: 0, required: true },
        price: { type: Number, required: true },
      },
      XXL: {
        stock: { type: Number, default: 0, required: true },
        price: { type: Number, required: true },
      },
    },
     details: {
      material: { type: String },
  },
},
  
  { timestamps: true }
);

// Model for Product
const Product = mongoose.models.ProductMa || mongoose.model('ProductMa', productSchema);

export default Product;
