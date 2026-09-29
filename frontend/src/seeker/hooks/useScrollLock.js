import { useLayoutEffect, useId } from 'react';

const activeLocks = new Set();
let previousBodyOverflow = '';
let previousHtmlOverflow = '';

export default function useScrollLock(active) {
  const lockId = useId();

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;

    if (active) {
      if (activeLocks.size === 0) {
        previousBodyOverflow = document.body.style.overflow;
        previousHtmlOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      }
      activeLocks.add(lockId);
    } else {
      activeLocks.delete(lockId);
      if (activeLocks.size === 0) {
        document.body.style.overflow = previousBodyOverflow || '';
        document.documentElement.style.overflow = previousHtmlOverflow || '';
      }
    }

    return () => {
      activeLocks.delete(lockId);
      if (activeLocks.size === 0) {
        document.body.style.overflow = previousBodyOverflow || '';
        document.documentElement.style.overflow = previousHtmlOverflow || '';
      }
    };
  }, [active, lockId]);
}


