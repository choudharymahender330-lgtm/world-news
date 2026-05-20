# GlobalNews - World News App

A beautiful, full-featured news application with real-time news from 195 countries worldwide.

## Features

- **195 Countries** - News from every country in the world
- **Real-time RSS Feeds** - Live news from major sources
- **9 Categories** - General, World, Business, Tech, Sports, etc.
- **Date Archives** - Browse news from past 30 days
- **PWA Ready** - Install on any device
- **Full SaaS Features**:
  - User authentication (Email + Google OAuth)
  - Subscription plans (Free, Pro, Enterprise)
  - Privacy Policy & Terms of Service
  - Cookie consent (GDPR compliant)
  - Analytics tracking
  - Feedback system
  - Rate limiting

## Tech Stack

- **React 19** + TypeScript
- **Vite** for blazing fast builds
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Supabase** for auth & database
- **Stripe** for payments

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/globalnews.git
cd globalnews
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Supabase (Auth & Database)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (Payments) - Optional
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

# News APIs - Optional (for more news sources)
VITE_GNEWS_API_KEY=your_gnews_api_key
VITE_CURRENTS_API_KEY=your_currents_api_key
VITE_NEWS_API_KEY=your_newsapi_key
```

### 4. Run development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Add environment variables
7. Deploy!

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthModal.tsx
│   ├── CategoryPills.tsx
│   ├── CookieConsent.tsx
│   ├── CountrySelect.tsx
│   ├── DatePicker.tsx
│   ├── DateTimeline.tsx
│   ├── FeedbackModal.tsx
│   ├── HeroSection.tsx
│   ├── NewsCard.tsx
│   ├── PricingSection.tsx
│   └── UserMenu.tsx
├── data/               # Static data
│   ├── categories.ts
│   └── countries.ts
├── lib/                # Utilities & integrations
│   ├── analytics.ts
│   ├── feedback.ts
│   ├── newsApi.ts
│   ├── rateLimit.ts
│   ├── stripe.ts
│   └── supabase.ts
├── pages/              # Page components
│   ├── PrivacyPolicy.tsx
│   └── TermsOfService.tsx
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Setting Up Services

### Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Settings > API and copy your URL and anon key
3. Enable Google OAuth in Authentication > Providers (optional)
4. Create a `users` table for subscription data (optional)

### Stripe Setup

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your publishable key from Developers > API Keys
3. Create products and prices in the Products section
4. Update price IDs in `src/lib/stripe.ts`

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For support, email support@globalnews.app or open an issue on GitHub.
