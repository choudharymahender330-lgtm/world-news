import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase, signIn, signUp, signInWithGoogle, resetPassword } from '../lib/supabase';
import { analytics } from '../lib/analytics';
import { checkRateLimit, rateLimits, getRateLimitError } from '../lib/rateLimit';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    const rateCheck = checkRateLimit(`login_${data.email}`, rateLimits.login);
    if (!rateCheck.allowed) {
      toast.error(getRateLimitError(rateCheck.resetTime));
      return;
    }

    setLoading(true);
    try {
      await signIn(data.email, data.password);
      analytics.signIn('email');
      toast.success('Welcome back!');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    const rateCheck = checkRateLimit(`signup_${data.email}`, rateLimits.signup);
    if (!rateCheck.allowed) {
      toast.error(getRateLimitError(rateCheck.resetTime));
      return;
    }

    setLoading(true);
    try {
      await signUp(data.email, data.password);
      analytics.signUp('email');
      toast.success('Account created! Please check your email to verify.');
      setMode('login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      analytics.signIn('google');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetFormData) => {
    const rateCheck = checkRateLimit(`reset_${data.email}`, rateLimits.passwordReset);
    if (!rateCheck.allowed) {
      toast.error(getRateLimitError(rateCheck.resetTime));
      return;
    }

    setLoading(true);
    try {
      await resetPassword(data.email);
      setResetSent(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    loginForm.reset();
    signupForm.reset();
    resetForm.reset();
    setResetSent(false);
    setShowPassword(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-white/5">
              <h2 className="text-2xl font-bold text-white">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'reset' && 'Reset Password'}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {mode === 'login' && 'Sign in to access your account'}
                {mode === 'signup' && 'Join GlobalNews for unlimited news access'}
                {mode === 'reset' && 'Enter your email to receive a reset link'}
              </p>
              <button
                onClick={() => { resetState(); onClose(); }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {mode === 'reset' ? (
                resetSent ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Check Your Email</h3>
                    <p className="text-sm text-slate-400">We've sent a password reset link to your email address.</p>
                    <button
                      onClick={() => { resetState(); setMode('login'); }}
                      className="mt-6 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                    >
                      Back to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          {...resetForm.register('email')}
                          type="email"
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      {resetForm.formState.errors.email && (
                        <p className="text-red-400 text-sm mt-1">{resetForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { resetState(); setMode('login'); }}
                      className="w-full text-slate-400 hover:text-white text-sm"
                    >
                      Back to Sign In
                    </button>
                  </form>
                )
              ) : (
                <>
                  {/* Google Sign In */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-3 bg-white text-slate-900 font-medium rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-3 mb-6"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-900 text-slate-500">or continue with email</span>
                    </div>
                  </div>

                  {/* Login Form */}
                  {mode === 'login' && (
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            {...loginForm.register('email')}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        {loginForm.formState.errors.email && (
                          <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            {...loginForm.register('password')}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {loginForm.formState.errors.password && (
                          <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-slate-400">
                          <input type="checkbox" className="rounded border-slate-600 bg-slate-700" />
                          Remember me
                        </label>
                        <button
                          type="button"
                          onClick={() => { resetState(); setMode('reset'); }}
                          className="text-sm text-indigo-400 hover:text-indigo-300"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                      </button>
                    </form>
                  )}

                  {/* Signup Form */}
                  {mode === 'signup' && (
                    <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            {...signupForm.register('name')}
                            type="text"
                            placeholder="Your name"
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        {signupForm.formState.errors.name && (
                          <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            {...signupForm.register('email')}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        {signupForm.formState.errors.email && (
                          <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            {...signupForm.register('password')}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {signupForm.formState.errors.password && (
                          <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            {...signupForm.register('confirmPassword')}
                            type="password"
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        {signupForm.formState.errors.confirmPassword && (
                          <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                      </button>
                    </form>
                  )}

                  {/* Toggle Mode */}
                  <p className="text-center text-sm text-slate-400 mt-6">
                    {mode === 'login' ? (
                      <>
                        Don't have an account?{' '}
                        <button onClick={() => { resetState(); setMode('signup'); }} className="text-indigo-400 hover:text-indigo-300 font-medium">
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button onClick={() => { resetState(); setMode('login'); }} className="text-indigo-400 hover:text-indigo-300 font-medium">
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
