// Stripe integration for payments

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'News from 195 countries',
      '9 news categories',
      '7-day news archive',
      'Basic search',
    ],
    limitations: [
      'Limited to 20 articles per day',
      'Ads supported',
    ],
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    priceId: 'price_pro_monthly',
    features: [
      'Everything in Free',
      'Unlimited articles',
      '30-day news archive',
      'Advanced search & filters',
      'Ad-free experience',
      'Save articles',
      'Export to PDF',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 49.99,
    priceId: 'price_enterprise_monthly',
    features: [
      'Everything in Pro',
      '90-day news archive',
      'API access',
      'Priority support',
      'Custom integrations',
      'Team management',
      'Analytics dashboard',
    ],
  },
};

export type PlanType = keyof typeof PRICING_PLANS;

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(priceId: string): Promise<CheckoutSessionResponse> {
  // In production, this would call your backend
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }
  
  return response.json();
}

export async function createPortalSession(): Promise<{ url: string }> {
  // In production, this would call your backend
  const response = await fetch('/api/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to create portal session');
  }
  
  return response.json();
}

export async function upgradeSubscription(newPriceId: string): Promise<CheckoutSessionResponse> {
  const response = await fetch('/api/upgrade-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newPriceId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to upgrade subscription');
  }
  
  return response.json();
}

export async function cancelSubscription(): Promise<{ success: boolean }> {
  const response = await fetch('/api/cancel-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }
  
  return response.json();
}
