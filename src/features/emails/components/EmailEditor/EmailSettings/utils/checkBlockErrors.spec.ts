import { BLOCK_TYPES } from 'features/emails/types';
import checkBlockErrors from './checkBlockErrors';

describe('checkBlockErrors()', () => {
  describe('checks if button block has errors', () => {
    it('returns false when there is a correct url provided', () => {
      const hasErrors = checkBlockErrors({
        data: { url: 'http://www.clara.com' },
        type: BLOCK_TYPES.BUTTON,
      });

      expect(hasErrors).toEqual(false);
    });

    it('returns true when there is an incorrect url', () => {
      const hasErrors = checkBlockErrors({
        data: { url: 'clara' },
        type: BLOCK_TYPES.BUTTON,
      });

      expect(hasErrors).toEqual(true);
    });

    it('returns true when url is missing', () => {
      const hasErrors = checkBlockErrors({
        data: { url: undefined },
        type: BLOCK_TYPES.BUTTON,
      });

      expect(hasErrors).toEqual(true);
    });

    it('returns true when data is empty', () => {
      const hasErrors = checkBlockErrors({
        data: {},
        type: BLOCK_TYPES.BUTTON,
      });

      expect(hasErrors).toEqual(true);
    });
  });
});
