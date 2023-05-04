import { RefObject, useContext, useEffect, useRef } from 'react';

import { PageContainerContext } from './PageContainerContext';

type ResizablePane = {
  paneContainerRef: RefObject<HTMLDivElement | undefined>;
  slideRef: RefObject<HTMLDivElement | undefined>;
  updatePaneHeight: () => void;
};

export default function useResizablePane(fixedHeight: boolean): ResizablePane {
  const paneContainerRef = useRef<HTMLDivElement>();
  const slideRef = useRef<HTMLDivElement>();
  const { container } = useContext(PageContainerContext);

  const updatePaneHeight = () => {
    const paneContainer = paneContainerRef.current;
    if (paneContainer) {
      const rect = paneContainer.getBoundingClientRect();
      if (slideRef.current) {
        if (rect.top <= 16 && !fixedHeight) {
          slideRef.current.style.position = 'fixed';
          slideRef.current.style.height = 'auto';
        } else {
          slideRef.current.style.position = 'absolute';
          if (!fixedHeight) {
            slideRef.current.style.height =
              Math.min(window.innerHeight - rect.top - 32, rect.height) + 'px';
          }
        }
      }
    }
  };

  useEffect(() => {
    if (container) {
      window.addEventListener('resize', updatePaneHeight);
      container.addEventListener('scroll', updatePaneHeight);

      return () => {
        window.removeEventListener('resize', updatePaneHeight);
        container.removeEventListener('scroll', updatePaneHeight);
      };
    }
  }, [container]);

  useEffect(() => {
    updatePaneHeight();
  }, []);

  return { paneContainerRef, slideRef, updatePaneHeight };
}
