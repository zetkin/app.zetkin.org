import { describe, expect, it } from '@jest/globals';

import hasEmailConflict, { normalizeEmail } from './hasEmailConflict';

describe('hasEmailConflict()', () => {
  it('returns false when the respondent has no email', () => {
    expect(hasEmailConflict(null, 'a@example.com')).toBe(false);
    expect(hasEmailConflict(undefined, null)).toBe(false);
    expect(hasEmailConflict('', 'a@example.com')).toBe(false);
  });

  it('returns true when the person has no email', () => {
    expect(hasEmailConflict('a@example.com', null)).toBe(true);
    expect(hasEmailConflict('a@example.com', '')).toBe(true);
  });

  it('returns false when emails match ignoring case', () => {
    expect(hasEmailConflict('A@Example.com', 'a@example.COM')).toBe(false);
  });

  it('returns false when emails match ignoring surrounding whitespace', () => {
    expect(hasEmailConflict('  a@example.com ', 'a@example.com')).toBe(false);
    expect(hasEmailConflict('a@example.com', '\ta@example.com\n')).toBe(false);
    expect(hasEmailConflict(' A@Example.com ', 'a@example.COM  ')).toBe(false);
  });

  it('treats whitespace-only emails as missing', () => {
    expect(hasEmailConflict('   ', 'a@example.com')).toBe(false);
    expect(hasEmailConflict('a@example.com', '   ')).toBe(true);
  });

  it('returns true when emails differ', () => {
    expect(hasEmailConflict('a@example.com', 'b@example.com')).toBe(true);
  });
});

describe('normalizeEmail()', () => {
  it('trims whitespace and lowercases', () => {
    expect(normalizeEmail('  A@Example.COM\n')).toBe('a@example.com');
  });

  it('returns an empty string for missing emails', () => {
    expect(normalizeEmail(null)).toBe('');
    expect(normalizeEmail(undefined)).toBe('');
  });
});
