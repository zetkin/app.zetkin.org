import { ZetkinMetric } from 'features/areaAssignments/types';

export default function sortMetrics(
  metricsList: ZetkinMetric[]
): ZetkinMetric[] {
  return metricsList
    ?.slice()
    .sort(
      (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
    );
}
