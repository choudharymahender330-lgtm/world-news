import { motion } from 'framer-motion';
import { Shield, Cookie, Database, Lock, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-invert max-w-none">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold m-0">Your Privacy Matters</h2>
              </div>
              <p className="text-slate-300 m-0">
                At GlobalNews, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
              </p>
            </div>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-semibold">1. Information We Collect</h2>
              </div>
              <div className="text-slate-300 space-y-3">
                <p><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</p>
                <p><strong>Usage Data:</strong> We collect information about how you use our service, including pages viewed, features used, and time spent on the platform.</p>
                <p><strong>Device Information:</strong> We collect information about the device and browser you use to access our service.</p>
                <p><strong>News Preferences:</strong> We store your country and category preferences to personalize your experience.</p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
              </div>
              <ul className="text-slate-300 space-y-2 list-disc list-inside">
                <li>To provide and maintain our service</li>
                <li>To personalize your news experience</li>
                <li>To communicate with you about your account</li>
                <li>To send relevant updates and newsletters (with your consent)</li>
                <li>To analyze usage patterns and improve our service</li>
                <li>To detect and prevent fraud or abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-semibold">3. Cookies and Tracking</h2>
              </div>
              <div className="text-slate-300 space-y-3">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Essential Cookies:</strong> Required for the website to function (authentication, security)</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with your consent)</li>
                </ul>
                <p>You can manage your cookie preferences through our cookie consent banner or your browser settings.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Data Sharing</h2>
              <div className="text-slate-300 space-y-3">
                <p>We do not sell your personal information. We may share your data with:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Service providers who assist in operating our platform</li>
                  <li>Payment processors for subscription transactions</li>
                  <li>Analytics providers to improve our service</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-slate-300">
                We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Your Rights (GDPR)</h2>
              <div className="text-slate-300 space-y-3">
                <p>Under GDPR and similar regulations, you have the right to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your data (right to be forgotten)</li>
                  <li>Export your data in a portable format</li>
                  <li>Object to processing of your data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Children's Privacy</h2>
              <p className="text-slate-300">
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Changes to This Policy</h2>
              <p className="text-slate-300">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-semibold m-0">Contact Us</h2>
              </div>
              <p className="text-slate-300 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="text-slate-300 space-y-1">
                <li>Email: <a href="mailto:privacy@globalnews.app" className="text-indigo-400 hover:underline">privacy@globalnews.app</a></li>
                <li>Address: GlobalNews Inc., 123 News Street, San Francisco, CA 94102</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
