import { isUndefined, omitBy } from 'lodash';

/**
 * Omits properties with `undefined` values from an object.
 *
 * @param obj - The object to process.
 * @returns A new object with all properties that have `undefined` values removed.
 */
export const omitUndefined = (
  obj: Record<string, unknown>
): Record<string, unknown> => omitBy(obj, isUndefined);
