import { useCallback, useEffect, useState } from 'react';

/**
 * Hook to prevent keyboard events from propagating outside a modal element.
 *
 * This hook prevents keyboard events inside a modal from propagating to elements
 * outside the modal (like global keyboard shortcuts). It works by:
 *
 * 1. Using event capturing phase (capture: true) to intercept events BEFORE they
 *    reach their target element
 * 2. Calling stopPropagation() and stopImmediatePropagation() to prevent the
 *    event from continuing to other listeners
 *
 * The implementation uses a callback ref pattern because:
 * - The modal element may not exist when the hook first runs (due to animations)
 * - The callback ref is called when the element is mounted, triggering a state
 *   update that re-runs the effect with the element available
 *
 * @param open - Whether the modal is open
 * @param allowPropagation - Whether to allow keyboard events to propagate (default: false)
 * @returns A callback ref to attach to the modal element
 */
export const usePreventKeyboardPropagation = (
  open: boolean,
  allowPropagation: boolean = false
) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!open || allowPropagation || !element) {
      return;
    }

    const handleKeyEvent = (event: KeyboardEvent) => {
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    element.addEventListener('keydown', handleKeyEvent, { capture: true });
    element.addEventListener('keyup', handleKeyEvent, { capture: true });
    element.addEventListener('keypress', handleKeyEvent, {
      capture: true,
    });

    return () => {
      element.removeEventListener('keydown', handleKeyEvent, {
        capture: true,
      });
      element.removeEventListener('keyup', handleKeyEvent, { capture: true });
      element.removeEventListener('keypress', handleKeyEvent, {
        capture: true,
      });
    };
  }, [allowPropagation, element, open]);

  return useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);
};
