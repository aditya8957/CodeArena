import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser, googleLogin } from '../authSlice';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [floatingBubbles, setFloatingBubbles] = useState([]);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    setMounted(true);
    
    // Generate floating bubbles only on client side
    const bubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 8,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 20,
      opacity: Math.random() * 0.15 + 0.05
    }));
    setFloatingBubbles(bubbles);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Google login success handler
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google User Info:", decoded);
      dispatch(googleLogin(credentialResponse.credential));
    } catch (error) {
      console.error("JWT Decode Failed:", error);
    }
  };

  // Google login failure
  const handleGoogleFailure = () => {
    console.error("Google Signup Failed");
  };

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background - Only render on client */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Bubbles */}
          {floatingBubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="absolute rounded-full border border-white/10 bg-white/5"
              style={{
                width: bubble.size,
                height: bubble.size,
                left: `${bubble.left}%`,
                top: '-50px',
                opacity: bubble.opacity
              }}
              animate={{
                y: [0, window.innerHeight + 100],
                x: [0, Math.sin(bubble.id) * 30]
              }}
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, #fff 1px, transparent 1px),
                linear-gradient(to bottom, #fff 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}></div>
          </div>

          {/* Glowing Orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Header with Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 pb-4 text-center border-b border-gray-800"
          >
            <motion.div 
              className="inline-flex items-center justify-center mb-3"
              animate={{ 
                scale: [1, 1.03, 1],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-xl font-bold text-white">&lt;&gt;</span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              CodeArena
            </motion.h1>
            <motion.p 
              className="text-gray-400 mt-1 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Join the coding revolution
            </motion.p>
          </motion.div>

          <div className="p-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-red-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* First Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-4"
              >
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <input
                    type="text"
                    placeholder="John"
                    className={`relative w-full px-3 py-2.5 bg-gray-900/50 border ${
                      errors.firstName ? 'border-red-500/50' : 'border-gray-700'
                    } rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-all`}
                    {...register('firstName')}
                  />
                </div>
                {errors.firstName && (
                  <motion.span 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.firstName.message}
                  </motion.span>
                )}
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-4"
              >
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className={`relative w-full px-3 py-2.5 bg-gray-900/50 border ${
                      errors.emailId ? 'border-red-500/50' : 'border-gray-700'
                    } rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-all`}
                    {...register('emailId')}
                  />
                </div>
                {errors.emailId && (
                  <motion.span 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.emailId.message}
                  </motion.span>
                )}
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-2"
              >
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`relative w-full px-3 py-2.5 bg-gray-900/50 border ${
                      errors.password ? 'border-red-500/50' : 'border-gray-700'
                    } rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-all pr-10`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.span 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.password.message}
                  </motion.span>
                )}
              </motion.div>

              {/* Password Requirements */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-4"
              >
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    At least 8 characters
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-6"
              >
                <button
                  type="submit"
                  className={`relative w-full py-2.5 px-4 rounded-lg text-white font-medium overflow-hidden transition-all ${
                    loading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-md hover:shadow-indigo-500/20'
                  }`}
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span className="text-sm">Create Account</span>
                      </>
                    )}
                  </div>
                </button>
              </motion.div>
            </form>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 pt-4 border-t border-gray-800 text-center"
            >
              <p className="text-gray-400 text-xs">
                Already have an account?{' '}
                <NavLink 
                  to="/login" 
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors group inline-flex items-center gap-1"
                >
                  Sign in
                  <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </NavLink>
              </p>
            </motion.div>

            {/* Terms and Conditions
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-4 text-center"
            >
              <p className="text-xs text-gray-500">
                By signing up, you agree to our{' '}
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                {' '}and{' '}
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              </p>
            </motion.div> */}

            {/* Google Signup Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-gray-900 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              {/* Google Signup Button */}
              <div className="mt-3 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;