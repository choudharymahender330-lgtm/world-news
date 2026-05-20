import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bug, Lightbulb, MessageCircle, Send, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitFeedback, FeedbackData } from '../lib/feedback';
import { analytics } from '../lib/analytics';
import { checkRateLimit, rateLimits, getRateLimitError } from '../lib/rateLimit';
import toast from 'react-hot-toast';

const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'general', 'contact']),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'bug' | 'feature' | 'general' | 'contact';
}

const typeOptions = [
  { value: 'bug', label: 'Bug Report', icon: Bug, color: 'red' },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'yellow' },
  { value: 'general', label: 'General Feedback', icon: MessageCircle, color: 'blue' },
  { value: 'contact', label: 'Contact Support', icon: Send, color: 'green' },
] as const;

export default function FeedbackModal({ isOpen, onClose, initialType = 'general' }: FeedbackModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: initialType,
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: FeedbackFormData) => {
    const rateCheck = checkRateLimit('feedback', rateLimits.feedback);
    if (!rateCheck.allowed) {
      toast.error(getRateLimitError(rateCheck.resetTime));
      return;
    }

    setLoading(true);
    try {
      await submitFeedback(data as FeedbackData);
      analytics.feedbackSubmitted(data.type);
      setSubmitted(true);
      toast.success('Feedback submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Send Feedback</h2>
              <p className="text-sm text-slate-400 mt-1">
                We'd love to hear from you. Help us improve GlobalNews.
              </p>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Thank You!</h3>
                  <p className="text-sm text-slate-400 mb-6">
                    Your feedback has been submitted successfully. We'll review it and get back to you if needed.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {typeOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedType === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              const input = document.querySelector(`input[value="${option.value}"]`) as HTMLInputElement;
                              if (input) input.click();
                            }}
                            className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                              isSelected
                                ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${
                              option.color === 'red' ? 'text-red-400' :
                              option.color === 'yellow' ? 'text-yellow-400' :
                              option.color === 'blue' ? 'text-blue-400' :
                              'text-green-400'
                            }`} />
                            <span className="text-sm font-medium">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <input type="hidden" {...register('type')} />
                    {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>}
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                      <input
                        {...register('name')}
                        type="text"
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                    <input
                      {...register('subject')}
                      type="text"
                      placeholder="Brief description"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                    <textarea
                      {...register('message')}
                      rows={4}
                      placeholder="Describe your feedback in detail..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                    {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
