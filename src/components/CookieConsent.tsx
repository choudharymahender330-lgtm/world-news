import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';
import { useCookies } from 'react-cookie';
import { analytics } from '../lib/analytics';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export default function CookieConsent() {
  const [cookies, setCookie] = useCookies(['cookieConsent']);
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Show banner if no consent cookie exists
    if (!cookies.cookieConsent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, [cookies.cookieConsent]);

  const savePreferences = (prefs: CookiePreferences) => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    setCookie('cookieConsent', JSON.stringify(prefs), {
      path: '/',
      expires: expiryDate,
    });
    
    // Track consent
    const enabledPreferences = Object.entries(prefs)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => key);
    analytics.cookieConsentGiven(enabledPreferences);
    
    setIsVisible(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    savePreferences(allAccepted);
  };

  const rejectNonEssential = () => {
    savePreferences(defaultPreferences);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Always enabled
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {!showSettings ? (
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-xl">
                    <Cookie className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      We value your privacy
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                      By clicking "Accept All", you consent to our use of cookies. 
                      <button 
                        onClick={() => setShowSettings(true)}
                        className="text-indigo-400 hover:text-indigo-300 ml-1"
                      >
                        Customize preferences
                      </button>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={acceptAll}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Accept All
                      </button>
                      <button
                        onClick={rejectNonEssential}
                        className="px-5 py-2.5 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Necessary Only
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-5 py-2.5 text-slate-400 text-sm font-medium hover:text-white transition-colors"
                      >
                        Settings
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={rejectNonEssential}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Cookie Settings
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Necessary */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Necessary</h4>
                      <p className="text-sm text-slate-400">Essential for the website to function. Cannot be disabled.</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-500 rounded-full flex items-center justify-end px-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Analytics</h4>
                      <p className="text-sm text-slate-400">Help us understand how visitors interact with our website.</p>
                    </div>
                    <button
                      onClick={() => togglePreference('analytics')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.analytics ? 'bg-indigo-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${
                        preferences.analytics ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Marketing</h4>
                      <p className="text-sm text-slate-400">Used to deliver relevant ads and track campaign performance.</p>
                    </div>
                    <button
                      onClick={() => togglePreference('marketing')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.marketing ? 'bg-indigo-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${
                        preferences.marketing ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Functional */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Functional</h4>
                      <p className="text-sm text-slate-400">Remember your preferences and provide enhanced features.</p>
                    </div>
                    <button
                      onClick={() => togglePreference('functional')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.functional ? 'bg-indigo-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${
                        preferences.functional ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveCustomPreferences}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-5 py-2.5 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
