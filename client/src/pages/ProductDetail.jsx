import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, clearProductDetails, submitReview } from '../redux/slices/productSlice';
import { addToCart, getFinalPrice } from '../redux/slices/cartSlice';
import { showToast } from '../components/common/Toast';
import ImageGallery from '../components/product/ImageGallery';
import StarRating from '../components/product/StarRating';
import ReviewCard from '../components/product/ReviewCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { ShoppingCart, ShieldCheck, Truck, RefreshCw, Send, User } from 'lucide-react';

const TABS = ['Description', 'Reviews', 'Shipping'];

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, reviews, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('Description');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReviewState, setSubmittingReviewState] = useState(false);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  if (loading && !currentProduct) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <p className="text-text-secondary text-sm">Fetching product details...</p>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center space-y-4">
        <h3 className="text-xl font-bold font-heading text-error">Product Not Found</h3>
        <p className="text-text-secondary text-sm">The product does not exist or has been deleted by the seller.</p>
        <Link to="/products" className="inline-block px-4 py-2 bg-accent-blue text-white rounded-lg text-sm">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const finalPrice = getFinalPrice(currentProduct.price, currentProduct.discount);
  const hasDiscount = currentProduct.discount > 0;
  const isOutOfStock = currentProduct.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('Product is out of stock', 'warning');
      return;
    }
    dispatch(addToCart({ product: currentProduct, quantity: 1 }));
    showToast(`Added "${currentProduct.title}" to cart`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please enter a comment', 'warning');
      return;
    }

    try {
      setSubmittingReviewState(true);
      await dispatch(
        submitReview({
          productId: currentProduct._id,
          rating: reviewRating,
          comment: reviewComment,
        })
      ).unwrap();
      
      showToast('Review submitted successfully');
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      showToast(err || 'Failed to submit review. You can only review once.', 'error');
    } finally {
      setSubmittingReviewState(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary px-4 sm:px-6 md:px-8 py-12 max-w-7xl mx-auto space-y-12">
      
      {/* 1. Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Image Gallery (col-span-6) */}
        <div className="lg:col-span-6">
          <ImageGallery images={currentProduct.images} />
        </div>

        {/* Right Column: Info Details (col-span-6) */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          {/* Category & Stock Badges */}
          <div className="flex justify-between items-center gap-4">
            <span className="text-xs font-accent text-text-secondary uppercase tracking-widest">
              {currentProduct.category}
            </span>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-accent font-bold uppercase border ${
              isOutOfStock 
                ? 'bg-error/10 border-error/30 text-error' 
                : 'bg-success/10 border-success/30 text-success'
            }`}>
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </span>
          </div>

          {/* Product Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary leading-tight">
            {currentProduct.title}
          </h1>

          {/* Star rating row */}
          <div className="flex items-center gap-3">
            <StarRating rating={currentProduct.ratings} size={15} />
            <span className="text-xs font-accent text-text-secondary">
              {currentProduct.ratings.toFixed(1)} / 5.0 ({currentProduct.numReviews} Reviews)
            </span>
          </div>

          {/* Price Layout */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-3xl font-accent font-bold text-gradient">
              ₹{finalPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm font-accent text-text-secondary line-through">
                  ₹{currentProduct.price.toFixed(2)}
                </span>
                <span className="text-xs font-accent text-success bg-success/15 border border-success/30 px-2 py-0.5 rounded-full font-bold uppercase">
                  Save {currentProduct.discount}%
                </span>
              </>
            )}
          </div>

          {/* Short description preview */}
          <p className="text-sm text-text-secondary leading-relaxed border-t border-borderBlue/20 pt-4">
            {currentProduct.description}
          </p>

          {/* Seller information chip */}
          <div className="flex items-center gap-2 p-3 bg-surface/50 border border-borderBlue/50 rounded-xl max-w-sm">
            <div className="p-2 rounded-lg bg-borderBlue/30 text-accent-electric">
              <User size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-accent">Listed by seller</span>
              <span className="text-sm font-semibold text-text-primary">{currentProduct.seller?.name || 'Authorized Seller'}</span>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full flex items-center justify-center gap-2 py-4 bg-accent-blue hover:bg-accent-bright disabled:bg-borderBlue/50 text-white font-semibold rounded-xl text-sm transition-all hover:shadow-glow btn-press disabled:opacity-50 disabled:cursor-not-allowed font-heading"
          >
            <ShoppingCart size={18} />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

      </div>

      {/* 2. Below Tabbed Section (Description | Reviews | Shipping) */}
      <div className="border-t border-borderBlue/30 pt-10 text-left">
        
        {/* Tab triggers */}
        <div className="flex gap-6 border-b border-borderBlue/20 pb-2 mb-6">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-heading font-medium tracking-wide transition-all relative ${
                  isActive ? 'text-accent-electric font-bold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-accent-electric"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="space-y-4">
          
          {/* Tab 1: Description */}
          {activeTab === 'Description' && (
            <div className="text-sm text-text-secondary leading-relaxed max-w-3xl space-y-3">
              <p>{currentProduct.description}</p>
              <p>Certified products sold on ShopEZ. All items are rigorously checked by sellers to match specifications and dimensions described. Contact support for dispute claims.</p>
            </div>
          )}

          {/* Tab 2: Reviews */}
          {activeTab === 'Reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Reviews List (col-span-7) */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-base font-bold font-heading text-text-primary">
                  Customer Ratings ({reviews.length})
                </h3>
                
                {reviews.length === 0 ? (
                  <p className="text-xs text-text-secondary">No reviews submitted for this product yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <ReviewCard key={rev._id} review={rev} />
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Review Form (col-span-5) */}
              <div className="lg:col-span-5">
                {isAuthenticated ? (
                  userInfo.role === 'buyer' ? (
                    <div className="card-glass border border-borderBlue rounded-xl p-5 space-y-4">
                      <h4 className="text-sm font-bold font-heading text-text-primary">Write a Review</h4>
                      
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        {/* Interactive Stars selector */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                            Rating *
                          </label>
                          <StarRating
                            rating={reviewRating}
                            interactive={true}
                            onRatingChange={setReviewRating}
                            size={20}
                          />
                        </div>

                        {/* Comment text */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                            Comment *
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your experience using this product..."
                            className="bg-background-primary border border-borderBlue rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-bright focus:shadow-glow transition-all"
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          disabled={submittingReviewState}
                          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-accent-blue hover:bg-accent-bright disabled:bg-borderBlue/50 text-white font-medium rounded-lg text-xs transition-all hover:shadow-glow btn-press"
                        >
                          {submittingReviewState ? 'Submitting...' : 'Submit Review'}
                          <Send size={12} />
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="card-glass rounded-xl p-4 text-center border border-borderBlue/30 text-xs text-text-secondary">
                      Sellers cannot submit reviews for products.
                    </div>
                  )
                ) : (
                  <div className="card-glass rounded-xl p-4 text-center border border-borderBlue/30 text-xs text-text-secondary">
                    Please{' '}
                    <Link to="/login" className="text-accent-electric font-semibold hover:underline">
                      login
                    </Link>{' '}
                    to leave a customer review.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Tab 3: Shipping */}
          {activeTab === 'Shipping' && (
            <div className="text-sm text-text-secondary leading-relaxed max-w-3xl space-y-4">
              <div className="flex gap-3 items-start">
                <Truck className="h-5 w-5 text-accent-electric flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-text-primary">Global Shipping Coverage</h4>
                  <p className="text-xs mt-1">We deliver to major continents. Packages are dispatched from regional fulfillment centers corresponding to seller addresses.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <RefreshCw className="h-5 w-5 text-accent-electric flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-text-primary">Easy Returns & Exchanges</h4>
                  <p className="text-xs mt-1">Accept returns within 14 days of delivery. Customer support handles refunds if item condition does not match seller descriptions.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
