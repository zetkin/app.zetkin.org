import { lighten } from '@mui/material';
import { StyleImageInterface } from 'maplibre-gl';

export default class ClusterImageRenderer implements StyleImageInterface {
  private _color: string;
  private _context: CanvasRenderingContext2D | null;
  private _rendered: boolean;
  private _successPercentage: number;
  private _visitPercentage: number;

  constructor(
    successPercentage: number,
    visitPercentage: number,
    color: string
  ) {
    this.width = this.height = 50;
    this.data = new Uint8ClampedArray(this.width * this.height * 4);

    this._color = color;
    this._rendered = false;
    this._successPercentage = successPercentage;
    this._visitPercentage = visitPercentage;

    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this._context = canvas.getContext('2d');
  }

  data: Uint8ClampedArray;
  height: number;

  render(): boolean {
    const successRatio = this._successPercentage / 100;
    const visitRatio = this._visitPercentage / 100;

    if (this._rendered) {
      return false;
    }

    const context = this._context;
    if (!context) {
      return false;
    }

    const mid = this.width / 2;
    const radius = mid - 3;

    const angleOffsetToTop = -Math.PI / 2;

    context.beginPath();
    context.fillStyle = '#ffffff';
    context.ellipse(mid, mid, mid, mid, 0, Math.PI * 2, 0);
    context.fill();

    context.beginPath();
    context.arc(
      mid,
      mid,
      radius,
      0 + angleOffsetToTop,
      visitRatio * Math.PI * 2 + angleOffsetToTop
    );
    context.strokeStyle = lighten(this._color, 0.7);
    context.lineWidth = 4;
    context.stroke();

    context.beginPath();
    context.arc(
      mid,
      mid,
      radius,
      0 + angleOffsetToTop,
      successRatio * Math.PI * 2 + angleOffsetToTop
    );
    context.strokeStyle = this._color;
    context.lineWidth = 4;
    context.stroke();

    this.data = context.getImageData(0, 0, this.width, this.height).data;

    this._rendered = true;

    return true;
  }

  width: number;
}
