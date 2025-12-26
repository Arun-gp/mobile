import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: String,  // Changed from ObjectId to String for Firestore compatibility
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Add index for faster queries
reviewSchema.index({ productId: 1, date: -1 });

// Calculate average rating for a product
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { productId: productId }  // Match string productId directly
    },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  return result[0] || { averageRating: 0, totalReviews: 0 };
};

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
