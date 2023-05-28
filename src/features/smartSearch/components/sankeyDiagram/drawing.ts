import {
  SankeyAddSegment,
  SankeyEntrySegment,
  SankeyExitSegment,
  SankeyPseudoAddSegment,
  SankeyPseudoSubSegment,
  SankeySegment,
  SankeySubSegment,
  SEGMENT_KIND,
  SEGMENT_STYLE,
} from './types';

export type SankeyConfig = {
  arrowDepth: number;
  arrowWidth: number;
  color: string;
  diagWidth: number;
  highlightColor: string;
  lineWidth: number;
  margin: number;
  segHeight: number;
};

export class SankeyRenderer {
  private _highlightCurrent = false;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private config: SankeyConfig
  ) {
    this.ctx = ctx;
    this.config = config;
  }

  drawAddSubSegment(seg: SankeyAddSegment | SankeySubSegment, offsetY: number) {
    const { diagWidth, margin } = this.config;
    const diagCenter = diagWidth / 2;
    const maxStreamWidth = diagWidth - margin * 2;

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
    const { arrowDepth, diagWidth, margin, segHeight } = this.config;

    const inset = this.initPathWithInset(seg.style);

    const segWidth = seg.width * (diagWidth - margin * 2);
    const diagCenter = diagWidth / 2;
    const top = 0.3 * segHeight + offsetY;
    const bottom = segHeight + offsetY;

    this.ctx.moveTo(diagCenter - segWidth / 2 + inset, bottom);
    this.ctx.lineTo(diagCenter - segWidth / 2 + inset, top);
    this.ctx.lineTo(diagCenter, top + arrowDepth * 2);
    this.ctx.lineTo(diagCenter + segWidth / 2 - inset, top);
    this.ctx.lineTo(diagCenter + segWidth / 2 - inset, bottom);

    this.ctx.stroke();
    this.ctx.fill();
  }

  drawExitSegment(seg: SankeyExitSegment, offsetY: number) {
    const { arrowDepth, diagWidth, margin } = this.config;

    const inset = this.initPathWithInset(seg.style);

    const segWidth = seg.width * (diagWidth - margin * 2);
    const diagCenter = diagWidth / 2;

    this.ctx.moveTo(diagCenter + segWidth / 2 - inset, offsetY);
    this.ctx.lineTo(diagCenter + segWidth / 2 - inset, offsetY + arrowDepth);
    this.ctx.lineTo(diagCenter, offsetY + arrowDepth * 3);
    this.ctx.lineTo(diagCenter - segWidth / 2 + inset, offsetY + arrowDepth);
    this.ctx.lineTo(diagCenter - segWidth / 2 + inset, offsetY);

    this.ctx.stroke();
    this.ctx.fill();
  }

  drawInput(
    bottomLeftX: number,
    bottomRightX: number,
    offsetY: number,
    style: SEGMENT_STYLE
  ) {
    const { arrowDepth, arrowWidth, segHeight } = this.config;

    const inset = this.initPathWithInset(style);

    this.ctx.moveTo(0, segHeight / 2 + arrowWidth / 2 + offsetY);
    this.ctx.lineTo(arrowDepth, segHeight / 2 + offsetY);
    this.ctx.lineTo(0, segHeight / 2 - arrowWidth / 2 + offsetY);
    this.ctx.quadraticCurveTo(
      bottomRightX - inset,
      segHeight / 2 - arrowWidth / 2 + offsetY,
      bottomRightX - inset,
      segHeight + offsetY
    );
    this.styledLineTo(bottomLeftX + inset, segHeight + offsetY, style);
    this.ctx.quadraticCurveTo(
      bottomLeftX + inset,
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
    const { segHeight } = this.config;

    const inset = this.initPathWithInset(style);

    this.ctx.moveTo(upperLeftX + inset, offsetY);
    this.styledLineTo(upperRightX - inset, offsetY, style);
    this.ctx.bezierCurveTo(
      upperRightX - inset,
      offsetY + 0.4 * segHeight,
      lowerRightX - inset,
      offsetY + 0.6 * segHeight,
      lowerRightX - inset,
      offsetY + segHeight
    );
    this.styledLineTo(lowerLeftX + inset, offsetY + segHeight, style);
    this.ctx.bezierCurveTo(
      lowerLeftX + inset,
      offsetY + 0.6 * segHeight,
      upperLeftX + inset,
      offsetY + 0.4 * segHeight,
      upperLeftX + inset,
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
    const { arrowDepth, arrowWidth, diagWidth, segHeight } = this.config;

    const inset = this.initPathWithInset(style);

    this.ctx.moveTo(upperRightX - inset, 0 + offsetY);
    this.ctx.quadraticCurveTo(
      upperRightX - inset,
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
      upperLeftX + inset,
      segHeight / 2 + arrowWidth / 2 + offsetY,
      upperLeftX + inset,
      0 + offsetY
    );

    this.ctx.stroke();
    this.ctx.fill();
  }

  drawPseudoAddSubSegment(
    seg: SankeyPseudoAddSegment | SankeyPseudoSubSegment,
    offsetY: number
  ) {
    const { diagWidth, margin, segHeight } = this.config;
    const diagCenter = diagWidth / 2;
    const doubleMargin = margin * 2;

    if (seg.kind == SEGMENT_KIND.PSEUDO_SUB) {
      const outputWidth = seg.side.width * (diagWidth - doubleMargin);
      this.drawOutput(
        diagCenter - outputWidth / 2,
        diagCenter + outputWidth / 2,
        offsetY,
        seg.side.style
      );
    } else {
      const inputWidth = seg.side.width * (diagWidth - doubleMargin);
      this.drawInput(
        diagCenter - inputWidth / 2,
        diagCenter + inputWidth / 2,
        offsetY,
        seg.side.style
      );
    }

    if (seg.main) {
      const segWidth = seg.main.width * (diagWidth - doubleMargin);

      if (
        seg.main.style == SEGMENT_STYLE.STROKE &&
        seg.side.style == SEGMENT_STYLE.STROKE
      ) {
        // Clear "behind" main so that the side
        // does not shine through.
        this.ctx.clearRect(
          diagCenter - segWidth / 2,
          offsetY,
          segWidth,
          segHeight
        );
      }

      this.drawMain(
        diagCenter - segWidth / 2,
        diagCenter + segWidth / 2,
        diagCenter + segWidth / 2,
        diagCenter - segWidth / 2,
        offsetY,
        seg.main.style
      );
    }
  }

  drawSegment(seg: SankeySegment, offsetY: number) {
    if (seg.kind == SEGMENT_KIND.ADD || seg.kind == SEGMENT_KIND.SUB) {
      this.drawAddSubSegment(seg, offsetY);
    } else if (
      seg.kind == SEGMENT_KIND.PSEUDO_ADD ||
      seg.kind == SEGMENT_KIND.PSEUDO_SUB
    ) {
      this.drawPseudoAddSubSegment(seg, offsetY);
    } else if (seg.kind == SEGMENT_KIND.ENTRY) {
      this.drawEntrySegment(seg, offsetY);
    } else if (seg.kind == SEGMENT_KIND.EXIT) {
      this.drawExitSegment(seg, offsetY);
    }
  }

  drawSegments(segments: SankeySegment[], highlightIndex: number) {
    const { segHeight } = this.config;
    segments.forEach((seg, index) => {
      this._highlightCurrent = index == highlightIndex;
      this.drawSegment(seg, index * segHeight);
    });
  }

  initPathWithInset(style: SEGMENT_STYLE) {
    const { color, highlightColor, lineWidth } = this.config;

    const isStroke = style == SEGMENT_STYLE.STROKE;
    this.ctx.beginPath();
    this.ctx.strokeStyle = isStroke
      ? this._highlightCurrent
        ? highlightColor
        : color
      : 'transparent';
    this.ctx.lineWidth = isStroke ? lineWidth : 0;
    this.ctx.fillStyle = isStroke
      ? 'transparent'
      : this._highlightCurrent
      ? highlightColor
      : color;
    this.ctx.setLineDash([3, 3]);

    return isStroke ? lineWidth / 2 : 0;
  }

  /* Either draw, or just move to a new position, depending on whether
   * we are drawing a stroked or filled path.
   */
  styledLineTo(toX: number, toY: number, style: SEGMENT_STYLE) {
    if (style == SEGMENT_STYLE.FILL) {
      this.ctx.lineTo(toX, toY);
    } else {
      this.ctx.moveTo(toX, toY);
    }
  }
}
