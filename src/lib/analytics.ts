// Analytics tracking utility

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (...args: any[]) => void;
  }
}

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

// Track page views
export function trackPageView(path: string, title?: string) {
  // Google Analytics
  if (window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
      page_title: title,
    });
  }

  // Plausible
  if (window.plausible) {
    window.plausible('pageview', { props: { path } });
  }

  // Console for development
  console.log('[Analytics] Page View:', path, title);
}

// Track custom events
export function trackEvent(eventName: string, properties?: EventProperties) {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }

  // Plausible
  if (window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // Console for development
  console.log('[Analytics] Event:', eventName, properties);
}

// Predefined events for the news app
export const analytics = {
  // News events
  newsViewed: (country: string, category: string) => 
    trackEvent('news_viewed', { country, category }),
  
  countrySelected: (country: string) => 
    trackEvent('country_selected', { country }),
  
  categorySelected: (category: string) => 
    trackEvent('category_selected', { category }),
  
  dateSelected: (date: string) => 
    trackEvent('date_selected', { date }),
  
  articleClicked: (articleTitle: string, source: string) => 
    trackEvent('article_clicked', { article_title: articleTitle, source }),
  
  searchPerformed: (query: string, resultsCount: number) => 
    trackEvent('search_performed', { query, results_count: resultsCount }),

  // Auth events
  signUp: (method: 'email' | 'google') => 
    trackEvent('sign_up', { method }),
  
  signIn: (method: 'email' | 'google') => 
    trackEvent('sign_in', { method }),
  
  signOut: () => 
    trackEvent('sign_out'),

  // Payment events
  subscriptionStarted: (tier: string, price: number) => 
    trackEvent('subscription_started', { tier, price }),
  
  subscriptionUpgraded: (fromTier: string, toTier: string) => 
    trackEvent('subscription_upgraded', { from_tier: fromTier, to_tier: toTier }),
  
  subscriptionCanceled: (tier: string) => 
    trackEvent('subscription_canceled', { tier }),

  // Engagement events
  cookieConsentGiven: (preferences: string[]) => 
    trackEvent('cookie_consent_given', { preferences: preferences.join(',') }),
  
  feedbackSubmitted: (type: 'bug' | 'feature' | 'general' | 'contact') => 
    trackEvent('feedback_submitted', { type }),
};
