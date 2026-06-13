import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, interactive = false, onRatingChange, size = 16 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const isFilled = star <= rating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'hover:scale-110 cursor-pointer focus:outline-none' : 'cursor-default'} transition-transform`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'fill-amber-500 text-amber-500'
                  : 'text-text-secondary fill-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
