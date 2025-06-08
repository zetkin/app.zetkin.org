import { MouseEvent, useRef } from 'react';

// Close will be called after a delay, which is cancelled if open is called
// Useful to toggle poppers without closing the instant the cursor is outside the triggering element
// Open will wait for a 'minHoverDuration' before interpretting it as intentional
export default function useToggleDebounce(
  open: (ev: MouseEvent<HTMLElement>) => void,
  close: (ev: MouseEvent<HTMLElement>) => void,
  delay = 250,
  minHoverDuration = 250
) {
  const targetRef = useRef<HTMLElement | null>(null);
  const timeoutId = useRef<number | undefined>();
  let hoverStartTime = useRef<number | null>(null);

  function openDebounced(ev: MouseEvent<HTMLElement>) {
    clearTimeout(timeoutId.current);

    // We capture the currentTarget, otherwise React won't accept the delayed event
    targetRef.current = ev.currentTarget;

    // Capture start-point of hovering to evaluate if the user has hovered > minHoverDuration
    hoverStartTime = Date.now();

    window.setTimeout(() => {
      if (hoverStartTime && Date.now() - hoverStartTime > minHoverDuration) {
        hoverStartTime = null;
        open({
          ...ev,
          currentTarget: targetRef.current,
        } as MouseEvent<HTMLElement>);
      }
    }, minHoverDuration);
  }

  function closeDebounced(ev: MouseEvent<HTMLElement>) {
    hoverStartTime = null;
    timeoutId.current = window.setTimeout(() => {
      close(ev);
    }, delay);
  }
  return { close: closeDebounced, open: openDebounced };
}
