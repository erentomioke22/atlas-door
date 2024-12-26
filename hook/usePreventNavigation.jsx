import { useEffect } from 'react';

const usePreventNavigation = (active) => {
  useEffect(() => {
    if (!active) return;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // For older browsers
      alert("Navigation is disabled on this page.");
    };

    const handlePopState = (event) => {
      event.preventDefault();
      alert("Navigation is disabled on this page.");
      window.history.pushState(null, null, window.location.href); // Re-push the current state
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
