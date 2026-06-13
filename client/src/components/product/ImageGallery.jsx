import React, { useState } from 'react';

export default function ImageGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
  const displayImages = images.length > 0 ? images : [fallbackImage];
  const activeImage = displayImages[activeIndex];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    const img = e.currentTarget.querySelector('img');
    if (img) {
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = 'scale(1.5)';
    }
  };

  const handleMouseLeave = (e) => {
    const img = e.currentTarget.querySelector('img');
    if (img) {
      img.style.transform = 'scale(1)';
      img.style.transformOrigin = 'center center';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Zoomable Image Frame */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-square w-full rounded-xl overflow-hidden bg-surface border border-borderBlue cursor-zoom-in"
      >
        <img
          src={activeImage}
          alt="Product Main Preview"
          className="w-full h-full object-cover transition-transform duration-200 ease-out origin-center"
        />
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-borderBlue">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                idx === activeIndex
                  ? 'border-accent-electric shadow-glow'
                  : 'border-borderBlue hover:border-accent-blue/60'
              }`}
            >
              <img
                src={img}
                alt={`Product thumbnail preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
