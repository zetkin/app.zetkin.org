import { getContrastColor } from './colorUtils';

describe('getContrastColor()', () => {
  it('returns black on light', () => {
    const result = getContrastColor('#ffcc00');
    expect(result).toEqual('#000000');
  });

  it('returns white on dark', () => {
    const result = getContrastColor('#8d52f8');
    expect(result).toEqual('#ffffff');
  });
});
