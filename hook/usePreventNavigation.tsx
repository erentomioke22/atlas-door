import { useEffect } from 'react';

const usePreventNavigation = (active: boolean) => {
  useEffect(() => {
    if (!active) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      alert("Navigation is disabled on this page.");
    };

    const handlePopState = (_event: PopStateEvent) => {
      alert("Navigation is disabled on this page.");
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [active]);
};

export default usePreventNavigation;