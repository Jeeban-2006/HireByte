import { useCallback } from 'react';

export function useSmoothScroll() {
  const scrollToElement = useCallback((elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return { scrollToElement, scrollToTop };
}