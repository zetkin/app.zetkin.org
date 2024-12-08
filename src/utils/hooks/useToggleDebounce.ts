import { MouseEvent, useRef } from 'react';

// Close will be called after a delay, which is cancelled if open is called
// Useful to toggle poppers without closing the instant the cursor is outside the triggering element
export default function useToggleDebounce(
  open: (ev: MouseEvent<HTMLElement>) => void,
  close: (ev: MouseEvent<HTMLElement>) => void,
  delay = 250
) {
  const timeoutId = useRef<number | undefined>();
  function openDebounced(ev: MouseEvent<HTMLElement>) {
    clearTimeout(timeoutId.current);
    open(ev);
  }

  function closeDebounced(ev: MouseEvent<HTMLElement>) {
    timeoutId.current = window.setTimeout(() => {
      close(ev);
    }, delay);
  }
  return { close: closeDebounced, open: openDebounced };
}
