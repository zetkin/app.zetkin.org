import { ZetkinMetric } from 'features/areaAssignments/types';

export default function sortMetrics(
  metricsList: ZetkinMetric[]
): ZetkinMetric[] {
  const listCopy = metricsList.slice();
  return listCopy.sort(
    (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
  );
}
