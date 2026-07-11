import { useEffect } from 'react';

/* Scroll-reveal that can never blank a page: elements start hidden only
   after we know IntersectionObserver actually works (some webviews ship
   an IO that never fires). If IO is dead or missing, .rv--now forces the
   visible state. One shared observer for the whole document. */

let alive: boolean | null = null;

export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('.rv:not(.in):not(.rv--now)')];
    if (els.length === 0) return;
    if (typeof IntersectionObserver === 'undefined' || alive === false) {
      els.forEach((el) => el.classList.add('rv--now'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        alive = true;
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '-40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    // Liveness watchdog: if IO said nothing in 500ms, reveal everything.
    const t = setTimeout(() => {
      if (alive !== true) {
        alive = false;
        document.querySelectorAll<HTMLElement>('.rv').forEach((el) => el.classList.add('rv--now'));
        io.disconnect();
      }
    }, 500);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
