import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    // Enable smooth scrolling globally
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
};

export const useScrollReveal = (ref: React.RefObject<HTMLElement>, threshold = 0.1) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        (entries || []).forEach((entry) => {
          if (entry?.isIntersecting && entry?.target) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold]);
};

export const scrollToElement = (elementId: string, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const rect = element.getBoundingClientRect();
    if (rect) {
      const elementPosition = rect.top + (window.pageYOffset || 0);
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
