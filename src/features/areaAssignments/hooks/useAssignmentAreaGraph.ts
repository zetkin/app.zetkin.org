import { AreaCardData } from '../types';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { areaGraphLoad, areaGraphLoaded } from '../store';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useAssignmentAreaStats(
  _orgId: number,
  areaAssId: number
) {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state) => state.areaAssignments.areaGraphByAssignmentId[areaAssId]
  );

  return loadListIfNecessary(stats, dispatch, {
    actionOnLoad: () => areaGraphLoad(areaAssId),
    actionOnSuccess: (data) => areaGraphLoaded([areaAssId, data]),
    loader: async () => {
      // TODO: Get this from API once implemented
      return [] as AreaCardData[];
    },
  });
}
