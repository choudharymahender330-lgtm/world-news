import { motion } from 'framer-motion';
import { FileText, Scale, CreditCard, AlertTriangle, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-invert max-w-none">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold m-0">Agreement to Terms</h2>
              </div>
              <p className="text-slate-300 m-0">
                By accessing or using GlobalNews, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </div>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-semibold">1. Use License</h2>
              </div>
              <div className="text-slate-300 space-y-3">
                <p>Permission is granted to temporarily use GlobalNews for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Account Terms</h2>
              <div className="text-slate-300 space-y-3">
                <ul className="list-disc list-inside space-y-1">
                  <li>You must be 13 years or older to use this service</li>
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You are responsible for all activity that occurs under your account</li>
                  <li>You must not provide false information when creating an account</li>
                  <li>You must not use the service for any illegal or unauthorized purpose</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-semibold">3. Subscription & Payments</h2>
              </div>
              <div className="text-slate-300 space-y-3">
                <p><strong>Billing Cycle:</strong> Subscriptions are billed on a monthly or yearly basis, depending on your chosen plan.</p>
                <p><strong>Auto-Renewal:</strong> Your subscription will automatically renew unless you cancel before the end of the current billing period.</p>
                <p><strong>Price Changes:</strong> We may change subscription prices with 30 days notice. Continued use after price changes constitutes acceptance.</p>
                <p><strong>Cancellations:</strong> You may cancel your subscription at any time. You will continue to have access until the end of your billing period.</p>
                <p><strong>Refunds:</strong> We offer a 14-day money-back guarantee for new subscriptions. After 14 days, refunds are provided on a case-by-case basis.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Content & Intellectual Property</h2>
              <div className="text-slate-300 space-y-3">
                <p><strong>News Content:</strong> News articles and headlines displayed on GlobalNews are the property of their respective sources. We do not claim ownership of third-party content.</p>
                <p><strong>Our Platform:</strong> The GlobalNews platform, including its design, code, and original content, is protected by copyright and other intellectual property laws.</p>
                <p><strong>User Content:</strong> By submitting feedback or other content, you grant us a non-exclusive, royalty-free license to use, modify, and display such content.</p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-semibold">5. Disclaimer</h2>
              </div>
              <div className="text-slate-300 space-y-3">
                <p>GlobalNews is provided "as is" without any warranties, expressed or implied. We do not warrant that:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>The service will be uninterrupted or error-free</li>
                  <li>The results from using the service will be accurate or reliable</li>
                  <li>The quality of any products, services, or information will meet your expectations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Limitations</h2>
              <p className="text-slate-300">
                In no event shall GlobalNews or its suppliers be liable for any damages arising out of the use or inability to use the service, even if GlobalNews has been notified of the possibility of such damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Links to Third Parties</h2>
              <p className="text-slate-300">
                GlobalNews may contain links to third-party websites. These links are provided for convenience only. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Modifications</h2>
              <p className="text-slate-300">
                We may revise these Terms of Service at any time without notice. By using this website, you agree to be bound by the current version of these Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Governing Law</h2>
              <p className="text-slate-300">
                These Terms of Service are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-semibold m-0">Questions?</h2>
              </div>
              <p className="text-slate-300 mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="text-slate-300 space-y-1">
                <li>Email: <a href="mailto:legal@globalnews.app" className="text-indigo-400 hover:underline">legal@globalnews.app</a></li>
                <li>Address: GlobalNews Inc., 123 News Street, San Francisco, CA 94102</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
