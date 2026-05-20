import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Building2, Sparkles } from 'lucide-react';
import { PRICING_PLANS, PlanType, createCheckoutSession } from '../lib/stripe';
import { analytics } from '../lib/analytics';
import toast from 'react-hot-toast';

export default function PricingSection() {
  const [loading, setLoading] = useState<PlanType | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = async (plan: PlanType) => {
    if (plan === 'free') {
      toast.success('You are on the Free plan!');
      return;
    }

    setLoading(plan);
    try {
      const priceId = PRICING_PLANS[plan].priceId;
      if (priceId) {
        const { url } = await createCheckoutSession(priceId);
        analytics.subscriptionStarted(plan, PRICING_PLANS[plan].price);
        window.location.href = url;
      }
    } catch (error) {
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const getPrice = (plan: PlanType) => {
    const basePrice = PRICING_PLANS[plan].price;
    if (plan === 'free') return '$0';
    if (billingPeriod === 'yearly') {
      const yearlyPrice = basePrice * 12 * 0.8; // 20% discount
      return `$${yearlyPrice.toFixed(0)}`;
    }
    return `$${basePrice}`;
  };

  const plans: PlanType[] = ['free', 'pro', 'enterprise'];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Choose Your Plan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto"
          >
            Start free and upgrade as you grow. All plans include access to news from 195 countries.
          </motion.p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                billingPeriod === 'yearly' ? 'bg-indigo-500' : 'bg-slate-600'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
            <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
              Yearly
            </span>
            {billingPeriod === 'yearly' && (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const planData = PRICING_PLANS[plan];
            const isPro = plan === 'pro';
            const isEnterprise = plan === 'enterprise';

            return (
              <motion.div
                key={plan}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl border ${
                  isPro 
                    ? 'bg-gradient-to-b from-indigo-500/10 to-purple-500/10 border-indigo-500/30' 
                    : 'bg-white/5 border-white/10'
                } p-6`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-medium text-white flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {plan === 'free' && <Zap className="w-5 h-5 text-slate-400" />}
                    {isPro && <Crown className="w-5 h-5 text-indigo-400" />}
                    {isEnterprise && <Building2 className="w-5 h-5 text-purple-400" />}
                    <h3 className="text-xl font-bold text-white">{planData.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{getPrice(plan)}</span>
                    {plan !== 'free' && (
                      <span className="text-slate-400">
                        /{billingPeriod === 'yearly' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {planData.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loading !== null}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    isPro
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  } ${loading === plan ? 'opacity-50' : ''}`}
                >
                  {loading === plan ? 'Processing...' : plan === 'free' ? 'Current Plan' : 'Get Started'}
                </button>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          All plans include a 14-day money-back guarantee. No credit card required for Free plan.
        </p>
      </div>
    </section>
  );
}
