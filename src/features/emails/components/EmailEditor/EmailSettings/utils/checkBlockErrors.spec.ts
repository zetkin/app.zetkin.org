import { BLOCK_TYPES } from 'features/emails/types';
import { ButtonData } from '../../tools/Button';
import checkBlockErrors from './checkBlockErrors';

describe('checkBlockErrors()', () => {
  describe('checks if button block has errors', () => {
    const mockButtonData = (overrides?: Partial<ButtonData>) => {
      return {
        data: {
          buttonText: 'Click me!',
          url: 'http://www.clara.com',
          ...overrides,
        },
        type: BLOCK_TYPES.BUTTON,
      };
    };
    it('returns false when there is a correct url provided', () => {
      const hasErrors = checkBlockErrors(mockButtonData());

      expect(hasErrors).toEqual(false);
    });

    it('returns true when there is an incorrect url', () => {
      const hasErrors = checkBlockErrors(mockButtonData({ url: 'clara' }));

      expect(hasErrors).toEqual(true);
    });

    it('returns true when url is missing', () => {
      const hasErrors = checkBlockErrors(mockButtonData({ url: undefined }));

      expect(hasErrors).toEqual(true);
    });

    it('returns false when a button text is provided', () => {
      const hasErrors = checkBlockErrors(mockButtonData());

      expect(hasErrors).toEqual(false);
    });

    it('returns true when the button text is missing/falsy', () => {
      const hasErrors = checkBlockErrors(mockButtonData({ buttonText: '' }));

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
