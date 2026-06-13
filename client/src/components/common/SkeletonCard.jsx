import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="card-glass border border-borderBlue/50 rounded-xl overflow-hidden p-4 space-y-4">
      {/* Image Block */}
      <div className="h-48 w-full rounded-lg skeleton-pulse"></div>

      {/* Category & Title */}
      <div className="space-y-2">
        <div className="h-3 w-1/4 rounded skeleton-pulse"></div>
        <div className="h-5 w-3/4 rounded skeleton-pulse"></div>
      </div>

      {/* Stars & Details */}
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 w-1/3 rounded skeleton-pulse"></div>
        <div className="h-4 w-1/4 rounded skeleton-pulse"></div>
      </div>

      {/* Button */}
      <div className="h-10 w-full rounded-lg skeleton-pulse pt-2"></div>
    </div>
  );
}
