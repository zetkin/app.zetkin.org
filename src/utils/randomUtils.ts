/**
 * Deterministically generate random numbers using a Linear Congruential Generator (LCG). NOT SAFE for cryptography.
 * @param seed the initial seed
 * @returns A pseudo-random number in the interval [0, 1]
 */
export function makeDeterministicRNG(seed: number) {
  let state = seed;

  // Linear Congruential Generator (LCG), Numerical Recipes parameters: https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
  const LCG_MULTIPLIER = 1664525;
  const LCG_INCREMENT = 1013904223;
  const UINT32_MAX = 0xffffffff;

  return function nextUniform01() {
    // advance RNG state (32-bit wraparound)
    state = (state * LCG_MULTIPLIER + LCG_INCREMENT) >>> 0;

    return state / UINT32_MAX;
  };
}
