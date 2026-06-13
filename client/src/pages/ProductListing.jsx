import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilter, resetFilters, setPage } from '../redux/slices/productSlice';
import ProductGrid from '../components/product/ProductGrid';
import SkeletonCard from '../components/common/SkeletonCard';
import { Filter, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

export default function ProductListing() {
  const dispatch = useDispatch();
  const { products, filters, pagination, loading } = useSelector((state) => state.products);

  const [sliderMaxPrice, setSliderMaxPrice] = useState(filters.maxPrice || 50000);

  // Sync products fetch whenever filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  // Handle category selection
  const handleCategoryChange = (cat) => {
    dispatch(setFilter({ category: cat }));
  };

  // Handle sorting dropdown change
  const handleSortChange = (e) => {
    dispatch(setFilter({ sort: e.target.value }));
  };

  // Handle price slider slide
  const handleSliderChange = (e) => {
    setSliderMaxPrice(e.target.value);
  };

  // Handle mouse release on price slider to trigger search (prevents redundant fetches while sliding)
  const handleSliderRelease = () => {
    dispatch(setFilter({ maxPrice: sliderMaxPrice }));
  };

  // Handle resetting filters
  const handleReset = () => {
    setSliderMaxPrice(50000);
    dispatch(resetFilters());
  };

  // Handle pagination pages
  const handlePageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > pagination.pages) return;
    dispatch(setPage(pageNum));
  };

  return (
    <div className="min-h-screen bg-background-primary px-4 sm:px-6 md:px-8 py-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Sidebar Filters (col-span-3) */}
        <aside className="lg:col-span-3 bg-surface border border-borderBlue rounded-xl p-6 space-y-6 lg:sticky lg:top-24 shadow-lg">
          <div className="flex justify-between items-center pb-4 border-b border-borderBlue/30">
            <span className="flex items-center gap-2 font-bold font-heading text-sm text-text-primary">
              <Filter size={16} className="text-accent-electric" />
              Filter Tools
            </span>
            <button
              onClick={handleReset}
              className="text-[10px] font-accent text-text-secondary hover:text-accent-bright flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={10} /> RESET
            </button>
          </div>

          {/* Category List checkboxes/radios */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Category
            </h4>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-3 text-sm cursor-pointer select-none group">
                  <input
                    type="radio"
                    name="category-filter"
                    checked={filters.category === cat}
                    onChange={() => handleCategoryChange(cat)}
                    className="h-4 w-4 bg-background-primary border-borderBlue text-accent-blue focus:ring-accent-blue focus:ring-opacity-50"
                  />
                  <span className={`transition-colors duration-150 ${
                    filters.category === cat ? 'text-accent-electric font-semibold' : 'text-text-secondary group-hover:text-text-primary'
                  }`}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
              <span className="text-text-secondary">Max Price</span>
              <span className="text-accent-electric font-accent">₹{sliderMaxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={sliderMaxPrice}
              onChange={handleSliderChange}
              onMouseUp={handleSliderRelease}
              onTouchEnd={handleSliderRelease}
              className="w-full h-1 bg-borderBlue rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-secondary font-accent">
              <span>₹0</span>
              <span>₹50000</span>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Product Listings Grid (col-span-9) */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Top Bar Header */}
          <div className="flex justify-between items-center gap-4 flex-wrap border-b border-borderBlue/20 pb-4 bg-background-primary">
            <div className="text-xs font-accent text-text-secondary">
              {loading ? (
                <span>Filtering catalogs...</span>
              ) : (
                <span>Showing {products.length} of {pagination.totalProducts} products</span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary font-medium">Sort by:</span>
              <select
                value={filters.sort}
                onChange={handleSortChange}
                className="bg-surface border border-borderBlue rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-bright transition-all cursor-pointer font-accent"
              >
                <option value="newest">Newest Arrival</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="ratings">Avg Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Main Grid display */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <ProductGrid products={products} />
          )}

          {/* Pagination Controls */}
          {!loading && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8 border-t border-borderBlue/20 font-accent text-sm">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-borderBlue rounded-lg bg-surface text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  onClick={() => handlePageChange(pNum)}
                  className={`h-9 w-9 border rounded-lg font-semibold transition-all ${
                    pagination.page === pNum
                      ? 'bg-accent-blue border-accent-blue text-white shadow-glow'
                      : 'border-borderBlue bg-surface text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {pNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 border border-borderBlue rounded-lg bg-surface text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
