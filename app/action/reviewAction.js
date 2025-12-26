'use server';

import dbconnect from '@/db/dbconnect';
import Review from '@/model/ReviewModel';

export async function fetchProductReviews(productId) {
  try {
    await dbconnect();
    
    const reviews = await Review.find({ productId })
      .sort({ date: -1 })
      .limit(50);
      
    const { averageRating, totalReviews } = await Review.calculateAverageRating(productId);

    // Convert to plain objects and handle date formatting
    const serializedReviews = reviews.map(review => ({
      id: review._id.toString(),
      rating: review.rating,
      review: review.review,
      date: review.date.toISOString(),
    }));

    return {
      reviews: serializedReviews,
      averageRating,
      totalReviews
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
}

export async function createReview(productId, rating, review) {
  try {
    await dbconnect();
    
    const newReview = await Review.create({
      productId,
      rating,
      review
    });

    return {
      id: newReview._id.toString(),
      rating: newReview.rating,
      review: newReview.review,
      date: newReview.date.toISOString()
    };
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
}