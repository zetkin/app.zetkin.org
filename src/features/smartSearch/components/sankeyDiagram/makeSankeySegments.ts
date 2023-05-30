import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { FILTER_TYPE, OPERATION } from '../types';
import {
  SankeySegment,
  SEGMENT_KIND,
  SEGMENT_STYLE,
} from '../sankeyDiagram/types';

export default function makeSankeySegments(
  stats: ZetkinSmartSearchFilterStats[]
): SankeySegment[] {
  const statsCopy = stats.concat();
  const maxPeople = Math.max(...stats.map((item) => item.result));

  // By default, the start is empty
  const segments: SankeySegment[] = [
    {
      kind: SEGMENT_KIND.EMPTY,
    },
  ];

  let prevResult = 0;

  // If the first filter is "all", the first segment should
  // be an entry instead
  if (statsCopy[0]?.filter.type == FILTER_TYPE.ALL) {
    // Remove the first filter stats, to be treated as entry
    const entryStats = statsCopy.shift();

    // This will always be true, because this block would not
    // be entered unless statsCopy[0] exists, but Typescript
    // doesn't understand that for some reason
    if (entryStats) {
      segments[0] = {
        kind: SEGMENT_KIND.ENTRY,
        style: SEGMENT_STYLE.FILL,
        width: entryStats.result / maxPeople,
      };

      prevResult = entryStats.result;
    }
  }

  statsCopy.forEach(({ change, filter, result }, index) => {
    // The previous segment is the one with the same index as the
    // filter/stats we're currently handling, because the segments
    // array starts with an entry, so already has one element when
    // this loop starts.
    const prevSeg = segments[index];

    const prevIsEmpty = prevSeg.kind == SEGMENT_KIND.EMPTY;

    if (prevIsEmpty) {
      segments.push({
        kind: SEGMENT_KIND.PSEUDO_ADD,
        main: null,
        side: {
          style: SEGMENT_STYLE.FILL,
          width: change / maxPeople,
        },
      });
    } else if (change > 0) {
      segments.push({
        kind: SEGMENT_KIND.ADD,
        main: {
          style: SEGMENT_STYLE.FILL,
          width: prevResult / maxPeople,
        },
        side: {
          style: SEGMENT_STYLE.FILL,
          width: change / maxPeople,
        },
      });
    } else if (change < 0) {
      segments.push({
        kind: SEGMENT_KIND.SUB,
        main: {
          style: SEGMENT_STYLE.FILL,
          width: result / maxPeople,
        },
        side: {
          style: SEGMENT_STYLE.FILL,
          width: Math.abs(change) / maxPeople,
        },
      });
    } else {
      if (filter.op == OPERATION.ADD) {
        segments.push({
          kind: SEGMENT_KIND.PSEUDO_ADD,
          main: {
            style: SEGMENT_STYLE.FILL,
            width: result / maxPeople,
          },
          side: {
            style: SEGMENT_STYLE.STROKE,
            width: result / maxPeople,
          },
        });
      } else {
        segments.push({
          kind: SEGMENT_KIND.PSEUDO_SUB,
          main: {
            style: SEGMENT_STYLE.FILL,
            width: result / maxPeople,
          },
          side: {
            style: SEGMENT_STYLE.STROKE,
            width: result / maxPeople,
          },
        });
      }
    }

    prevResult = result;
  });

  const last = segments[segments.length - 1];
  if (last.kind == SEGMENT_KIND.EMPTY) {
    // If the stats are all empty, end with empty
    segments.push({
      kind: SEGMENT_KIND.EMPTY,
    });
  } else {
    segments.push({
      kind: SEGMENT_KIND.EXIT,
      style: SEGMENT_STYLE.FILL,
      width: prevResult / maxPeople,
    });
  }

  return segments;
}
