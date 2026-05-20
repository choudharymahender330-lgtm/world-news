// Client-side rate limiting utility

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60000, // 1 minute
};

const requests: Map<string, number[]> = new Map();

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Get existing requests for this key
  let keyRequests = requests.get(key) || [];
  
  // Filter out old requests outside the window
  keyRequests = keyRequests.filter(time => time > windowStart);
  
  // Check if under limit
  if (keyRequests.length >= config.maxRequests) {
    const oldestRequest = keyRequests[0];
    const resetTime = oldestRequest + config.windowMs;
    
    return {
      allowed: false,
      remaining: 0,
      resetTime,
    };
  }
  
  // Add new request
  keyRequests.push(now);
  requests.set(key, keyRequests);
  
  return {
    allowed: true,
    remaining: config.maxRequests - keyRequests.length,
    resetTime: now + config.windowMs,
  };
}

// Rate limit configurations for different actions
export const rateLimits = {
  login: { maxRequests: 5, windowMs: 300000 }, // 5 attempts per 5 minutes
  signup: { maxRequests: 3, windowMs: 3600000 }, // 3 attempts per hour
  passwordReset: { maxRequests: 3, windowMs: 3600000 }, // 3 attempts per hour
  apiRequest: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
  feedback: { maxRequests: 10, windowMs: 3600000 }, // 10 feedback per hour
};

export function getRateLimitError(resetTime: number): string {
  const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);
  
  if (secondsLeft < 60) {
    return `Too many requests. Please try again in ${secondsLeft} seconds.`;
  }
  
  const minutesLeft = Math.ceil(secondsLeft / 60);
  return `Too many requests. Please try again in ${minutesLeft} minutes.`;
}
