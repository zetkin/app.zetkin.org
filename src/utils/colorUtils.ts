import randomSeed from 'random-seed';

export function generateRandomColor(seed: string): string {
  const rand = randomSeed.create(seed);
  const r = rand(256);
  //TODO: Temporarily limiting spectrum so it looks good
  const g = 0;
  const b = rand(256);

  const rgb = (r << 16) | (g << 8) | b;
  return `#${rgb.toString(16).padStart(6, '0')}`;
}

export function getContrastColor(color: string): string {
  const bgColor = parseInt(color.slice(1), 16);
  const bgR = (bgColor >> 16) / 255;
  const bgG = ((bgColor >> 8) & 255) / 255;
  const bgB = (bgColor & 255) / 255;
  const luma = 0.299 * bgR + 0.587 * bgG + 0.0722 * bgB;
  let fgB = 255,
    fgG = 255,
    fgR = 255;

  if (luma > 0.5) {
    fgR = fgG = fgB = 0;
  }

  return '#' + ((fgR << 16) | (fgG << 8) | fgB).toString(16).padStart(6, '0');
}
