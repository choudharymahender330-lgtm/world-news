import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, CreditCard, LogOut, Crown, ChevronDown } from 'lucide-react';
import { supabase, signOut, getCurrentUser } from '../lib/supabase';
import { PRICING_PLANS } from '../lib/stripe';
import toast from 'react-hot-toast';

interface UserMenuProps {
  onOpenSettings: () => void;
  onOpenPricing: () => void;
}

export default function UserMenu({ onOpenSettings, onOpenPricing }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<'free' | 'pro' | 'enterprise'>('free');

  useEffect(() => {
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    // In production, fetch subscription from your database
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (!user) return null;

  const planInfo = PRICING_PLANS[subscription];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden md:block text-sm text-white truncate max-w-[120px]">
          {user.email}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="p-4 border-b border-white/5">
              <p className="font-medium text-white truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  subscription === 'free' 
                    ? 'bg-slate-500/20 text-slate-300' 
                    : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {subscription === 'free' ? 'Free Plan' : (
                    <span className="flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      {planInfo.name}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => { setIsOpen(false); onOpenSettings(); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={() => { setIsOpen(false); onOpenPricing(); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Manage Subscription
              </button>
            </div>

            {/* Sign Out */}
            <div className="p-2 border-t border-white/5">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
