import { Map as MapType } from 'leaflet';
import { useEffect } from 'react';

/**
 * Automatically resizes the map when its container is resized.
 * For example, this can be triggered by a window resize or when the side-menu is opened/closed.
 * @param mapRef - The map reference to resize.
 */
export const useAutoResizeMap = (mapRef: MapType | null) => {
  const containerElement = mapRef?.getContainer();

  useEffect(() => {
    if (!containerElement) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => mapRef?.invalidateSize());
    resizeObserver.observe(containerElement);
    return () => resizeObserver.disconnect();
  }, [containerElement]);
};
