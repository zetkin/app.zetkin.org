import {
  SankeyAddSegment,
  SankeyEntrySegment,
  SankeyExitSegment,
  SankeySegment,
  SankeySubSegment,
} from './types';

export type Measurements = {
  arrowDepth: number;
  arrowWidth: number;
  diagWidth: number;
  lineWidth: number;
  margin: number;
  segHeight: number;
};

export class SankeyRenderer {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private measurements: Measurements
  ) {
    this.ctx = ctx;
    this.measurements = measurements;
  }

  drawAddSubSegment(seg: SankeyAddSegment | SankeySubSegment, offsetY: number) {
    const { arrowDepth, arrowWidth, diagWidth, lineWidth, margin, segHeight } =
      this.measurements;
    const diagCenter = diagWidth / 2;
    const maxStreamWidth = diagWidth - margin;

    const mainInWidth = (seg.main?.input ?? 0) * maxStreamWidth;
    const mainOutWidth = (seg.main?.output ?? 0) * maxStreamWidth;
    const changeWidth = seg.side.width * maxStreamWidth;

    const inputWidth =
      seg.kind == 'add' ? mainInWidth : mainInWidth + changeWidth;
    const outputWidth =
      seg.kind == 'add' ? mainOutWidth + changeWidth : mainOutWidth;

    if (seg.main) {
      this.initPath(seg.main.style);

      if (seg.kind == 'add') {
        this.ctx.moveTo(diagCenter - inputWidth / 2, offsetY);
        this.ctx.lineTo(diagCenter + inputWidth / 2, offsetY);
        this.ctx.bezierCurveTo(
          diagCenter + inputWidth / 2,
          0.4 * segHeight + offsetY,
          diagCenter + outputWidth / 2,
          0.6 * segHeight + offsetY,
          diagCenter + outputWidth / 2,
          segHeight + offsetY
        );
        this.ctx.lineTo(diagCenter + outputWidth / 2, segHeight + offsetY);
        this.ctx.lineTo(
          diagCenter - outputWidth / 2 + changeWidth,
          segHeight + offsetY
        );
        this.ctx.bezierCurveTo(
          diagCenter - outputWidth / 2 + changeWidth,
          0.6 * segHeight + offsetY,
          diagCenter - inputWidth / 2,
          0.4 * segHeight + offsetY,
          diagCenter - inputWidth / 2,
          0 + offsetY
        );
      } else if (seg.kind == 'sub') {
        this.ctx.moveTo(diagCenter - inputWidth / 2, offsetY);
        this.ctx.lineTo(diagCenter + inputWidth / 2 - changeWidth, offsetY);
        this.ctx.bezierCurveTo(
          diagCenter + inputWidth / 2 - changeWidth,
          0.4 * segHeight + offsetY,
          diagCenter + outputWidth / 2,
          0.6 * segHeight + offsetY,
          diagCenter + outputWidth / 2,
          segHeight + offsetY
        );
        this.ctx.lineTo(diagCenter - outputWidth / 2, segHeight + offsetY);
        this.ctx.bezierCurveTo(
          diagCenter - outputWidth / 2,
          0.6 * segHeight + offsetY,
          diagCenter - inputWidth / 2,
          0.4 * segHeight + offsetY,
          diagCenter - inputWidth / 2,
          offsetY
        );
      }

      this.ctx.stroke();
      this.ctx.fill();
    }

    this.initPath(seg.side.style);
    const pseudoSide = seg.side.style == 'stroke';

    if (seg.kind == 'add') {
      const totalOutWidth = mainOutWidth + changeWidth;

      // Remove some pixels to make sure the stroke does not extend
      // outside of the body of the diagram.
      const lowerRightX = pseudoSide
        ? diagCenter - totalOutWidth / 2 + lineWidth / 2
        : diagCenter + totalOutWidth / 2 - mainOutWidth - changeWidth;

      // If there is no change, use the arrowWidth as the change width.
      const lowerLeftX = pseudoSide
        ? diagCenter - totalOutWidth / 2 + arrowWidth
        : diagCenter + totalOutWidth / 2 - mainOutWidth;

      this.ctx.moveTo(0, segHeight / 2 + arrowWidth / 2 + offsetY);
      this.ctx.lineTo(arrowDepth, segHeight / 2 + offsetY);
      this.ctx.lineTo(0, segHeight / 2 - arrowWidth / 2 + offsetY);
      this.ctx.quadraticCurveTo(
        diagCenter + totalOutWidth / 2 - mainOutWidth,
        segHeight / 2 - arrowWidth / 2 + offsetY,

        lowerLeftX,
        segHeight + offsetY
      );
      this.ctx.lineTo(lowerRightX, segHeight + offsetY);
      this.ctx.quadraticCurveTo(
        diagCenter + totalOutWidth / 2 - mainOutWidth - changeWidth,
        segHeight / 2 + arrowWidth / 2 + offsetY,
        0,
        segHeight / 2 + arrowWidth / 2 + offsetY
      );
    } else if (seg.kind == 'sub') {
      const totalInWidth = mainInWidth + changeWidth;

      // If there is no change, use the arrowWidth as the change width.
      const upperLeftX = pseudoSide
        ? diagCenter + totalInWidth / 2 - arrowWidth
        : diagCenter + totalInWidth / 2 - changeWidth;

      // Remove some pixels to make sure the stroke does not extend
      // outside of the body of the diagram.
      const upperRightX = pseudoSide
        ? diagCenter + totalInWidth / 2 - lineWidth / 2
        : diagCenter + totalInWidth / 2;

      this.ctx.moveTo(upperLeftX, 0 + offsetY);
      this.ctx.lineTo(upperRightX, 0 + offsetY);
      this.ctx.quadraticCurveTo(
        diagCenter + totalInWidth / 2,
        segHeight / 2 - arrowWidth / 2 + offsetY,
        diagWidth - arrowDepth,
        segHeight / 2 - arrowWidth / 2 + offsetY
      );
      this.ctx.lineTo(diagWidth, segHeight / 2 + offsetY);
      this.ctx.lineTo(
        diagWidth - arrowDepth,
        segHeight / 2 + arrowWidth / 2 + offsetY
      );
      this.ctx.quadraticCurveTo(
        diagCenter + totalInWidth / 2 - changeWidth,
        segHeight / 2 + arrowWidth / 2 + offsetY,
        upperLeftX,
        0 + offsetY
      );
    }

    this.ctx.stroke();
    this.ctx.fill();
  }

  drawEntrySegment(seg: SankeyEntrySegment, offsetY: number) {
    const { arrowDepth, diagWidth, margin, segHeight } = this.measurements;

    this.initPath(seg.style);

    const segWidth = seg.width * (diagWidth - margin);
    const diagCenter = diagWidth / 2;
    const top = 0.3 * segHeight + offsetY;
    const bottom = segHeight + offsetY;

    this.ctx.moveTo(diagCenter - segWidth / 2, top);
    this.ctx.lineTo(diagCenter, top + arrowDepth * 2);
    this.ctx.lineTo(diagCenter + segWidth / 2, top);
    this.ctx.lineTo(diagCenter + segWidth / 2, bottom);
    this.ctx.lineTo(diagCenter - segWidth / 2, bottom);
    this.ctx.lineTo(diagCenter - segWidth / 2, top);

    this.ctx.stroke();
    this.ctx.fill();
  }

  drawExitSegment(seg: SankeyExitSegment, offsetY: number) {
    const { arrowDepth, diagWidth, margin } = this.measurements;

    this.initPath(seg.style);

    const segWidth = seg.width * (diagWidth - margin);
    const diagCenter = diagWidth / 2;

    this.ctx.moveTo(diagCenter - segWidth / 2, offsetY);
    this.ctx.lineTo(diagCenter + segWidth / 2, offsetY);
    this.ctx.lineTo(diagCenter, offsetY + arrowDepth * 2);
    this.ctx.lineTo(diagCenter - segWidth / 2, offsetY);

    this.ctx.stroke();
    this.ctx.fill();
  }

  drawSegment(seg: SankeySegment, offsetY: number) {
    if (seg.kind == 'add' || seg.kind == 'sub') {
      this.drawAddSubSegment(seg, offsetY);
    } else if (seg.kind == 'entry') {
      this.drawEntrySegment(seg, offsetY);
    } else if (seg.kind == 'exit') {
      this.drawExitSegment(seg, offsetY);
    }
  }

  initPath(style: 'fill' | 'stroke') {
    const isStroke = style == 'stroke';
    this.ctx.beginPath();
    this.ctx.strokeStyle = isStroke ? 'red' : 'transparent';
    this.ctx.lineWidth = isStroke ? this.measurements.lineWidth : 0;
    this.ctx.fillStyle = isStroke ? 'transparent' : 'red';
  }
}
