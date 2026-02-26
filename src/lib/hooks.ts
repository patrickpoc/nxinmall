'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to handle scroll reveal animations using [data-animate] attribute.
 * It adds 'is-visible' class when elements enter the viewport.
 */
export function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-animate]'));
    let ticking = false;

    const update = () => {
      const trigger = window.innerHeight * 0.85;
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < trigger && rect.bottom > 0;
        if (inView) {
          el.classList.add('is-visible');
        } else {
          el.classList.remove('is-visible');
        }
      });
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
  }, []);
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
