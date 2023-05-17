import { FC, useEffect, useRef } from 'react';

type SmartSearchSankeyDiagramProps = {
  filterStats: {
    matched: number;
    output: number;
  }[];
};

const SmartSearchSankeyDiagram: FC<SmartSearchSankeyDiagramProps> = ({
  filterStats,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const margin = 30;
  const diagWidth = 200;
  const diagCenter = diagWidth / 2;

  const maxStreamWidth = diagWidth - margin * 2;
  const maxSegOutput = Math.max(...filterStats.map((stats) => stats.output));
  const segHeight = 100;

  const arrowDepth = 10;
  const arrowWidth = 20;

  const render = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    filterStats.forEach((stats, index) => {
      const inputCount = index > 0 ? filterStats[index - 1].output : 0;
      const inputWidth = (inputCount / maxSegOutput) * maxStreamWidth;
      const outputWidth = (stats.output / maxSegOutput) * maxStreamWidth;

      const change = stats.output - inputCount;
      const changeWidth = (Math.abs(change) / maxSegOutput) * maxStreamWidth;

      context.resetTransform();
      context.translate(0, index * segHeight);
      context.fillStyle = '#cccccc';
      context.beginPath();

      if (inputCount > 0 && change > 0) {
        // Main stream when adding
        drawPath(context, [
          ['M', diagCenter - inputWidth / 2, 0],
          ['L', diagCenter + inputWidth / 2, 0],
          [
            'C',
            [diagCenter + inputWidth / 2, 0.4 * segHeight],
            [diagCenter + outputWidth / 2, 0.6 * segHeight],
            [diagCenter + outputWidth / 2, segHeight],
          ],
          ['L', diagCenter - outputWidth / 2 + changeWidth, segHeight],
          [
            'C',
            [diagCenter - outputWidth / 2 + changeWidth, 0.6 * segHeight],
            [diagCenter - inputWidth / 2, 0.4 * segHeight],
            [diagCenter - inputWidth / 2, 0],
          ],
        ]);
      } else if (inputCount > 0 && change < 0) {
        // Main stream when removing
        drawPath(context, [
          ['M', diagCenter - inputWidth / 2, 0],
          ['L', diagCenter + inputWidth / 2 - changeWidth, 0],
          [
            'C',
            [diagCenter + inputWidth / 2 - changeWidth, 0.4 * segHeight],
            [diagCenter + outputWidth / 2, 0.6 * segHeight],
            [diagCenter + outputWidth / 2, segHeight],
          ],
          ['L', diagCenter - outputWidth / 2, segHeight],
          [
            'C',
            [diagCenter - outputWidth / 2, 0.6 * segHeight],
            [diagCenter - inputWidth / 2, 0.4 * segHeight],
            [diagCenter - inputWidth / 2, 0],
          ],
        ]);
      }

      if (change > 0) {
        // Input when adding
        drawPath(context, [
          ['M', 0, segHeight / 2 + arrowWidth / 2],
          ['L', arrowDepth, segHeight / 2],
          ['L', 0, segHeight / 2 - arrowWidth / 2],
          [
            'C',
            [
              diagCenter - outputWidth / 2 + changeWidth / 2,
              segHeight / 2 - arrowWidth / 2,
            ],
            [diagCenter - outputWidth / 2 + changeWidth, segHeight / 1.5],
            [diagCenter - outputWidth / 2 + changeWidth, segHeight],
          ],
          ['L', diagCenter - outputWidth / 2, segHeight],
          [
            'C',
            [diagCenter - outputWidth / 2, segHeight / 1.5],
            [diagCenter - outputWidth / 2, segHeight / 2 + arrowWidth / 2],
            [0, segHeight / 2 + arrowWidth / 2],
          ],
        ]);
      } else if (change < 0) {
        // Output when removing
        drawPath(context, [
          ['M', diagCenter + inputWidth / 2 - changeWidth, 0],
          ['L', diagCenter + inputWidth / 2, 0],
          [
            'C',
            [diagCenter + inputWidth / 2, segHeight / 3],
            [diagWidth - margin, segHeight / 2 - arrowWidth / 2],
            [diagWidth - arrowDepth, segHeight / 2 - arrowWidth / 2],
          ],
          ['L', diagWidth, segHeight / 2],
          ['L', diagWidth - arrowDepth, segHeight / 2 + arrowWidth / 2],
          [
            'C',
            [diagWidth - margin, segHeight / 2 + arrowWidth / 2],
            [diagCenter + inputWidth / 2 - changeWidth, segHeight / 2],
            [diagCenter + inputWidth / 2 - changeWidth, 0],
          ],
        ]);
      }

      context.fill();
    });
  };

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      render(context);
    }
  }, [canvasRef.current, filterStats]);

  return (
    <canvas
      ref={canvasRef}
      height={segHeight * filterStats.length}
      width={diagWidth}
    />
  );
};

type PathElem =
  | ['C', [number, number], [number, number], [number, number]]
  | ['M', number, number]
  | ['L', number, number];

function drawPath(context: CanvasRenderingContext2D, path: PathElem[]): void {
  for (const elem of path) {
    if (elem[0] == 'M') {
      context.moveTo(elem[1], elem[2]);
    } else if (elem[0] == 'C') {
      const [, c1, c2, p] = elem;
      context.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], p[0], p[1]);
    } else if (elem[0] == 'L') {
      context.lineTo(elem[1], elem[2]);
    }
  }
}

export default SmartSearchSankeyDiagram;
