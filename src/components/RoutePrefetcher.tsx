
import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// List of common routes to prefetch
const commonRoutes = [
  '/dashboard',
  '/community',
  '/courses',
  '/trade-journal',
  '/calendar',
  '/profile',
  '/my-subscription'
];

const RoutePrefetcher: React.FC = () => {
  const location = useLocation();
  
  // Memoize prefetchRoutes to avoid recreating on each render
  const prefetchRoutes = useCallback(() => {
    // Get routes that aren't the current route
    const routesToPrefetch = commonRoutes.filter(route => route !== location.pathname);
    
    // Prefetch the modules for these routes
    routesToPrefetch.forEach(route => {
      try {
        const routeWithoutSlash = route.substring(1);
        const toPascalCase = (str: string) =>
          str
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
        const manualMap: Record<string, string> = {
          '/my-subscription': 'MySubscriptionPage'
        };
        const moduleName = manualMap[route] ?? toPascalCase(routeWithoutSlash);
        
        // Dynamic import to trigger preload
        import(`../pages/${moduleName}.tsx`).catch(() => {
          // Ignore errors - this is just prefetching
          console.debug(`Failed to prefetch ${moduleName}`);
        });
      } catch (e) {
        // Ignore errors in prefetch
      }
    });
  }, [location.pathname]);
  
  useEffect(() => {
    // Only prefetch after initial load is complete
    if (location.pathname === '/') return;
    
    // Wait until idle to prefetch with a small delay
    setTimeout(() => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => prefetchRoutes());
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(() => prefetchRoutes(), 200);
      }
    }, 300);
  }, [location.pathname, prefetchRoutes]);
  
  return null;
};

export default RoutePrefetcher;
