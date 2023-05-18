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

    const isFirst = index == 0 || stats[index - 1].op == 'empty';
    const changeReal = Math.abs(item.output - inputReal);

    const followsPseudo = inputReal == 0;

    if (item.op == 'entry') {
      return {
        kind: 'entry',
        style: item.output > 0 ? 'fill' : 'stroke',
        width: (item.output || firstOutput) / maxOutput,
      };
    }

    if (item.op == 'add') {
      return {
        kind: 'add',
        main: isFirst
          ? null
          : {
              input: inputNormalized,
              output: inputNormalized,
              style: followsPseudo ? 'stroke' : 'fill',
            },
        side: {
          style: 'fill',
          width: followsPseudo ? inputNormalized : changeReal / maxOutput,
        },
      };
    } else if (item.op == 'sub') {
      return {
        kind: 'sub',
        main: {
          input: item.output / maxOutput,
          output: item.output / maxOutput,
          style: 'fill',
        },
        side: {
          style: 'fill',
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
