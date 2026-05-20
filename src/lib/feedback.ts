// Feedback and contact form utilities

export interface FeedbackData {
  type: 'bug' | 'feature' | 'general' | 'contact';
  name: string;
  email: string;
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
  page?: string;
  userAgent?: string;
  timestamp?: string;
}

export async function submitFeedback(data: FeedbackData): Promise<{ success: boolean; message: string }> {
  // In production, this would send to your backend/email service
  // Options: SendGrid, Resend, Formspree, or your own API
  
  const feedbackData = {
    ...data,
    timestamp: new Date().toISOString(),
    page: window.location.href,
    userAgent: navigator.userAgent,
  };

  // Simulate API call
  console.log('[Feedback] Submitting:', feedbackData);
  
  // Example: Send to your backend
  // const response = await fetch('/api/feedback', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(feedbackData),
  // });
  
  // For demo, we'll simulate success
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    message: 'Thank you for your feedback! We will get back to you soon.',
  };
}

export const SUPPORT_EMAIL = 'support@globalnews.app';
export const CONTACT_EMAIL = 'contact@globalnews.app';
export const PRIVACY_EMAIL = 'privacy@globalnews.app';
