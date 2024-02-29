import { InlineNodeKind } from '../types';
import inlineNodesToHtml from './inlineNodesToHtml';

describe('inlineNodesToHtml()', () => {
  it('returns an empty string when passed an empty array', () => {
    const html = inlineNodesToHtml([]);

    expect(html).toEqual('');
  });

  it('converts String nodes', () => {
    const html = inlineNodesToHtml([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email. It is very short.',
      },
    ]);

    expect(html).toEqual('This is our whole email. It is very short.');
  });

  it('converts Bold nodes', () => {
    const html = inlineNodesToHtml([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our ',
      },
      {
        content: [
          {
            kind: InlineNodeKind.STRING,
            value: 'whole email',
          },
        ],
        kind: InlineNodeKind.BOLD,
      },
      {
        kind: InlineNodeKind.STRING,
        value: '. It is very short.',
      },
    ]);

    expect(html).toEqual('This is our <b>whole email</b>. It is very short.');
  });

  it('converts Italic nodes', () => {
    const html = inlineNodesToHtml([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email. It is ',
      },
      {
        content: [
          {
            kind: InlineNodeKind.STRING,
            value: 'very short.',
          },
        ],
        kind: InlineNodeKind.ITALIC,
      },
    ]);

    expect(html).toEqual('This is our whole email. It is <i>very short.</i>');
  });

  it('converts LineBreak nodes', () => {
    const html = inlineNodesToHtml([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email.',
      },
      { kind: InlineNodeKind.LINE_BREAK },
      {
        kind: InlineNodeKind.STRING,
        value: 'It is very short.',
      },
    ]);

    expect(html).toEqual('This is our whole email.<br>It is very short.');
  });

  it('converts Variable nodes', () => {
    const html = inlineNodesToHtml([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email, ',
      },
      {
        kind: InlineNodeKind.VARIABLE,
        name: 'target.first_name',
      },
      {
        kind: InlineNodeKind.STRING,
        value: '. It is very short.',
      },
    ]);

    expect(html).toEqual(
      'This is our whole email, <span contenteditable="false" style="background-color: rgba(0, 0, 0, 0.1); padding: 0.1em 0.5em; border-radius: 1em; display: inline-block;" data-slug="target.first_name">First name</span>. It is very short.'
    );
  });

  it('converts Link nodes', () => {
    const html = inlineNodesToHtml([
      {
        kind: InlineNodeKind.STRING,
        value: 'This is our whole email. ',
      },
      {
        content: [
          {
            kind: InlineNodeKind.STRING,
            value: 'It',
          },
        ],
        href: 'http://zetkin.org/',
        kind: InlineNodeKind.LINK,
        tag: '24712a5c',
      },
      {
        kind: InlineNodeKind.STRING,
        value: ' is very short.',
      },
    ]);

    expect(html).toEqual(
      'This is our whole email. <a class="inlineLink" href="http://zetkin.org/" data-tag="24712a5c">It</a> is very short.'
    );
  });

  it('converts an array of nested nodes of different kinds', () => {
    const html = inlineNodesToHtml([
      {
        kind: InlineNodeKind.STRING,
        value: 'Th',
      },
      {
        content: [
          {
            kind: InlineNodeKind.STRING,
            value: 'is is our ',
          },
        ],
        kind: InlineNodeKind.ITALIC,
      },
      {
        content: [
          {
            content: [
              {
                kind: InlineNodeKind.STRING,
                value: 'w',
              },
              {
                content: [
                  {
                    kind: InlineNodeKind.STRING,
                    value: 'h',
                  },
                ],
                kind: InlineNodeKind.BOLD,
              },
            ],
            kind: InlineNodeKind.ITALIC,
          },
          {
            kind: InlineNodeKind.STRING,
            value: 'ole email.',
          },
          {
            content: [
              {
                kind: InlineNodeKind.STRING,
                value: ' It is very',
              },
            ],
            kind: InlineNodeKind.BOLD,
          },
        ],
        href: 'http://zetkin.org/',
        kind: InlineNodeKind.LINK,
        tag: '3849acf1',
      },
      {
        content: [
          {
            kind: InlineNodeKind.STRING,
            value: ' shor',
          },
        ],
        kind: InlineNodeKind.BOLD,
      },
      {
        kind: InlineNodeKind.STRING,
        value: 't.',
      },
    ]);

    expect(html).toEqual(
      'Th<i>is is our </i><a class="inlineLink" href="http://zetkin.org/" data-tag="3849acf1"><i>w<b>h</b></i>ole email.<b> It is very</b></a><b> shor</b>t.'
    );
  });
});
