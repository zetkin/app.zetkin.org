import { useEffect, useMemo } from 'react';

import { Zetkin2Area, ZetkinAreaStats } from 'features/areas/types';
import { futureToObject } from 'core/caching/futures';
import useAreaStats from './useAreaStats';

export const MIN_FETCH_ZOOM = 10;

export default function useAreasWithStats(
  allAreas: Zetkin2Area[],
  areasInView: Zetkin2Area[],
  zoomLevel: number
) {
  const { allAreaStats, getAreaStats } = useAreaStats();

  // Fetch stats for the areas in view
  useEffect(() => {
    if (zoomLevel > MIN_FETCH_ZOOM && areasInView.length > 0) {
      Promise.all(
        areasInView.map(async ({ id: areaId }) => {
          getAreaStats(areaId);
        })
      );
    }
  }, [areasInView, getAreaStats, zoomLevel]);

  // Build geojson object of areas, attach stats if they exist
  const areasWithStatsGeojson: GeoJSON.FeatureCollection<
    Zetkin2Area['boundary'],
    { id: number; stats: ZetkinAreaStats | null }
  > = useMemo(() => {
    return {
      features: allAreas.map((area) => {
        return {
          geometry: area.boundary,
          properties: {
            id: area.id,
            stats: allAreaStats[area.id]
              ? futureToObject(allAreaStats[area.id]).data
              : null,
          },
          type: 'Feature',
        };
      }),
      type: 'FeatureCollection',
    };
  }, [allAreas, allAreaStats]);

  return areasWithStatsGeojson;
}
