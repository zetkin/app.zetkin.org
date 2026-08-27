import slugify from 'slugify';

const DIGIT_NAMES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

const FALLBACK_KEY = 'option';
const MAX_KEY_LENGTH = 40;

// Spells out a number one digit at a time, e.g. 12 becomes "one_two".
function spellOut(number: number) {
  return String(number)
    .split('')
    .map((digit) => DIGIT_NAMES[parseInt(digit)])
    .join('_');
}

/**
 * Derives a key from an option label, using only the characters a-z and _.
 *
 * Unlike field slugs, which may contain digits, the API rejects enum option
 * keys that contain anything but a-z and _. Digits are therefore spelled out
 * rather than dropped, so that labels like "Joined 2016" and "Joined 2017"
 * don't end up with the same key.
 *
 * Returns an empty string for labels that contain nothing usable, e.g. "!!!"
 * or a label written in a script that slugify cannot transliterate.
 */
function keyFromLabel(label: string) {
  const spelledOut = label.replace(
    /[0-9]/g,
    (digit) => ` ${DIGIT_NAMES[parseInt(digit)]} `
  );

  const slugified = slugify(spelledOut.toLocaleLowerCase(), {
    //Removes any character that is not a-z, _ and " "
    remove: /[^a-z_ ]/,
    //Replaces spaces with "_"
    replacement: '_',
  });

  return trimUnderscores(slugified.replace(/_+/g, '_')).slice(
    0,
    MAX_KEY_LENGTH
  );
}

function trimUnderscores(key: string) {
  return key.replace(/^_+/, '').replace(/_+$/, '');
}

// Appends a suffix, making room for it within the maximum key length.
function withSuffix(base: string, number: number) {
  const suffix = `_${spellOut(number)}`;
  return (
    trimUnderscores(base.slice(0, MAX_KEY_LENGTH - suffix.length)) + suffix
  );
}

/**
 * Derives a unique, non-empty key for each of the given option labels.
 *
 * Labels that produce no usable characters fall back to "option_one",
 * "option_two" and so on, and keys that would collide are suffixed in the
 * same way, e.g. a second label keyed "yes" becomes "yes_two".
 */
export default function createEnumChoiceKeys(labels: string[]) {
  const usedKeys = new Set<string>();

  return labels.map((label, index) => {
    const base = keyFromLabel(label) || withSuffix(FALLBACK_KEY, index + 1);

    let key = base;
    let attempt = 2;
    while (usedKeys.has(key)) {
      key = withSuffix(base, attempt);
      attempt++;
    }

    usedKeys.add(key);
    return key;
  });
}
