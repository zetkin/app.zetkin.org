import { useEffect, useMemo } from 'react';

import { Zetkin2Area, ZetkinAreaStats } from 'features/areas/types';
import useAreaStats from './useAreaStats';

export default function useAreasWithStats(
  allAreas: Zetkin2Area[],
  areasInView: Zetkin2Area[]
) {
  const getAreaStats = useAreaStats();

  // Fetch stats for the areas in view
  useEffect(() => {
    if (areasInView.length > 0) {
      Promise.all(
        areasInView.map(async ({ id: areaId }) => {
          getAreaStats(areaId);
        })
      );
    }
  }, [areasInView, getAreaStats]);

  // Build geojson object of areas, attach stats if they exist
  const areasWithStatsGeojson: GeoJSON.FeatureCollection<
    Zetkin2Area['boundary'],
    { id: number; stats: ZetkinAreaStats | null }
  > = useMemo(() => {
    return {
      features: allAreas.map((area) => {
        return {
          geometry: area.boundary,
          properties: { id: area.id, stats: getAreaStats(area.id) },
          type: 'Feature',
        };
      }),
      type: 'FeatureCollection',
    };
  }, [allAreas, getAreaStats]);

  return areasWithStatsGeojson;
}
