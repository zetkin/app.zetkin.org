import { useCallback, useEffect, useState } from 'react';
import { booleanIntersects, polygon } from '@turf/turf';
import { Map as MapType } from 'maplibre-gl';

import { Zetkin2Area } from 'features/areas/types';
import useDebounce from 'utils/hooks/useDebounce';

/**
 * Gets list of areas within the map view on map load
 * Gets list of areas within the map view when moving, debounced
 */
export default function useAreasInView(
  areas: Zetkin2Area[],
  map: MapType | null
) {
  const [areasInView, setAreasInView] = useState<Zetkin2Area[]>([]);

  const getAreasInView = useCallback(
    (theMap: MapType) => {
      const bounds = theMap.getBounds();
      if (bounds) {
        // Makes a polygon with verteces at each of the four corners of the map
        const boundingPolygon = polygon([
          [
            [bounds._ne.lng, bounds._ne.lat],
            [bounds._ne.lng, bounds._sw.lat],
            [bounds._sw.lng, bounds._sw.lat],
            [bounds._sw.lng, bounds._ne.lat],
            [bounds._ne.lng, bounds._ne.lat],
          ],
        ]);
        const areasWithinBounds = areas.filter((area) =>
          booleanIntersects(boundingPolygon, area.boundary)
        );
        setAreasInView(areasWithinBounds);
      }
    },
    [areas]
  );

  const debouncedUpdateBounds = useDebounce(async (theMap: MapType) => {
    getAreasInView(theMap);
  }, 400);

  useEffect(() => {
    map?.on('load', () => getAreasInView(map));
    map?.on('move', () => debouncedUpdateBounds(map));
    return () => {
      map?.off('load', () => getAreasInView(map));
      map?.off('move', () => debouncedUpdateBounds(map));
    };
  }, [map, getAreasInView, debouncedUpdateBounds]);

  return areasInView;
}
