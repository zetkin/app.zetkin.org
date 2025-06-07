import { lighten } from '@mui/material';
import { StyleImageInterface } from 'maplibre-gl';

export default class MarkerImageRenderer implements StyleImageInterface {
  private _color: string;
  private _context: CanvasRenderingContext2D | null;
  private _rendered: boolean;
  private _selected: boolean;
  private _successPercentage: number;
  private _text?: string;
  private _visitPercentage: number;

  constructor(
    successPercentage: number,
    visitPercentage: number,
    selected: boolean,
    color: string,
    text?: string
  ) {
    this.width = 21;
    this.height = 30;
    this.data = new Uint8ClampedArray(this.width * this.height * 4);

    this._color = color;
    this._selected = selected;
    this._rendered = false;
    this._successPercentage = successPercentage;
    this._text = text;
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
      'M10.5 0C4.695 0 0 4.695 0 10.5C0 18.375 10.5 30 10.5 30C10.5 30 21 18.375 21 10.5C21 4.695 16.305 0 10.5 0Z'
    );
    const pinInteriorPath = new Path2D(
      'M10.5 3C6 3 3 6.5 3 10.5C3 16 10.5 27 10.5 27C10.5 27 18 16 18 10.5C18 6.5 15 3 10.5 3Z'
    );

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

    if (this._text) {
      context.fillStyle = this._color;
      context.font = 'bold 12px sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(this._text, this.width / 2, this.height / 2);
    }

    this.data = context.getImageData(0, 0, this.width, this.height).data;

    this._rendered = true;

    return true;
  }

  width: number;
}
