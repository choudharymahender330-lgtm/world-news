import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Search, RefreshCw, Calendar, Archive, Zap, Wifi, WifiOff, Menu, X, MessageCircle, Shield, FileText, CreditCard, LogIn, UserPlus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

import CountrySelect from './components/CountrySelect';
import CategoryPills from './components/CategoryPills';
import NewsCard from './components/NewsCard';
import HeroSection from './components/HeroSection';
import DatePicker from './components/DatePicker';
import DateTimeline from './components/DateTimeline';
import CookieConsent from './components/CookieConsent';
import AuthModal from './components/AuthModal';
import PricingSection from './components/PricingSection';
import FeedbackModal from './components/FeedbackModal';
import UserMenu from './components/UserMenu';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

import { countries, Country } from './data/countries';
import { categories, Category } from './data/categories';
import { NewsArticle, fetchNews } from './lib/newsApi';
import { getCurrentUser, supabase } from './lib/supabase';
import { trackPageView, analytics } from './lib/analytics';

function NewsApp() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRealNews, setIsRealNews] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const location = useLocation();

  useEffect(() => {
    loadUser();
    loadNews();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    loadNews();
  }, [selectedCountry, selectedCategory, selectedDate]);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const loadNews = async () => {
    setLoading(true);
    try {
      const isToday = selectedDate.toDateString() === new Date().toDateString();
      const articles = await fetchNews(
        selectedCountry.code, 
        selectedCategory.id,
        isToday ? undefined : selectedDate
      );
      setNews(articles);
      setIsRealNews(articles.some(a => a.url && a.url !== '#'));
      analytics.newsViewed(selectedCountry.code, selectedCategory.id);
    } catch (err) {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    analytics.dateSelected(date.toISOString().split('T')[0]);
  };

  const filteredNews = news.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 30);

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
      
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Newspaper className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    GlobalNews
                  </span>
                  <div className="flex items-center gap-1">
                    {isRealNews ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <Wifi className="w-3 h-3" />
                        LIVE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400">
                        <WifiOff className="w-3 h-3" />
                        DEMO
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
                <button onClick={() => setShowPricing(true)} className="text-slate-400 hover:text-white transition-colors">Pricing</button>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms</Link>
              </nav>

              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 w-32"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadNews}
                  className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>

                <button
                  onClick={() => setFeedbackModalOpen(true)}
                  className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  title="Send Feedback"
                >
                  <MessageCircle className="w-4 h-4 text-slate-400" />
                </button>

                {user ? (
                  <UserMenu 
                    onOpenSettings={() => setShowPricing(true)} 
                    onOpenPricing={() => setShowPricing(true)} 
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                      className="px-4 py-2 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                    <button
                      onClick={() => { setAuthMode('signup'); setAuthModalOpen(true); }}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-white/5 overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 w-full"
                    />
                  </div>
                  <Link to="/" className="block text-slate-300 hover:text-white">Home</Link>
                  <button onClick={() => { setShowPricing(true); setMobileMenuOpen(false); }} className="block text-slate-300 hover:text-white w-full text-left">Pricing</button>
                  <Link to="/privacy" className="block text-slate-300 hover:text-white">Privacy</Link>
                  <Link to="/terms" className="block text-slate-300 hover:text-white">Terms</Link>
                  <button onClick={() => { setFeedbackModalOpen(true); setMobileMenuOpen(false); }} className="block text-slate-300 hover:text-white w-full text-left">Feedback</button>
                  {!user && (
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => { setAuthMode('login'); setAuthModalOpen(true); setMobileMenuOpen(false); }}
                        className="flex-1 py-2 bg-white/10 text-white rounded-lg"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => { setAuthMode('signup'); setAuthModalOpen(true); setMobileMenuOpen(false); }}
                        className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Live News Banner */}
          {isRealNews && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                </div>
                <div>
                  <p className="text-emerald-300 font-medium">Live News Feed Active</p>
                  <p className="text-emerald-400/70 text-sm">Fetching real-time news from RSS feeds worldwide</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Date Timeline */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Quick Select Date
              </h3>
              <div className="flex items-center gap-2">
                {isToday ? (
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-medium rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Latest News
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full flex items-center gap-1">
                    <Archive className="w-3 h-3" />
                    Archive View
                  </span>
                )}
              </div>
            </div>
            <DateTimeline 
              selectedDate={selectedDate} 
              onDateSelect={handleDateChange}
              daysToShow={10}
            />
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                Select Country (195)
              </label>
              <CountrySelect
                countries={countries}
                selectedCountry={selectedCountry}
                onSelect={(country) => {
                  setSelectedCountry(country);
                  analytics.countrySelected(country.code);
                }}
              />
            </motion.div>

            <motion.div 
              className="lg:w-72"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Select Date
              </label>
              <DatePicker
                selectedDate={selectedDate}
                onDateSelect={handleDateChange}
                minDate={minDate}
                maxDate={new Date()}
              />
            </motion.div>

            <motion.div 
              className="lg:w-72"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                <Archive className="w-4 h-4" />
                Category
              </label>
              <div className="px-4 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                <span className="text-lg font-semibold text-white">{selectedCategory.name}</span>
                <p className="text-xs text-slate-400 mt-1">{selectedCategory.description}</p>
              </div>
            </motion.div>
          </div>

          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CategoryPills
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={(cat) => {
                setSelectedCategory(cat);
                analytics.categorySelected(cat.id);
              }}
            />
          </motion.div>

          {/* News Grid */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {isToday ? (
                  <>
                    <Zap className="w-5 h-5 text-indigo-400" />
                    Latest from {selectedCountry.name}
                  </>
                ) : (
                  <>
                    <Archive className="w-5 h-5 text-purple-400" />
                    News from {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </>
                )}
              </h2>
              <span className="text-sm text-slate-400">{filteredNews.length} articles</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                      <div className="h-48 bg-white/10" />
                      <div className="p-5 space-y-3">
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/10 rounded w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                key={`${selectedCountry.code}-${selectedCategory.id}-${selectedDate.toISOString()}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredNews.map((article, index) => (
                  <NewsCard key={`${article.url}-${index}`} article={article} index={index} />
                ))}
              </motion.div>
            )}

            {!loading && filteredNews.length === 0 && (
              <div className="text-center py-16">
                <Newspaper className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">No news found</h3>
                <p className="text-slate-500">Try selecting a different date, country or category</p>
              </div>
            )}
          </div>
        </main>

        {/* Pricing Section */}
        {showPricing && (
          <div className="fixed inset-0 z-50 bg-slate-950 overflow-auto">
            <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 p-4">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Subscription Plans</h2>
                <button onClick={() => setShowPricing(false)} className="p-2 text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <PricingSection />
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-white/5 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Newspaper className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-white">GlobalNews</span>
                </div>
                <p className="text-sm text-slate-400">
                  Your window to the world's headlines. News from 195 countries, updated in real-time.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><button onClick={() => setShowPricing(true)} className="hover:text-white">Pricing</button></li>
                  <li><Link to="/" className="hover:text-white">Features</Link></li>
                  <li><Link to="/" className="hover:text-white">Countries</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link to="/privacy" className="hover:text-white flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-white flex items-center gap-2"><FileText className="w-4 h-4" /> Terms of Service</Link></li>
                  <li><button onClick={() => setFeedbackModalOpen(true)} className="hover:text-white flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Contact Us</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><button onClick={() => setFeedbackModalOpen(true)} className="hover:text-white">Report a Bug</button></li>
                  <li><button onClick={() => setFeedbackModalOpen(true)} className="hover:text-white">Request Feature</button></li>
                  <li><a href="mailto:support@globalnews.app" className="hover:text-white">support@globalnews.app</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/5 pt-8 text-center">
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} GlobalNews. All rights reserved.
              </p>
              <p className="text-slate-600 text-xs mt-2">
                Browse news from 195 countries • Live RSS feeds • PWA Ready
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <CookieConsent />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />
      <FeedbackModal isOpen={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewsApp />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
      <CookieConsent />
    </Router>
  );
}
