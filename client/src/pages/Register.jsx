import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../redux/slices/authSlice';
import { showToast } from '../components/common/Toast';
import { KeyRound, Mail, User, ShieldAlert, Chrome } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { loading, error, isAuthenticated, userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer'); // 'buyer' or 'seller'

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Route user on successful registration
  useEffect(() => {
    if (isAuthenticated && userInfo) {
      showToast(`Welcome aboard, ${userInfo.name}!`);
      if (userInfo.role === 'seller' && redirect === '/') {
        navigate('/dashboard');
      } else {
        navigate(redirect);
      }
    }
  }, [isAuthenticated, userInfo, navigate, redirect]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    dispatch(register({ name, email, password, role }));
  };

  return (
    <div className="min-h-[85vh] bg-background-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Glow Blur in Background */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-accent-blue/10 blur-[90px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      {/* Main card */}
      <div className="w-full max-w-md card-glass border border-borderBlue rounded-2xl p-8 shadow-glow relative z-10 text-left space-y-5">
        
        {/* Title Details */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-extrabold font-heading text-text-primary">Create Account</h2>
          <p className="text-xs text-text-secondary">Join ShopEZ and start browsing or listing today</p>
        </div>

        {/* Display Auth Errors */}
        {error && (
          <div className="p-3 rounded-lg bg-error/15 border border-error/30 text-error text-xs flex items-center gap-2">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab switcher for Role: Buyer / Seller */}
        <div className="grid grid-cols-2 p-1 bg-background-primary border border-borderBlue rounded-xl">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2 text-xs font-semibold rounded-lg font-heading transition-all ${
              role === 'buyer'
                ? 'bg-accent-blue text-white shadow-glow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            I am a Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`py-2 text-xs font-semibold rounded-lg font-heading transition-all ${
              role === 'seller'
                ? 'bg-accent-blue text-white shadow-glow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            I am a Seller
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full bg-background-primary border border-borderBlue rounded-lg px-4 py-2.5 pl-10 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-bright focus:ring-1 focus:ring-accent-bright focus:shadow-glow transition-all"
              />
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-text-secondary" />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-background-primary border border-borderBlue rounded-lg px-4 py-2.5 pl-10 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-bright focus:ring-1 focus:ring-accent-bright focus:shadow-glow transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-text-secondary" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-background-primary border border-borderBlue rounded-lg px-4 py-2.5 pl-10 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-bright focus:ring-1 focus:ring-accent-bright focus:shadow-glow transition-all"
              />
              <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-text-secondary" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-blue hover:bg-accent-bright text-white font-semibold rounded-lg text-sm transition-all hover:shadow-glow btn-press font-heading"
          >
            {loading ? 'Registering Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Social Placeholder Divider */}
        <div className="relative flex py-1.5 items-center">
          <div className="flex-grow border-t border-borderBlue/35"></div>
          <span className="flex-shrink mx-4 text-text-secondary text-[10px] uppercase font-accent font-bold">Or register with</span>
          <div className="flex-grow border-t border-borderBlue/35"></div>
        </div>

        {/* Social Mock button */}
        <button
          onClick={() => showToast('Social authentication is currently disabled', 'warning')}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-borderBlue bg-surface/30 hover:bg-borderBlue/20 text-text-primary font-semibold rounded-lg text-xs transition-all btn-press"
        >
          <Chrome size={14} className="text-accent-electric" />
          Google Account
        </button>

        {/* Login redirect link */}
        <p className="text-center text-xs text-text-secondary">
          Already have an account?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-accent-electric hover:text-accent-bright font-semibold hover:underline">
            Login Here
          </Link>
        </p>

      </div>
    </div>
  );
}
