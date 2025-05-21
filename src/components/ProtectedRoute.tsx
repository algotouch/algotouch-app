
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Spinner } from '@/components/ui/spinner';
import { useUnifiedRegistrationData } from '@/hooks/useUnifiedRegistrationData';
import { useSubscriptionContext } from '@/contexts/subscription/SubscriptionContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  publicPaths?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  publicPaths = ['/auth']
}) => {
  const { 
    isAuthenticated, 
    loading, 
    initialized
  } = useAuth();
  
  const {
    pendingSubscription,
    isRegistering
  } = useUnifiedRegistrationData();

  let hasActiveSubscription = false;
  let isCheckingSubscription = false;
  try {
    const subscription = useSubscriptionContext();
    hasActiveSubscription = subscription.hasActiveSubscription;
    isCheckingSubscription = subscription.isCheckingSubscription;
  } catch {
    // Context not available outside provider
  }
  
  const location = useLocation();
  
  // Show consistent loader while auth or subscription is initializing
  if (!initialized || loading || isCheckingSubscription) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Allow access to public paths regardless of auth status
  if (isPublicPath(location.pathname, publicPaths)) {
    return <>{children}</>;
  }

  // Special case for subscription page - allow access if:
  // 1. User is authenticated OR
  // 2. User is in registration process (pendingSubscription flag is true)
  if (isSubscriptionPath(location.pathname)) {
    if (isAuthenticated || pendingSubscription || isRegistering) {
      console.log("ProtectedRoute: Allowing access to subscription path", {
        isAuthenticated,
        pendingSubscription,
        isRegistering
      });
      return <>{children}</>;
    }
    console.log("ProtectedRoute: User is not authenticated for subscription, redirecting to auth");
    return <Navigate to="/auth" state={{ from: location, redirectToSubscription: true }} replace />;
  }

  // Standard auth checks with subscription requirement
  if (requireAuth && (!isAuthenticated || !hasActiveSubscription)) {
    console.log("ProtectedRoute: User lacks subscription, redirecting to subscription page", {
      isAuthenticated,
      hasActiveSubscription
    });
    return <Navigate to="/subscription" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    console.log("ProtectedRoute: User is already authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Helper functions to improve readability
function isPublicPath(path: string, publicPaths: string[]): boolean {
  return publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  );
}

function isSubscriptionPath(path: string): boolean {
  return path === '/subscription' || path.startsWith('/subscription/');
}

export default ProtectedRoute;
