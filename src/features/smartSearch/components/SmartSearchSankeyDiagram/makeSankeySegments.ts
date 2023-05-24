import { FilterStats, SankeySegment } from './types';

export default function makeSankeySegments(
  stats: FilterStats[]
): SankeySegment[] {
  const maxOutput = Math.max(...stats.map((s) => s.output));

  const firstOutputStats = stats.find((item) => item.output > 0);
  const firstOutput = firstOutputStats?.output ?? 1;

  const segments: SankeySegment[] = stats.map((item, index) => {
    const inputReal = index > 0 ? stats[index - 1].output : 0;
    const inputNormalized = (inputReal || firstOutput) / maxOutput;
    const changeReal = Math.abs(item.output - inputReal);

    if (item.op == 'entry') {
      return {
        kind: 'entry',
        style: item.output > 0 ? 'fill' : 'stroke',
        width: (item.output || firstOutput) / maxOutput,
      };
    }

    // TODO: Implement this logic once output format has been verified to work
    if (item.op == 'add') {
      return {
        kind: 'add',
        main: null,
        side: {
          offset: 0,
          style: 'fill',
          width: inputNormalized,
        },
      };
    } else if (item.op == 'sub') {
      return {
        kind: 'sub',
        main: {
          offset: 0,
          style: 'fill',
          width: item.output / maxOutput,
        },
        side: {
          offset: 0,
          style: changeReal > 0 ? 'fill' : 'stroke',
          width: changeReal / maxOutput,
        },
      };
    } else {
      return {
        kind: 'empty',
      };
    }
  });

  if (segments.length > 0) {
    segments.push({
      kind: 'exit',
      style: 'fill',
      width: stats[stats.length - 1].output / maxOutput,
    });
  }

  return segments;
}
