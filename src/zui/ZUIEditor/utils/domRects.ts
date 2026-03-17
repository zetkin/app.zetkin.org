export function areDOMRectRecordsEqual(
  a: Record<string, DOMRect> | null,
  b: Record<string, DOMRect> | null,
  epsilon = 0.0001
): boolean {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    if (!(key in b)) {
      return false;
    }

    const rectA = a[key];
    const rectB = b[key];

    const numbersA = [
      rectA.x,
      rectA.y,
      rectA.width,
      rectA.height,
      rectA.top,
      rectA.left,
      rectA.bottom,
      rectA.right,
    ];
    const numbersB = [
      rectB.x,
      rectB.y,
      rectB.width,
      rectB.height,
      rectB.top,
      rectB.left,
      rectB.bottom,
      rectB.right,
    ];

    for (let i = 0; i < numbersA.length; i++) {
      if (Math.abs(numbersA[i] - numbersB[i]) > epsilon) {
        return false;
      }
    }
  }

  return true;
}
