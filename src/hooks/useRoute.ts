import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  path: string;
  isCustomerView: boolean;
  customerId: number | null;
}

export function useRoute() {
  const parsePath = useCallback((): RouteState => {
    const path = window.location.pathname;
    const match = path.match(/^\/customer\/(\d+)\/?$/);
    if (match) {
      return {
        path,
        isCustomerView: true,
        customerId: parseInt(match[1], 10),
      };
    }
    return {
      path,
      isCustomerView: false,
      customerId: null,
    };
  }, []);

  const [route, setRoute] = useState<RouteState>(parsePath);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parsePath]);

  const navigate = useCallback((toPath: string) => {
    window.history.pushState({}, '', toPath);
    // Dispatch a custom event to notify listeners
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  return { ...route, navigate };
}
