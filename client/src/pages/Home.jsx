import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, Landmark, ArrowRight, ShieldCheck, Zap, Percent } from 'lucide-react';
import { fetchProducts, setFilter } from '../redux/slices/productSlice';
import ProductGrid from '../components/product/ProductGrid';
import SkeletonCard from '../components/common/SkeletonCard';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    // Fetch latest products for the home page (first 4 items)
    dispatch(fetchProducts({ page: 1, limit: 4, sort: 'newest', category: 'All', search: '' }));
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    dispatch(setFilter({ category }));
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-background-primary bg-grid-pattern relative pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center overflow-hidden">
        
        {/* Left Side Hero Details (Asymmetric grid width) */}
        <div className="lg:col-span-7 space-y-6 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-borderBlue bg-surface/50 backdrop-blur-sm"
          >
            <Zap size={13} className="text-accent-electric animate-pulse" />
            <span className="text-[10px] font-accent font-bold uppercase tracking-widest text-accent-electric">
              The Future of Shopping is Here
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] font-heading"
          >
            Shop Smarter.<br />
            <span className="text-gradient">Live Better.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-text-secondary max-w-lg leading-relaxed"
          >
            Explore a premium digital marketplace. Handcrafted layouts, lighting fast checkouts, and certified sellers. Experience the difference.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link
              to="/products"
              className="flex items-center gap-2 px-6 py-3 bg-accent-blue hover:bg-accent-bright text-white font-medium rounded-lg text-sm transition-all hover:shadow-glow btn-press font-heading"
            >
              Shop Now
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login?role=seller"
              className="flex items-center gap-2 px-6 py-3 border border-borderBlue bg-surface/30 hover:bg-borderBlue/20 text-text-primary font-medium rounded-lg text-sm transition-all btn-press font-heading"
            >
              Sell on ShopEZ
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Rotated Mockup Cards (Asymmetric positioning) */}
        <div className="lg:col-span-5 relative flex justify-center items-center h-[350px] lg:h-[450px]">
          {/* Decorative glowing gradient blur in background */}
          <div className="absolute w-[250px] h-[250px] rounded-full bg-accent-blue/15 blur-[80px]"></div>

          {/* Floating mockup 1 (Rotated -6 degrees) */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 0 }}
            animate={{ opacity: 1, x: 0, rotate: -6 }}
            transition={{ type: 'spring', stiffness: 60, delay: 0.3 }}
            className="absolute left-6 top-12 w-56 card-glass border border-borderBlue/80 rounded-xl overflow-hidden p-3 shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-surface">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"
                alt="Shoe Mockup"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 space-y-1">
              <div className="text-[9px] font-accent text-text-secondary uppercase tracking-wider">ATHLETICS</div>
              <div className="text-sm font-semibold text-text-primary truncate">AeroSprint Runner</div>
              <div className="text-xs font-accent font-bold text-accent-electric">₹9,999.00</div>
            </div>
          </motion.div>

          {/* Floating mockup 2 (Rotated 8 degrees) */}
          <motion.div
            initial={{ opacity: 0, x: 80, rotate: 0 }}
            animate={{ opacity: 1, x: 20, rotate: 8 }}
            transition={{ type: 'spring', stiffness: 50, delay: 0.5 }}
            className="absolute right-4 bottom-8 w-52 card-glass border border-borderBlue/60 rounded-xl overflow-hidden p-3 shadow-2xl hover:scale-105 transition-transform duration-300 z-10"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-surface">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
                alt="Watch Mockup"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 space-y-1">
              <div className="text-[9px] font-accent text-text-secondary uppercase tracking-wider">GADGETS</div>
              <div className="text-sm font-semibold text-text-primary truncate">Minimalist Timepiece</div>
              <div className="text-xs font-accent font-bold text-accent-electric">₹15,499.00</div>
            </div>
          </motion.div>
        </div>

      </section>

      {/* 2. Categories Scroll Strip */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 overflow-x-auto py-3 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-medium border border-borderBlue bg-surface/50 hover:border-accent-bright hover:text-accent-electric hover:shadow-glow transition-all duration-200 cursor-pointer font-heading"
            >
              {cat === 'All' ? 'Browse All' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="flex items-baseline justify-between border-b border-borderBlue/30 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-heading text-text-primary relative inline-block">
              Trending Now
              <span className="absolute bottom-[-17px] left-0 h-[2px] w-16 bg-accent-blue"></span>
            </h2>
            <p className="text-xs text-text-secondary">Explore products curated for this season</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-accent-electric hover:text-accent-bright transition-colors flex items-center gap-1 font-accent"
          >
            VIEW ALL <ArrowRight size={12} />
          </Link>
        </div>

        {/* Loaders / Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <ProductGrid products={products.slice(0, 4)} />
        )}
      </section>

      {/* 4. Asymmetric Discount Banner */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="relative rounded-2xl overflow-hidden bg-[#0d1117] border border-borderBlue shadow-2xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 min-h-[240px]">
          {/* Asymmetric Diagonal Stripe background */}
          <div className="absolute inset-y-0 right-0 left-1/3 bg-gradient-to-r from-transparent via-accent-blue/5 to-accent-blue/10 transform skew-x-12 pointer-events-none"></div>

          <div className="space-y-3 max-w-md relative z-10 text-left">
            <div className="flex items-center gap-2 text-accent-electric">
              <Percent size={18} className="animate-bounce" />
              <span className="text-xs font-accent font-bold tracking-widest uppercase">Seasonal Special</span>
            </div>
            <h3 className="text-3xl font-extrabold font-heading text-text-primary">
              Upgrade Your Setup. <span className="text-accent-electric">Up to 50% OFF</span>
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Explore deep discounts on devices, home accessories, and wearables. Discount is automatically applied at checkout.
            </p>
          </div>

          <div className="relative z-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent-blue hover:bg-accent-bright text-white font-semibold rounded-lg text-sm shadow-lg hover:shadow-glow transition-all btn-press font-heading"
            >
              Get the Deals
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
