import { useMemo } from 'react';

import { ZetkinMetric } from 'features/areaAssignments/types';

export default function useSortedMetrics(
  metricsList: ZetkinMetric[]
): ZetkinMetric[] {
  return useMemo(() => {
    const listCopy = metricsList.slice();
    return listCopy.sort(
      (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
    );
  }, [metricsList]);
}
