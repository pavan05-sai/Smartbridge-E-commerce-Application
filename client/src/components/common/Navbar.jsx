import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Search, LogOut, Menu, X, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { setFilter } from '../../redux/slices/productSlice';
import { showToast } from './Toast';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilter({ search: searchTerm }));
    navigate('/products');
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    showToast('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-borderBlue px-4 py-3 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-gradient">
            ShopEZ<span className="text-accent-electric">.</span>
          </span>
        </Link>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background-primary border border-borderBlue rounded-lg px-4 py-2 pl-10 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-bright focus:ring-1 focus:ring-accent-bright focus:shadow-glow transition-all"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
        </form>

        {/* Right Side: Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-text-secondary hover:text-accent-electric font-medium transition-colors text-sm">
            Shop
          </Link>
          
          {/* Cart Icon with badge */}
          <Link to="/cart" className="relative p-2 text-text-secondary hover:text-accent-electric transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {totalCartQuantity > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-blue text-[10px] font-bold text-white shadow-md">
                {totalCartQuantity}
              </span>
            )}
          </Link>

          {/* User Options / Login */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 focus:outline-none"
              >
                <img
                  src={userInfo.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar'}
                  alt="avatar"
                  className="h-8 w-8 rounded-full border border-borderBlue object-cover"
                />
                <span className="text-sm font-medium text-text-primary max-w-[100px] truncate">
                  {userInfo.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-borderBlue bg-surface shadow-xl py-1 z-50 card-glass">
                  {userInfo.role === 'seller' ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-borderBlue/30 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-accent-electric" />
                      Seller Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/orders"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-borderBlue/30 transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4 text-accent-electric" />
                      My Orders
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-borderBlue/30 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-md bg-accent-blue hover:bg-accent-bright font-medium text-sm text-white shadow-md hover:shadow-glow transition-all btn-press"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Control */}
        <div className="flex items-center gap-4 md:hidden">
          <Link to="/cart" className="relative p-2 text-text-secondary">
            <ShoppingCart className="h-5 w-5" />
            {totalCartQuantity > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-blue text-[9px] font-bold text-white">
                {totalCartQuantity}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-text-secondary hover:text-text-primary focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bg-surface border-b border-borderBlue py-4 px-6 flex flex-col gap-4 z-30 card-glass shadow-2xl">
          {/* Search in Mobile */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background-primary border border-borderBlue rounded-lg px-4 py-2 pl-10 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-bright"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
          </form>

          <Link
            to="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-text-primary hover:text-accent-electric text-sm font-medium py-2"
          >
            Shop All Products
          </Link>

          {isAuthenticated ? (
            <>
              {userInfo.role === 'seller' ? (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-text-primary hover:text-accent-electric text-sm font-medium py-2"
                >
                  <LayoutDashboard className="h-4 w-4 text-accent-electric" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-text-primary hover:text-accent-electric text-sm font-medium py-2"
                >
                  <ShoppingBag className="h-4 w-4 text-accent-electric" />
                  My Orders
                </Link>
              )}
              
              <div className="h-px bg-borderBlue my-1"></div>

              <div className="flex items-center gap-3 py-2">
                <img
                  src={userInfo.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar'}
                  alt="avatar"
                  className="h-8 w-8 rounded-full border border-borderBlue"
                />
                <span className="text-sm font-medium text-text-primary">{userInfo.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-error text-sm font-medium py-2 text-left"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2 rounded-md bg-accent-blue text-center font-medium text-sm text-white shadow-md btn-press"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
