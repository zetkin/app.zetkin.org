import { BLOCK_TYPES } from 'features/emails/types';
import blockHasErrors from './blockHasErrors';
import { ButtonData } from '../../tools/Button';

describe('blockHasErrors()', () => {
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
      const hasErrors = blockHasErrors(mockButtonData());

      expect(hasErrors).toEqual(false);
    });

    it('returns true when there is an incorrect url', () => {
      const hasErrors = blockHasErrors(mockButtonData({ url: 'clara' }));

      expect(hasErrors).toEqual(true);
    });

    it('returns true when url is missing', () => {
      const hasErrors = blockHasErrors(mockButtonData({ url: undefined }));

      expect(hasErrors).toEqual(true);
    });

    it('returns false when a button text is provided', () => {
      const hasErrors = blockHasErrors(mockButtonData());

      expect(hasErrors).toEqual(false);
    });

    it('returns true when the button text is missing/falsy', () => {
      const hasErrors = blockHasErrors(mockButtonData({ buttonText: '' }));

      expect(hasErrors).toEqual(true);
    });

    it('returns true when data is empty', () => {
      const hasErrors = blockHasErrors({
        data: {},
        type: BLOCK_TYPES.BUTTON,
      });

      expect(hasErrors).toEqual(true);
    });
  });
});
