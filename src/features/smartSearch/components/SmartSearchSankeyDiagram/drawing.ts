import {
  SankeySegment,
  SelectionAddSegment,
  SelectionSubSegment,
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

  drawAddSubSegment(
    seg: SelectionAddSegment | SelectionSubSegment,
    offsetY: number
  ) {
    const { arrowDepth, arrowWidth, diagWidth, margin, segHeight } =
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
    if (seg.kind == 'add') {
      const totalOutWidth = mainOutWidth + changeWidth;

      this.ctx.moveTo(0, segHeight / 2 + arrowWidth / 2 + offsetY);
      this.ctx.lineTo(arrowDepth, segHeight / 2 + offsetY);
      this.ctx.lineTo(0, segHeight / 2 - arrowWidth / 2 + offsetY);
      this.ctx.quadraticCurveTo(
        diagCenter + totalOutWidth / 2 - mainOutWidth,
        segHeight / 2 - arrowWidth / 2 + offsetY,

        diagCenter + totalOutWidth / 2 - mainOutWidth,
        segHeight + offsetY
      );
      this.ctx.lineTo(
        diagCenter + totalOutWidth / 2 - mainOutWidth - changeWidth,
        segHeight + offsetY
      );
      this.ctx.quadraticCurveTo(
        diagCenter + totalOutWidth / 2 - mainOutWidth - changeWidth,
        segHeight / 2 + arrowWidth / 2 + offsetY,
        0,
        segHeight / 2 + arrowWidth / 2 + offsetY
      );
    } else if (seg.kind == 'sub') {
      const totalInWidth = mainInWidth + changeWidth;

      this.ctx.moveTo(diagCenter + totalInWidth / 2 - changeWidth, 0 + offsetY);
      this.ctx.lineTo(diagCenter + totalInWidth / 2, 0 + offsetY);
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
        diagCenter + totalInWidth / 2 - changeWidth,
        0 + offsetY
      );
    }

    this.ctx.stroke();
    this.ctx.fill();
  }

  drawSegment(seg: SankeySegment, offsetY: number) {
    if (seg.kind == 'add' || seg.kind == 'sub') {
      this.drawAddSubSegment(seg, offsetY);
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
