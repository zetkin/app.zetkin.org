import { MouseEvent, useRef } from 'react';

// Close will be called after a delay, which is cancelled if open is called
// Useful to toggle poppers without closing the instant the cursor is outside the triggering element
// Open will wait for a 'minHoverDuration' before interpretting it as intentional
export default function useToggleDebounce(
  open: (ev: MouseEvent<HTMLElement>) => void,
  close: (ev: MouseEvent<HTMLElement>) => void,
  delay = 50,
  minHoverDuration = 100
) {
  const targetRef = useRef<HTMLElement | null>();
  const timeoutId = useRef<number | undefined>();
  const hoverStartTime = useRef<number | null>();

  function openDebounced(ev: MouseEvent<HTMLElement>) {
    clearTimeout(timeoutId.current);

    // We capture the currentTarget, otherwise React won't accept the delayed event
    targetRef.current = ev.currentTarget;

    // Capture start-point of hovering to evaluate if the user has hovered > minHoverDuration
    hoverStartTime.current = Date.now();

    window.setTimeout(() => {
      if (hoverStartTime.current && Date.now() - hoverStartTime.current > minHoverDuration) {
        hoverStartTime.current = null;
        open({
          ...ev,
          currentTarget: targetRef.current,
        } as MouseEvent<HTMLElement>);
      }
    }, minHoverDuration);
  }

  function closeDebounced(ev: MouseEvent<HTMLElement>) {
    hoverStartTime.current = null;
    timeoutId.current = window.setTimeout(() => {
      close(ev);
    }, delay);
  }
  return { close: closeDebounced, open: openDebounced };
}
