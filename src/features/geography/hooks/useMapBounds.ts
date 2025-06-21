import {
  LngLatBounds,
  LngLatBoundsLike,
  LngLatLike,
  Map as MapType,
} from 'maplibre-gl';
import { useEffect, useMemo, useState } from 'react';

import { Zetkin2Area } from 'features/areas/types';

type Props = {
  areas: Zetkin2Area[];
  map: MapType | null;
};

type Return = LngLatBoundsLike;

export default function useMapBounds({ areas, map }: Props): Return {
  const [userInteracted, setUserInteracted] = useState(false);

  const bounds: [LngLatLike, LngLatLike] = useMemo(() => {
    const firstPolygon = areas[0]?.boundary.coordinates[0];
    if (firstPolygon?.length) {
      const totalBounds = new LngLatBounds(firstPolygon[0], firstPolygon[0]);

      // Extend with all areas
      areas.forEach((area) => {
        area.boundary.coordinates[0]?.forEach((lngLat) =>
          totalBounds.extend(lngLat)
        );
      });

      return [totalBounds.getSouthWest(), totalBounds.getNorthEast()];
    }

    const min: LngLatLike = [180, 90];
    const max: LngLatLike = [-180, -90];

    return [min, max];
  }, [areas]);

  useEffect(() => {
    const shouldPan = map && !userInteracted;

    if (bounds && shouldPan) {
      map.fitBounds(bounds, { animate: true, duration: 800 });
    }
  }, [bounds]);

  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      map?.off('zoom', handleInteraction);
      map?.off('move', handleInteraction);
    };

    map?.on('zoom', handleInteraction);
    map?.on('move', handleInteraction);

    return () => {
      map?.off('zoom', handleInteraction);
      map?.off('move', handleInteraction);
    };
  }, [map]);

  return bounds;
}
