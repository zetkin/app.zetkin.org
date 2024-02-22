import { BLOCK_TYPES } from 'features/emails/types';
import blockHasErrors from './blockHasErrors';
import { ButtonData } from '../../tools/Button';
import { OutputBlockData } from '@editorjs/editorjs';
import { TextBlockData } from '../TextBlockListItem';

describe('blockHasErrors()', () => {
  describe('checks if button block has errors', () => {
    function mockButtonData(
      overrides?: Partial<ButtonData>
    ): OutputBlockData<BLOCK_TYPES.BUTTON, ButtonData> {
      return {
        data: {
          buttonText: 'Click me!',
          url: 'http://www.clara.com',
          ...overrides,
        },
        type: BLOCK_TYPES.BUTTON,
      };
    }

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

  describe('checks if text block has errors', () => {
    function mockTextData(
      overrides?: Partial<TextBlockData>
    ): OutputBlockData<BLOCK_TYPES.PARAGRAPH, TextBlockData> {
      return {
        data: {
          text: 'Hello Clara!',
          ...overrides,
        },
        type: BLOCK_TYPES.PARAGRAPH,
      };
    }

    it('returns false if text does not contain any anchor tags', () => {
      const hasErrors = blockHasErrors(mockTextData());

      expect(hasErrors).toEqual(false);
    });

    it('returns false if text contains an anchor with no classes', () => {
      const hasErrors = blockHasErrors(
        mockTextData({
          text: 'Hello <a href="http://www.clara.com">Clara</a>"',
        })
      );

      expect(hasErrors).toEqual(false);
    });

    it('returns false if text contains an anchor with unrelated classes', () => {
      const hasErrors = blockHasErrors(
        mockTextData({
          text: 'Hello <a class="unrelatedClass andAnother" href="http://www.clara.com">Clara</a>"',
        })
      );

      expect(hasErrors).toEqual(false);
    });

    it('returns true if text contains an anchor with the class hasInvalidUrl', () => {
      const hasErrors = blockHasErrors(
        mockTextData({
          text: 'Hello <a class="hasInvalidUrl" href="http://www.clara.com">Clara</a>"',
        })
      );

      expect(hasErrors).toEqual(true);
    });
  });
});
