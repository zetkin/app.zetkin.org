/**
 * Returns an array of numbers whos values match their index, beginning at 0
 * and ending with the provided number. Does not work for negative numbers.
 */
const range = (number: number): number[] => {
  return [...Array(number).keys()];
};

export default range;
