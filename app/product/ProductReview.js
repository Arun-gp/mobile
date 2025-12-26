"use client"
import React, { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import { toast } from "react-toastify";

const ProductReview = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = async () => {
    try {
      if (!productId) {
        console.warn("loadReviews: No productId provided");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Reviews API Error:", data.error, data.details);
        setReviews([]);
        setAverageRating(0);
        setTotalReviews(0);
        return;
      }

      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch (error) {
      console.error("Error loading reviews:", error);
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredValue) => {
    setHoveredRating(hoveredValue);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);

    try {
      const userName = localStorage.getItem('userName') || 'Anonymous';

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          review: reviewText,
          userName
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit review');
      }

      toast.success("Review submitted successfully!");
      setRating(0);
      setReviewText('');
      await loadReviews();
    } catch (error) {
      toast.error("Failed to submit review");
      console.error("Review submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full text-center py-8">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Average Rating Display */}
      <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-6">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`h-6 w-6 ${value <= Math.round(averageRating)
                ? 'fill-[#048567] text-[#048567]'
                : 'text-gray-200'
                }`}
            />
          ))}
        </div>
        <div>
          <span className="text-2xl font-black text-gray-900">{averageRating.toFixed(1)}</span>
          <span className="text-gray-400 text-sm ml-2 font-bold uppercase tracking-tight">
            ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>

      {/* Write a Review */}
      <div className="space-y-6">
        <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">Write a Review</h4>

        {/* Star Rating Input */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              className="focus:outline-none transition-transform hover:scale-110"
              onClick={() => handleRatingClick(value)}
              onMouseEnter={() => handleRatingHover(value)}
              onMouseLeave={() => handleRatingHover(0)}
            >
              <Star
                className={`h-8 w-8 transition-colors ${value <= (hoveredRating || rating)
                  ? 'fill-[#048567] text-[#048567]'
                  : 'text-gray-200 hover:text-gray-300'
                  }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-3 text-sm font-bold text-[#048567] uppercase">
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
            </span>
          )}
        </div>

        {/* Review Text Input */}
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your thoughts about this product..."
          className="w-full min-h-[120px] px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#048567] transition-all font-medium placeholder-gray-300 resize-none"
          maxLength={1000}
        />

        <button
          onClick={handleSubmitReview}
          disabled={isSubmitting}
          className="bg-[#048567] hover:bg-[#036e56] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-3 transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </div>

      {/* Display Reviews */}
      <div className="space-y-6">
        <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">
          All Reviews ({totalReviews})
        </h4>
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl">
            <p className="text-gray-400 font-medium">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${index < review.rating
                          ? 'fill-[#048567] text-[#048567]'
                          : 'text-gray-200'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 font-bold uppercase">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed">{review.review}</p>
                {review.userName && (
                  <p className="text-xs text-gray-400 mt-3 font-bold uppercase tracking-wider">
                    — {review.userName}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReview;