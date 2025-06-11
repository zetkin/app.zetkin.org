import { lighten } from '@mui/material';
import { StyleImageInterface } from 'maplibre-gl';

export default class MarkerImageRenderer implements StyleImageInterface {
  private _color: string;
  private _context: CanvasRenderingContext2D | null;
  private _rendered: boolean;
  private _selected: boolean;
  private _successPercentage: number;
  private _visitPercentage: number;

  constructor(
    successPercentage: number,
    visitPercentage: number,
    selected: boolean,
    color: string
  ) {
    this.width = 23;
    this.height = 32;
    this.data = new Uint8ClampedArray(this.width * this.height * 4);

    this._color = color;
    this._selected = selected;
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

    const successHeight = successRatio * this.width;
    const visitHeight = visitRatio * this.height;

    if (this._rendered) {
      return false;
    }

    const context = this._context;
    if (!context) {
      return false;
    }

    const pinOutlinePath = new Path2D(
      'M11.5 1C5.695 1 1 5.695 1 11.5C1 19.375 11.5 31 11.5 31C11.5 31 22 19.375 22 11.5C21 5.695 17.305 1 11.5 1Z'
    );
    const pinInteriorPath = new Path2D(
      'M11.5 4C7 4 4 7.5 4 11.5C4 17 11.5 28 11.5 28C11.5 28 19 17 19 11.5C19 7.5 16 4 11.5 4Z'
    );

    context.strokeStyle = 'rgba(0,0,0,0.15)';
    context.lineWidth = 2;
    context.stroke(pinOutlinePath);

    context.fillStyle = this._selected ? this._color : '#ffffff';
    context.fill(pinOutlinePath);

    context.clip(pinInteriorPath);

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, this.width, this.height);

    context.fillStyle = lighten(this._color, 0.7);
    context.fillRect(0, this.height - visitHeight, this.height, visitHeight);

    context.fillStyle = this._color;
    context.fillRect(
      0,
      this.height - successHeight,
      this.height,
      successHeight
    );

    this.data = context.getImageData(0, 0, this.width, this.height).data;

    this._rendered = true;

    return true;
  }

  width: number;
}
