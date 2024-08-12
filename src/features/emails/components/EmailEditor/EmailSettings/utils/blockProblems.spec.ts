import { OutputBlockData } from '@editorjs/editorjs';

import blockProblems from './blockProblems';
import { ButtonData } from '../../tools/Button';
import { TextBlockData } from '../TextBlockListItem';
import { BLOCK_TYPES, BlockProblem } from 'features/emails/types';

describe('blockProblems()', () => {
  describe('checks if button block has errors', () => {
    function mockButtonData(
      overrides?: Partial<ButtonData>
    ): OutputBlockData<BLOCK_TYPES.BUTTON, ButtonData> {
      return {
        data: {
          buttonText: 'Click me!',
          tag: 'snviosek',
          url: 'http://www.clara.com',
          ...overrides,
        },
        type: BLOCK_TYPES.BUTTON,
      };
    }

    it('returns empty array when there is a correct url and a buttonText', () => {
      const errors = blockProblems(mockButtonData());

      expect(errors.length).toEqual(0);
    });

    it('returns an array with a INVALID_BUTTON_URL error when there is an incorrect url', () => {
      const errors = blockProblems(mockButtonData({ url: 'clara' }));

      expect(errors.length).toEqual(1);
      expect(errors[0]).toEqual(BlockProblem.INVALID_BUTTON_URL);
    });

    it('returns an array with an INVALID_BUTTON_URL error when url is missing', () => {
      const errors = blockProblems(mockButtonData({ url: undefined }));

      expect(errors.length).toEqual(1);
      expect(errors[0]).toEqual(BlockProblem.INVALID_BUTTON_URL);
    });

    it('returns an array with a DEFAULT_BUTTON_TEXT error when the button text is missing/falsy', () => {
      const errors = blockProblems(mockButtonData({ buttonText: '' }));

      expect(errors.length).toEqual(1);
      expect(errors[0]).toEqual(BlockProblem.DEFAULT_BUTTON_TEXT);
    });
  });

  describe('checks if a paragraph block has errors', () => {
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

    it('returns an empty array if text does not contain any anchor tags', () => {
      const errors = blockProblems(mockTextData());

      expect(errors.length).toEqual(0);
    });

    it('returns an empty array if text contains an anchor tag with a correctly formatted url', () => {
      const errors = blockProblems(
        mockTextData({
          text: 'Hello <a href="http://www.clara.com">Clara</a>"',
        })
      );

      expect(errors.length).toEqual(0);
    });

    it('returns an array with an INVALID_LINK_URL if the href of the anchor tag does not have "http://', () => {
      const errors = blockProblems(
        mockTextData({
          text: 'Hello <a href="www.clara.com">Clara</a>"',
        })
      );

      expect(errors.length).toEqual(1);
      expect(errors[0]).toEqual(BlockProblem.INVALID_LINK_URL);
    });

    it('returns an array with an INVALID_LINK_URL if the anchor tag does not have an href attribute', () => {
      const errors = blockProblems(
        mockTextData({
          text: 'Hello <a>Clara</a>"',
        })
      );

      expect(errors.length).toEqual(1);
      expect(errors[0]).toEqual(BlockProblem.INVALID_LINK_URL);
    });
  });
});
