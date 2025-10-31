import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  // Only initialize Sentry if DSN is provided and valid
  if (!dsn || dsn === 'your_sentry_dsn' || dsn.trim() === '') {
    console.log('Sentry DSN not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    // Capture Console
    beforeSend(event) {
      // Filter out non-critical errors in development
      if (import.meta.env.DEV) {
        // Don't send console.error in development
        if (event.level === 'error' && event.logger === 'console') {
          return null;
        }
      }
      return event;
    },
    // Additional options
    debug: import.meta.env.DEV,
    initialScope: {
      tags: {
        component: 'magalu-spotify2',
      },
    },
  });
};

/**
 * Set user context for Sentry
 */
export const setSentryUser = (user: {
  id: string;
  email?: string;
  username?: string;
}) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
};

/**
 * Clear user context from Sentry
 */
export const clearSentryUser = () => {
  Sentry.setUser(null);
};

/**
 * Add breadcrumb for debugging
 */
export const addSentryBreadcrumb = (
  message: string,
  category: string = 'custom',
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, unknown>
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
};

/**
 * Capture exception manually
 */
export const captureException = (
  error: Error,
  context?: Record<string, unknown>
) => {
  Sentry.withScope(scope => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureException(error);
  });
};

/**
 * Capture message manually
 */
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, unknown>
) => {
  Sentry.withScope(scope => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureMessage(message, level);
  });
};

/**
 * Start a span for performance monitoring
 */
export const startSpan = (name: string, op: string = 'navigation') => {
  return Sentry.startSpan(
    {
      name,
      op,
    },
    () => {
      // Span implementation
    }
  );
};

/**
 * Sentry Error Boundary component
 */
export const SentryErrorBoundary = Sentry.withErrorBoundary;
