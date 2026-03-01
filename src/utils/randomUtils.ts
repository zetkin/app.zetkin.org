export function toHash(str: string): number {
  return str.split('').reduce((hash, char) => {
    return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
  }, 0);
}

export function getRandom(seed: number = 1) {
  const a = 1103515245; // LCG multiplier
  const c = 12345; // LCG increment
  const m = 2 ** 31; // Modulus (2^31)

  return function () {
    seed = (a * seed + c) % m; // Update seed
    return seed / m; // Return in [0, 1)
  };
}
