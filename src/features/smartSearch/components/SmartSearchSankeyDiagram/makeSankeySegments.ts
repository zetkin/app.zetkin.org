import { FilterStats, SankeySegment, SEGMENT_KIND } from './types';

export default function makeSankeySegments(
  stats: FilterStats[]
): SankeySegment[] {
  return stats.map(() => ({
    kind: SEGMENT_KIND.EMPTY,
  }));
}
