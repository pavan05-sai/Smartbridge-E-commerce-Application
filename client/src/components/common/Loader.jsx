import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95">
      <div className="relative flex items-center justify-center">
        {/* Middle spinning ring */}
        <div className="h-12 w-12 rounded-full border-2 border-borderBlue border-t-accent-blue animate-spin"></div>
      </div>
      <span className="mt-4 text-xs font-medium uppercase tracking-widest text-accent-blue">
        Initializing ShopEZ...
      </span>
    </div>
  );
}
