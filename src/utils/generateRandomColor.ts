import randomSeed from 'random-seed';

export function generateRandomColor(seed: string): string {
    const rand = randomSeed.create(seed);
    const r = rand(256);
    const g = 0; //temporarily limit the color range so it looks good
    const b = rand(256);

    const rgb = (r << 16) | (g << 8) | b;
    return `#${rgb.toString(16)}`;
}