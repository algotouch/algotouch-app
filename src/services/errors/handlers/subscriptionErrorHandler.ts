
import { toast } from 'sonner';
import { logError } from '../utils/errorTracking';

interface SubscriptionErrorOptions {
  showToast?: boolean;
  redirectTo?: string;
  onError?: (error: unknown) => void;
}

export interface SubscriptionErrorResult {
  success: false;
  error: unknown;
  message: string;
}

/**
 * Handles subscription errors
 */
export const handleSubscriptionError = async (
  error: unknown,
  userId?: string,
  context: string = 'subscription',
  options?: SubscriptionErrorOptions
): Promise<SubscriptionErrorResult> => {
  const showToast = options?.showToast ?? true;
  const errorMessage =
    error instanceof Error ? error.message : 'שגיאה בטיפול במנוי';
  
  // Log the error
  await logError({
    category: 'subscription',
    action: context,
    error: error instanceof Error ? error : new Error(String(error)),
    userId
  });
  
  // Show toast notification if enabled
  if (showToast) {
    toast.error(errorMessage);
  }
  
  // Redirect if specified
  if (options?.redirectTo) {
    setTimeout(() => {
      window.location.href = options.redirectTo!;
    }, 1500);
  }
  
  // Call custom error handler if provided
  if (options?.onError) {
    options.onError(error);
  }
  
  return {
    success: false,
    error,
    message: errorMessage
  };
};
