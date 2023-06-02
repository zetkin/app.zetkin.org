import { useEffect, useRef } from 'react';

export default function useResizeObserver<
  ElemType extends HTMLElement = HTMLElement
>(onResize: (elem: ElemType) => void) {
  const elemRef = useRef<ElemType>(null);

  useEffect(() => {
    function update() {
      if (elemRef.current) {
        onResize(elemRef.current);
      }
    }

    const observer = new ResizeObserver(update);
    if (elemRef.current) {
      observer.observe(elemRef.current);
    }

    return () => observer.disconnect();
  }, [elemRef.current, onResize]);

  return elemRef;
}
