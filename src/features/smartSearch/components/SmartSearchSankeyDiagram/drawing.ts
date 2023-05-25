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
    const { diagWidth, margin } = this.measurements;
    const diagCenter = diagWidth / 2;
    const maxStreamWidth = diagWidth - margin;

    const mainWidth = (seg.main?.width ?? 0) * maxStreamWidth;
    const changeWidth = seg.side.width * maxStreamWidth;

    const inputWidth = seg.kind == 'add' ? mainWidth : mainWidth + changeWidth;
    const outputWidth = seg.kind == 'add' ? mainWidth + changeWidth : mainWidth;

    if (seg.main) {
      if (seg.kind == 'add') {
        this.drawMain(
          diagCenter - inputWidth / 2,
          diagCenter + inputWidth / 2,
          diagCenter + outputWidth / 2,
          diagCenter - outputWidth / 2 + changeWidth,
          offsetY,
          seg.main.style
        );
      } else if (seg.kind == 'sub') {
        this.drawMain(
          diagCenter - inputWidth / 2,
          diagCenter + inputWidth / 2 - changeWidth,
          diagCenter + outputWidth / 2,
          diagCenter - outputWidth / 2,
          offsetY,
          seg.main.style
        );
      }
    }

    if (seg.kind == 'add') {
      const totalOutWidth = mainWidth + changeWidth;

      this.drawInput(
        diagCenter + totalOutWidth / 2 - mainWidth - changeWidth,
        diagCenter + totalOutWidth / 2 - mainWidth,
        offsetY,
        seg.side.style
      );
    } else if (seg.kind == 'sub') {
      const totalInWidth = mainWidth + changeWidth;

      this.drawOutput(
        diagCenter + totalInWidth / 2 - changeWidth,
        diagCenter + totalInWidth / 2,
        offsetY,
        seg.side.style
      );
    }
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

  drawInput(
    bottomLeftX: number,
    bottomRightX: number,
    offsetY: number,
    style: SEGMENT_STYLE
  ) {
    const { arrowDepth, arrowWidth, segHeight } = this.measurements;

    this.initPath(style);

    this.ctx.moveTo(0, segHeight / 2 + arrowWidth / 2 + offsetY);
    this.ctx.lineTo(arrowDepth, segHeight / 2 + offsetY);
    this.ctx.lineTo(0, segHeight / 2 - arrowWidth / 2 + offsetY);
    this.ctx.quadraticCurveTo(
      bottomRightX,
      segHeight / 2 - arrowWidth / 2 + offsetY,

      bottomRightX,
      segHeight + offsetY
    );
    this.ctx.lineTo(bottomLeftX, segHeight + offsetY);
    this.ctx.quadraticCurveTo(
      bottomLeftX,
      segHeight / 2 + arrowWidth / 2 + offsetY,
      0,
      segHeight / 2 + arrowWidth / 2 + offsetY
    );

    this.ctx.stroke();
    this.ctx.fill();
  }

  drawMain(
    upperLeftX: number,
    upperRightX: number,
    lowerRightX: number,
    lowerLeftX: number,
    offsetY: number,
    style: SEGMENT_STYLE
  ) {
    const { segHeight } = this.measurements;

    this.initPath(style);

    this.ctx.moveTo(upperLeftX, offsetY);
    this.ctx.lineTo(upperRightX, offsetY);
    this.ctx.bezierCurveTo(
      upperRightX,
      offsetY + 0.4 * segHeight,
      lowerRightX,
      offsetY + 0.6 * segHeight,
      lowerRightX,
      offsetY + segHeight
    );
    this.ctx.lineTo(lowerLeftX, offsetY + segHeight);
    this.ctx.bezierCurveTo(
      lowerLeftX,
      offsetY + 0.6 * segHeight,
      upperLeftX,
      offsetY + 0.4 * segHeight,
      upperLeftX,
      offsetY
    );

    this.ctx.stroke();
    this.ctx.fill();
  }

  drawOutput(
    upperLeftX: number,
    upperRightX: number,
    offsetY: number,
    style: SEGMENT_STYLE
  ) {
    const { arrowDepth, arrowWidth, diagWidth, segHeight } = this.measurements;

    this.initPath(style);

    this.ctx.moveTo(upperLeftX, 0 + offsetY);
    this.ctx.lineTo(upperRightX, 0 + offsetY);
    this.ctx.quadraticCurveTo(
      upperRightX,
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
      upperLeftX,
      segHeight / 2 + arrowWidth / 2 + offsetY,
      upperLeftX,
      0 + offsetY
    );

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
