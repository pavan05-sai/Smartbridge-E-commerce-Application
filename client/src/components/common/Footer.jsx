import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d1117] border-t border-borderBlue mt-auto">
      {/* Decorative Gradient Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-accent-blue to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div className="md:col-span-1 space-y-4">
          <Link to="/" className="text-2xl font-bold tracking-tight text-gradient">
            ShopEZ<span className="text-accent-electric">.</span>
          </Link>
          <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
            Shop smarter, live better. Our carefully curated platform connects buyers with certified sellers in a modern, dark-themed space.
          </p>
          <div className="flex gap-4 text-text-secondary">
            <a href="#" className="hover:text-accent-electric transition-colors">
              <Github className="h-4.5 w-4.5" />
            </a>
            <a href="#" className="hover:text-accent-electric transition-colors">
              <Twitter className="h-4.5 w-4.5" />
            </a>
            <a href="#" className="hover:text-accent-electric transition-colors">
              <Instagram className="h-4.5 w-4.5" />
            </a>
            <a href="#" className="hover:text-accent-electric transition-colors">
              <Globe className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {/* Links Column 1: Shop */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider font-heading">
            Shop
          </h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>
              <Link to="/products" className="hover:text-accent-electric transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/products?category=Electronics" className="hover:text-accent-electric transition-colors">
                Electronics
              </Link>
            </li>
            <li>
              <Link to="/products?category=Fashion" className="hover:text-accent-electric transition-colors">
                Fashion
              </Link>
            </li>
            <li>
              <Link to="/products?category=Home" className="hover:text-accent-electric transition-colors">
                Home Decor
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Column 2: Platform */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider font-heading">
            Platform
          </h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>
              <Link to="/login" className="hover:text-accent-electric transition-colors">
                Sell on ShopEZ
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-accent-electric transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-accent-electric transition-colors">
                Terms of Use
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-accent-electric transition-colors">
                Security
              </a>
            </li>
          </ul>
        </div>

        {/* Links Column 3: Tech Spec info / JetBrains Mono styling */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider font-heading">
            System Specs
          </h4>
          <div className="font-accent text-xs space-y-2 text-text-secondary bg-surface/50 border border-borderBlue/50 p-4 rounded-lg">
            <div>VERSION: v1.0.0-stable</div>
            <div>STATUS: ONLINE</div>
            <div>STRIKE-FORCE: ACTIVE</div>
            <div>CORE: REACT / MERN</div>
          </div>
        </div>

      </div>

      {/* Sub Footer */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-borderBlue/30 flex flex-col md:flex-row items-center justify-between text-xs text-text-secondary gap-4">
        <p>© {new Date().getFullYear()} ShopEZ Inc. All rights reserved.</p>
        <p className="font-accent">DESIGNED BY HUMAN FOR THE FUTURE</p>
      </div>
    </footer>
  );
}
