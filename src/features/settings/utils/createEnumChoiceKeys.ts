import createSlug from './createSlug';

const MAX_KEY_LENGTH = 40;

// Appends a suffix, making room for it within the maximum key length.
function withSuffix(base: string, number: number) {
  const suffix = `_${number}`;
  return (
    base.slice(0, MAX_KEY_LENGTH - suffix.length).replace(/_+$/, '') + suffix
  );
}

/**
 * Derives a unique, non-empty key for each of the given option labels.
 *
 * Keys follow the same rules as field slugs. Labels that produce no usable
 * characters fall back to "option_1", "option_2" and so on, and keys that
 * would collide are suffixed the same way, e.g. a second "Yes" becomes "yes_2".
 */
export default function createEnumChoiceKeys(labels: string[]) {
  const usedKeys = new Set<string>();

  return labels.map((label, index) => {
    const base = createSlug(label) || withSuffix('option', index + 1);

    let key = base;
    for (let attempt = 2; usedKeys.has(key); attempt++) {
      key = withSuffix(base, attempt);
    }

    usedKeys.add(key);
    return key;
  });
}
