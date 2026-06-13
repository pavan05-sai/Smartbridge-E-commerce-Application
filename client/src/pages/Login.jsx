import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../redux/slices/authSlice';
import { showToast } from '../components/common/Toast';
import { KeyRound, Mail, ShieldAlert, Chrome } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { loading, error, isAuthenticated, userInfo } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirect = searchParams.get('redirect') || '/';
  const sessionExpired = searchParams.get('expired');

  // Trigger error or session expiration notifications
  useEffect(() => {
    if (sessionExpired) {
      showToast('Session expired, please login again', 'warning');
    }
    dispatch(clearAuthError());
  }, [dispatch, sessionExpired]);

  // Route user on successful login
  useEffect(() => {
    if (isAuthenticated && userInfo) {
      showToast(`Welcome back, ${userInfo.name}!`);
      if (userInfo.role === 'seller' && redirect === '/') {
        navigate('/dashboard');
      } else {
        navigate(redirect);
      }
    }
  }, [isAuthenticated, userInfo, navigate, redirect]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-[85vh] bg-background-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Glow Blur in Background */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-accent-blue/10 blur-[90px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      {/* Main card */}
      <div className="w-full max-w-md card-glass border border-borderBlue rounded-2xl p-8 shadow-glow-electric relative z-10 text-left space-y-6">
        
        {/* Title details */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-extrabold font-heading text-text-primary">Welcome Back</h2>
          <p className="text-xs text-text-secondary">Enter credentials to unlock your ShopEZ dashboard</p>
        </div>

        {/* Display Auth Errors */}
        {error && (
          <div className="p-3 rounded-lg bg-error/15 border border-error/30 text-error text-xs flex items-center gap-2">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
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
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Social Placeholder Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-borderBlue/35"></div>
          <span className="flex-shrink mx-4 text-text-secondary text-[10px] uppercase font-accent font-bold">Or continue with</span>
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

        {/* Register router redirection link */}
        <p className="text-center text-xs text-text-secondary">
          Don't have an account yet?{' '}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-accent-electric hover:text-accent-bright font-semibold hover:underline">
            Register Here
          </Link>
        </p>

      </div>
    </div>
  );
}
