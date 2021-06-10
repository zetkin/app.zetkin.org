import randomSeed from 'random-seed';

export function generateRandomColor(seed: string): string {
    const rand = randomSeed.create(seed);
    const r = rand(256);
    //TODO: Temporarily limiting spectrum so it looks good
    const g = 0;
    const b = rand(256);

    const rgb = (r << 16) | (g << 8) | b;
    return `#${rgb.toString(16)}`;
}

export function getContrastColor(color: string):string {
    const bgColor = parseInt(color.slice(1), 16);
    const bgR = bgColor >> 16;
    const bgG = bgColor >> 8 & 255;
    const bgB = bgColor & 255;
    let fgB = 255, fgG = 255, fgR = 255;
    const bgAvg = (bgR + bgG + bgB) / 3.0;
    if (bgAvg > 150) {
        fgR = fgG = fgB = 0;
    }
    return '#' + ((fgR << 16) | (fgG << 8) | fgB)
        .toString(16).padStart(6, '0');
}