# 🚀 GlobalNews - Complete Source Code

## Quick Start

### Option 1: Download from GitHub
1. Create a new repository on GitHub
2. Upload all files maintaining the folder structure
3. Deploy to Vercel/Netlify

### Option 2: Deploy Directly to Vercel
1. Go to vercel.com
2. Click "New Project"
3. Import from GitHub or upload files
4. Add environment variables
5. Deploy!

---

## 📁 File Structure

Create these files in your project:

```
globalnews/
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── components/
│   │   ├── AuthModal.tsx
│   │   ├── CategoryPills.tsx
│   │   ├── CookieConsent.tsx
│   │   ├── CountrySelect.tsx
│   │   ├── DatePicker.tsx
│   │   ├── DateTimeline.tsx
│   │   ├── FeedbackModal.tsx
│   │   ├── HeroSection.tsx
│   │   ├── NewsCard.tsx
│   │   ├── PricingSection.tsx
│   │   └── UserMenu.tsx
│   ├── data/
│   │   ├── categories.ts
│   │   └── countries.ts
│   ├── lib/
│   │   ├── analytics.ts
│   │   ├── feedback.ts
│   │   ├── newsApi.ts
│   │   ├── rateLimit.ts
│   │   ├── stripe.ts
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── PrivacyPolicy.tsx
│   │   └── TermsOfService.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 🔑 Environment Variables (Optional)

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

The app works WITHOUT these - it will show demo content and limited features.

---

## 📦 Install & Run

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

---

All source code files are available in the CODE_EXPORT folder in this workspace.
