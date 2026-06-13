import React from 'react';
import StarRating from './StarRating';

export default function ReviewCard({ review }) {
  // Format Date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card-glass p-5 rounded-xl space-y-3 shadow-md border border-borderBlue/30 hover:border-borderBlue/60 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <img
            src={review.user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(review.user?.name || 'anonymous')}`}
            alt={review.user?.name || 'User'}
            className="h-9 w-9 rounded-full border border-borderBlue/50 bg-surface object-cover"
          />
          <div>
            <h4 className="text-sm font-semibold text-text-primary">
              {review.user?.name || 'Anonymous Buyer'}
            </h4>
            <span className="text-[10px] font-accent text-text-secondary">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        {/* Rating */}
        <StarRating rating={review.rating} size={14} />
      </div>

      {/* Review Text */}
      <p className="text-sm text-text-secondary leading-relaxed pl-12">
        {review.comment}
      </p>
    </div>
  );
}
