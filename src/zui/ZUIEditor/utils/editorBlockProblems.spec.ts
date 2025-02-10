import editorBlockProblems from './editorBlockProblems';
import {
  BlockKind,
  BlockProblem,
  ButtonBlock,
  InlineNodeKind,
} from 'features/emails/types';

describe('editorBlockProblems()', () => {
  describe('checks if a button block has errors', () => {
    function mockButtonBlock(
      overrides?: Partial<ButtonBlock['data']>
    ): ButtonBlock {
      return {
        data: {
          href: 'http://www.zetkin.org/',
          tag: '1234abcd',
          text: 'Click me!',
          ...overrides,
        },
        kind: BlockKind.BUTTON,
      };
    }

    it('returns empty array when there is a correct url and a buttonText', () => {
      const errors = editorBlockProblems(mockButtonBlock());

      expect(errors.length).toEqual(0);
    });

    it('returns an array with a INVALID_BUTTON_URL error when there is an incorrect url', () => {
      const errors = editorBlockProblems(mockButtonBlock({ href: 'clara' }));

      expect(errors.length).toEqual(1);
      expect(errors[0]).toEqual(BlockProblem.INVALID_BUTTON_URL);
    });

    it('returns an array with an INVALID_BUTTON_URL error when url is missing', () => {
      const errors = editorBlockProblems(mockButtonBlock({ href: undefined }));

      expect(errors.length).toEqual(1);
      expect(errors[0]).toEqual(BlockProblem.INVALID_BUTTON_URL);
    });

    it('returns an array with a DEFAULT_BUTTON_TEXT error when the button text is missing', () => {
      const errors = editorBlockProblems(mockButtonBlock({ text: '' }));

      expect(errors.length).toEqual(1);
      expect(errors[0]).toEqual(BlockProblem.DEFAULT_BUTTON_TEXT);
    });

    it('returns an array with BUTTON_TEXT_MISSING error when button text exists but is only spaces or empty', () => {
      const errors = editorBlockProblems(mockButtonBlock({ text: '&nbsp;' }));
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual(BlockProblem.BUTTON_TEXT_MISSING);
    });
  });

  describe('checks if a paragraph block has errors', () => {
    it('returns an empty array if content does not contain any links', () => {
      const errors = editorBlockProblems({
        data: {
          content: [
            {
              kind: InlineNodeKind.STRING,
              value: 'This is our whole email. It is very short.',
            },
          ],
        },
        kind: BlockKind.PARAGRAPH,
      });

      expect(errors.length).toEqual(0);
    });

    it('returns an empty array if text contains a link with a correct href', () => {
      const errors = editorBlockProblems({
        data: {
          content: [
            {
              content: [
                {
                  content: [
                    {
                      kind: InlineNodeKind.STRING,
                      value: 'Click here!',
                    },
                  ],
                  href: 'http://www.zetkin.org',
                  kind: InlineNodeKind.LINK,
                  tag: 'abcdefgh',
                },
              ],
              kind: InlineNodeKind.BOLD,
            },
          ],
        },
        kind: BlockKind.PARAGRAPH,
      });

      expect(errors.length).toEqual(0);
    });

    it('returns an array with an INVALID_LINK_URL if the href does not have http://', () => {
      const errors = editorBlockProblems({
        data: {
          content: [
            {
              content: [
                {
                  kind: InlineNodeKind.STRING,
                  value: 'Click here!',
                },
              ],
              href: 'zetkin.org',
              kind: InlineNodeKind.LINK,
              tag: 'abcdefgh',
            },
          ],
        },
        kind: BlockKind.PARAGRAPH,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0]).toEqual(BlockProblem.INVALID_LINK_URL);
    });
  });
});
