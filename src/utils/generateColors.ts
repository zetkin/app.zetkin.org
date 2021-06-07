import randomSeed from 'random-seed';

export type SeededColorCombination = {
    bg: string;
    fg: string;
}

export function generateColors(seed: string): SeededColorCombination {
    const rand = randomSeed.create(seed.toString());
    const bgR = rand(256);
    const bgG = 0;
    const bgB = rand(256);
    let fgB = 255,
        fgG = 255,
        fgR = 255;

    // Use black text on light backgrounds (when color component
    // average is greater than 180).
    const bgAvg = (bgR + bgG + bgB) / 3.0;
    if (bgAvg > 180) {
        fgR = fgG = fgB = 0;
    }
    return {
        bg: `rgb(${bgR},${bgG},${bgB})`,
        fg: `rgb(${fgR},${fgG},${fgB})`,
    };
}