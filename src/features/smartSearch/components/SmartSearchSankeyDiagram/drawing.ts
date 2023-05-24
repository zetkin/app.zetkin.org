import {
  SankeyAddSegment,
  SankeyEntrySegment,
  SankeyExitSegment,
  SankeySegment,
  SankeySubSegment,
  SEGMENT_KIND,
  SEGMENT_STYLE,
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
    const { arrowDepth, arrowWidth, diagWidth, margin, segHeight } =
      this.measurements;
    const diagCenter = diagWidth / 2;
    const maxStreamWidth = diagWidth - margin;

    const mainWidth = (seg.main?.width ?? 0) * maxStreamWidth;
    const changeWidth = seg.side.width * maxStreamWidth;

    const inputWidth = seg.kind == 'add' ? mainWidth : mainWidth + changeWidth;
    const outputWidth = seg.kind == 'add' ? mainWidth + changeWidth : mainWidth;

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

    if (seg.kind == 'add') {
      const totalOutWidth = mainWidth + changeWidth;

      const lowerRightX =
        diagCenter + totalOutWidth / 2 - mainWidth - changeWidth;
      const lowerLeftX = diagCenter + totalOutWidth / 2 - mainWidth;

      this.ctx.moveTo(0, segHeight / 2 + arrowWidth / 2 + offsetY);
      this.ctx.lineTo(arrowDepth, segHeight / 2 + offsetY);
      this.ctx.lineTo(0, segHeight / 2 - arrowWidth / 2 + offsetY);
      this.ctx.quadraticCurveTo(
        diagCenter + totalOutWidth / 2 - mainWidth,
        segHeight / 2 - arrowWidth / 2 + offsetY,

        lowerLeftX,
        segHeight + offsetY
      );
      this.ctx.lineTo(lowerRightX, segHeight + offsetY);
      this.ctx.quadraticCurveTo(
        diagCenter + totalOutWidth / 2 - mainWidth - changeWidth,
        segHeight / 2 + arrowWidth / 2 + offsetY,
        0,
        segHeight / 2 + arrowWidth / 2 + offsetY
      );
    } else if (seg.kind == 'sub') {
      const totalInWidth = mainWidth + changeWidth;

      const upperLeftX = diagCenter + totalInWidth / 2 - changeWidth;
      const upperRightX = diagCenter + totalInWidth / 2;

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
    if (seg.kind == SEGMENT_KIND.ADD || seg.kind == SEGMENT_KIND.SUB) {
      this.drawAddSubSegment(seg, offsetY);
    } else if (seg.kind == SEGMENT_KIND.ENTRY) {
      this.drawEntrySegment(seg, offsetY);
    } else if (seg.kind == SEGMENT_KIND.EXIT) {
      this.drawExitSegment(seg, offsetY);
    }
  }

  initPath(style: SEGMENT_STYLE) {
    const isStroke = style == SEGMENT_STYLE.STROKE;
    this.ctx.beginPath();
    this.ctx.strokeStyle = isStroke ? 'red' : 'transparent';
    this.ctx.lineWidth = isStroke ? this.measurements.lineWidth : 0;
    this.ctx.fillStyle = isStroke ? 'transparent' : 'red';
  }
}
