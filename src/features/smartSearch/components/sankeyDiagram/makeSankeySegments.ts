import {
  FilterStats,
  SankeySegment,
  SEGMENT_KIND,
} from '../sankeyDiagram/types';

export default function makeSankeySegments(
  stats: FilterStats[]
): SankeySegment[] {
  return stats.map(() => ({
    kind: SEGMENT_KIND.EMPTY,
  }));
}
