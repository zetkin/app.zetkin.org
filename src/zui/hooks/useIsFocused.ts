import { RefObject, useEffect, useRef, useState } from 'react';

/**
 * Returns whether a container element or any of its children currently has focus.
 * If focus leaves while the mouse is pressed (e.g. during a click transition),
 * the blur is deferred until `mouseup` to avoid temporary focus flicker.
 *
 * @param containerRef Ref to the container element to track.
 * @returns `true` if focus is inside the container, otherwise `false`.
 */
export default function useIsFocused<T extends HTMLElement>(
  containerRef: RefObject<T>
) {
  const [focused, setFocused] = useState(false);

  const mouseDownRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleMouseDown = () => {
      mouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      mouseDownRef.current = false;
    };

    const handleFocusIn = () => {
      setFocused(true);
    };

    const handleFocusOut = (ev: FocusEvent) => {
      const next = ev.relatedTarget as Node | null;

      if (container.contains(next)) {
        return;
      }

      if (mouseDownRef.current) {
        const handleDeferredMouseUp = () => {
          mouseDownRef.current = false;

          const active = document.activeElement;
          if (!container.contains(active)) {
            setFocused(false);
          }

          document.removeEventListener('mouseup', handleDeferredMouseUp);
        };

        document.addEventListener('mouseup', handleDeferredMouseUp);
      } else {
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    container.addEventListener('focusin', handleFocusIn);
    container.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);

      container.removeEventListener('focusin', handleFocusIn);
      container.removeEventListener('focusout', handleFocusOut);
    };
  }, [containerRef]);

  return focused;
}
