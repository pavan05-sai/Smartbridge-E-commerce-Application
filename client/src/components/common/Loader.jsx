import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background-primary/80 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        {/* Glow outer ring */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-accent-blue/30 duration-1000"></div>
        {/* Middle spinning ring */}
        <div className="h-12 w-12 rounded-full border-2 border-borderBlue border-t-accent-electric animate-spin"></div>
      </div>
      <span className="mt-4 text-xs font-accent uppercase tracking-widest text-accent-electric animate-pulse">
        Initializing ShopEZ...
      </span>
    </div>
  );
}
