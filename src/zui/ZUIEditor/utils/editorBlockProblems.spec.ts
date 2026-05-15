import { describe, expect, it } from '@jest/globals';
import { RemirrorJSON } from 'remirror';

import editorBlockProblems, { BlockProblem } from './editorBlockProblems';
import { ButtonBlock } from 'features/emails/types';
import {
  MarkType,
  RemirrorBlockType,
  TextBlockContentType,
} from 'zui/ZUIEditor/types';

describe('editorBlockProblems()', () => {
  describe('checks if a button block has errors', () => {
    function mockButtonBlock(
      overrides?: Partial<ButtonBlock['data']>
    ): RemirrorJSON {
      return {
        attrs: {
          href:
            overrides && 'href' in overrides
              ? overrides.href
              : 'http://www.zetkin.org/',
        },
        content: [
          {
            text:
              overrides && 'text' in overrides ? overrides.text : 'Click me!',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.BUTTON,
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

    it('returns an array with a DEFAULT_BUTTON_TEXT error when the button text is the default text', () => {
      const errors = editorBlockProblems(
        mockButtonBlock({ text: 'Button text' }),
        'Button text'
      );
      expect(errors.length).toEqual(1);
      expect(errors[0]).toEqual(BlockProblem.DEFAULT_BUTTON_TEXT);
    });

    it('returns an array with BUTTON_TEXT_MISSING error when button text exists but is only spaces or empty', () => {
      const errors1 = editorBlockProblems(mockButtonBlock({ text: '&nbsp;' }));
      const errors2 = editorBlockProblems(mockButtonBlock({ text: '' }));
      expect(errors1).toHaveLength(1);
      expect(errors2).toHaveLength(1);
      expect(errors1[0]).toEqual(BlockProblem.BUTTON_TEXT_MISSING);
      expect(errors2[0]).toEqual(BlockProblem.BUTTON_TEXT_MISSING);
    });
  });

  describe('checks if a paragraph block has errors', () => {
    it('returns an empty array if content does not contain any links', () => {
      const errors = editorBlockProblems({
        content: [
          {
            text: 'This is our whole email. It is very short.',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.PARAGRAPH,
      });

      expect(errors.length).toEqual(0);
    });

    it('returns an empty array if text contains a link with a correct href', () => {
      const errors = editorBlockProblems({
        content: [
          {
            marks: [
              { type: MarkType.BOLD },
              { attrs: { href: 'http://www.zetkin.org' }, type: MarkType.LINK },
            ],
            text: 'Click here!',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.PARAGRAPH,
      });

      expect(errors.length).toEqual(0);
    });

    it('returns an array with an INVALID_LINK_URL if the href does not have http://', () => {
      const errors = editorBlockProblems({
        content: [
          {
            marks: [
              {
                attrs: {
                  href: 'zetkin.org',
                },
                type: MarkType.LINK,
              },
            ],
            text: 'Click here!',
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.PARAGRAPH,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0]).toEqual(BlockProblem.INVALID_LINK_URL);
    });
  });
});
