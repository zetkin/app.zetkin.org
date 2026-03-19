import { useEffect, useMemo } from 'react';

import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import {
  assignmentStatsLoad,
  assignmentStatsLoaded,
} from 'features/areas/store';
import { Zetkin2Area, ZetkinAreaStats } from 'features/areas/types';

export default function useAreasWithStats(
  areas: Zetkin2Area[],
  visibleAreaIds: number[]
) {
  const dispatch = useAppDispatch();
  const statsByAreaId = useAppSelector(
    (state) => state.areas.assignmentStatsByAreaId
  );

  useEffect(() => {
    if (visibleAreaIds.length > 0) {
      Promise.all(
        visibleAreaIds.map(async (areaId) => {
          if ([15, 16, 19, 28].includes(areaId)) {
            const statsItem = statsByAreaId[areaId];

            loadItemIfNecessary(statsItem, dispatch, {
              actionOnLoad: () => dispatch(assignmentStatsLoad(areaId)),
              actionOnSuccess: (data) =>
                dispatch(assignmentStatsLoaded([areaId, data])),
              loader: async () => {
                const res = await fetch(`/areaAssignmentStats/${areaId}.json`);
                const stats: ZetkinAreaStats = await res.json();
                return stats;
              },
            });
          }
        })
      );
    }
  }, [dispatch, visibleAreaIds, statsByAreaId]);

  const areasWithStatsGeojson: GeoJSON.FeatureCollection<
    Zetkin2Area['boundary'],
    { id: number; stats: ZetkinAreaStats | null }
  > = useMemo(() => {
    return {
      features: areas.map((area) => {
        return {
          geometry: area.boundary,
          properties: { id: area.id, stats: statsByAreaId[area.id]?.data },
          type: 'Feature',
        };
      }),
      type: 'FeatureCollection',
    };
  }, [areas, statsByAreaId]);

  return areasWithStatsGeojson;
}
