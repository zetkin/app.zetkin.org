import { StyleImageInterface } from 'maplibre-gl';

export function markerImage(
  color: string,
  invert: boolean = false,
  text?: string
): StyleImageInterface {
  const width = 21;
  const height = 30;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  if (!context) {
    return {
      data: new Uint8ClampedArray(width * height * 4),
      height,
      width,
    };
  }

  const pinOutlinePath = new Path2D(
    'M10.5 0C4.695 0 0 4.695 0 10.5C0 18.375 10.5 30 10.5 30C10.5 30 21 18.375 21 10.5C21 4.695 16.305 0 10.5 0Z'
  );
  const pinInteriorPath = new Path2D(
    'M10.5 3C6 3 3 6.5 3 10.5C3 16 10.5 27 10.5 27C10.5 27 18 16 18 10.5C18 6.5 15 3 10.5 3Z'
  );

  context.fillStyle = !invert ? color : '#ffffff';
  context.fill(pinOutlinePath);

  context.clip(pinInteriorPath);

  context.fillStyle = invert ? color : '#ffffff';
  context.fillRect(0, 0, width, height);

  if (text) {
    context.fillStyle = !invert ? color : '#ffffff';
    context.font = 'bold 12px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, width / 2, height / 2);
  }

  return {
    data: context.getImageData(0, 0, width, height).data,
    height,
    width,
  };
}
