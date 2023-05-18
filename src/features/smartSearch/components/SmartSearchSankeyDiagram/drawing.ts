type PathElem =
  | ['C', [number, number], [number, number], [number, number]]
  | ['M', number, number]
  | ['L', number, number];

export type Measurements = {
  arrowDepth: number;
  arrowWidth: number;
  change: number;
  changeWidth: number;
  diagCenter: number;
  diagWidth: number;
  inputWidth: number;
  lineWidth: number;
  margin: number;
  offsetY: number;
  outputWidth: number;
  segHeight: number;
};

export function drawFilterInputOutput(
  context: CanvasRenderingContext2D,
  gradient: CanvasGradient,
  op: 'add' | 'sub',
  {
    arrowDepth,
    arrowWidth,
    change,
    changeWidth,
    diagCenter,
    diagWidth,
    inputWidth,
    lineWidth,
    margin,
    offsetY,
    outputWidth,
    segHeight,
  }: Measurements
) {
  if (change == 0) {
    // This filter changes nothing, which can be temporary.
    // Draw "ghost" input/output with dashed line.
    context.beginPath();
    context.strokeStyle = gradient;
    context.lineWidth = lineWidth;
    context.setLineDash([3, 3]);

    if (op == 'add') {
      drawPath(
        context,
        [
          ['M', 0, segHeight / 2 + arrowWidth / 2],
          ['L', arrowDepth, segHeight / 2],
          ['L', 0, segHeight / 2 - arrowWidth / 2],
          [
            'C',
            [
              diagCenter - outputWidth / 2 + arrowWidth / 2,
              segHeight / 2 - arrowWidth / 2,
            ],
            [diagCenter - outputWidth / 2 + arrowWidth, segHeight / 1.5],
            [
              diagCenter - outputWidth / 2 + arrowWidth,
              segHeight - lineWidth / 2,
            ],
          ],
          [
            'L',
            diagCenter - outputWidth / 2 + lineWidth / 2,
            segHeight - lineWidth / 2,
          ],
          [
            'C',
            [diagCenter - outputWidth / 2, segHeight / 1.5],
            [diagCenter - outputWidth / 2, segHeight / 2 + arrowWidth / 2],
            [0, segHeight / 2 + arrowWidth / 2],
          ],
        ],
        offsetY
      );
    } else if (op == 'sub') {
      drawPath(
        context,
        [
          ['M', diagCenter + inputWidth / 2 - arrowWidth, lineWidth / 2],
          ['L', diagCenter + inputWidth / 2 - lineWidth / 2, lineWidth / 2],
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
            [diagCenter + inputWidth / 2 - arrowWidth, segHeight / 2],
            [diagCenter + inputWidth / 2 - arrowWidth, 0],
          ],
        ],
        offsetY
      );
    }

    context.stroke();
  } else {
    // There is an actual change, so we should render a filled input
    // or output arrow with a with that reflects the size of change
    context.fillStyle = gradient;
    context.beginPath();

    if (change > 0) {
      // Input when adding
      drawPath(
        context,
        [
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
        ],
        offsetY
      );
    } else if (change < 0) {
      // Output when removing
      drawPath(
        context,
        [
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
        ],
        offsetY
      );
    }

    context.fill();
  }
}

export function drawFilterMainStream(
  context: CanvasRenderingContext2D,
  {
    change,
    changeWidth,
    diagCenter,
    inputWidth,
    offsetY,
    outputWidth,
    segHeight,
  }: Measurements
) {
  if (change >= 0) {
    // Main stream when adding
    drawPath(
      context,
      [
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
      ],
      offsetY
    );
  } else if (change < 0) {
    // Main stream when removing
    drawPath(
      context,
      [
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
      ],
      offsetY
    );
  }
}

export function drawPath(
  context: CanvasRenderingContext2D,
  path: PathElem[],
  offsetY = 0
): void {
  for (const elem of path) {
    if (elem[0] == 'M') {
      context.moveTo(elem[1], elem[2] + offsetY);
    } else if (elem[0] == 'C') {
      const [, c1, c2, p] = elem;
      context.bezierCurveTo(
        c1[0],
        c1[1] + offsetY,
        c2[0],
        c2[1] + offsetY,
        p[0],
        p[1] + offsetY
      );
    } else if (elem[0] == 'L') {
      context.lineTo(elem[1], elem[2] + offsetY);
    }
  }
}
