import { useEffect, useRef } from 'react';

export default function useResizeObserver<
  ElemType extends HTMLElement = HTMLElement
>(onResize: (elem: ElemType) => void) {
  const elemRef = useRef<ElemType>(null);

  useEffect(() => {
    const element = elemRef.current;

    function update() {
      if (element) {
        onResize(element);
      }
    }

    const observer = new ResizeObserver(update);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [onResize]);

  return elemRef;
}
