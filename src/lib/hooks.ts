'use client';

import { useEffect, useState, DependencyList } from 'react';

/**
 * Hook to handle scroll reveal animations using [data-animate] attribute.
 * Uses IntersectionObserver for better performance and reliability on mobile.
 */
export function useScrollReveal(deps: DependencyList = []) {
  useEffect(() => {
    // Small timeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll<HTMLElement>('[data-animate]');
      
      if (elements.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.01,
        rootMargin: '0px'
      });

      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, deps);
}

/**
 * Hook to handle active section detection based on scroll position.
 */
export function useActiveSection(sectionIds: string[], offset = 120) {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    let ticking = false;
    const update = () => {
      const scrollY = window.scrollY + offset;
      let current = sectionIds[0];

      sections.forEach((section) => {
        if (scrollY >= section.offsetTop) {
          current = section.id;
        }
      });

      setActiveSection(current);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sectionIds, offset]);

  return activeSection;
}
