/* eslint-disable sort-keys */
import mjml2html from 'mjml';

import renderEmailHtml from './renderEmailHtml';
import { ZetkinEmail } from 'utils/types/zetkin';

describe('renderEmailHtml', () => {
  it('returns MJML-rendered HTML for complex email', async () => {
    const email = mockEmail({
      subject: 'Hello',
      content: JSON.stringify({
        blocks: [
          {
            kind: 'image',
            data: {
              alt: 'Zetkin logo',
              src: 'https://zetkin.org/logo.png',
            },
          },
          {
            kind: 'header',
            data: {
              level: 1,
              content: [
                {
                  kind: 'string',
                  value: 'Hello, ',
                },
                {
                  kind: 'variable',
                  name: 'target.first_name',
                },
                {
                  kind: 'string',
                  value: '!',
                },
              ],
            },
          },
          {
            kind: 'paragraph',
            data: {
              // We want to invite your to[our **PARTY**](https://zetkin.org), {{target.first_name}}.
              content: [
                {
                  kind: 'string',
                  value: 'We want to invite you to ',
                },
                {
                  kind: 'link',
                  tag: 'thelink',
                  href: 'https://zetkin.org',
                  content: [
                    {
                      kind: 'string',
                      value: 'our ',
                    },
                    {
                      kind: 'bold',
                      content: [
                        {
                          kind: 'string',
                          value: 'PARTY',
                        },
                      ],
                    },
                  ],
                },
                {
                  kind: 'string',
                  value: ', ',
                },
                {
                  kind: 'variable',
                  name: 'target.first_name',
                },
              ],
            },
          },
          {
            kind: 'button',
            data: {
              href: 'https://zetkin.org',
              tag: 'thebutton',
              text: 'I want to come',
            },
          },
        ],
      }),
    });

    const output = renderEmailHtml(email, {
      'target.first_name': 'friend',
    });

    // The expected output is HTML as returned by MJML
    const expected = mjml2html({
      tagName: 'mjml',
      attributes: {},
      children: [
        {
          tagName: 'mj-body',
          attributes: {},
          children: [
            {
              tagName: 'mj-section',
              attributes: {},
              children: [
                {
                  tagName: 'mj-column',
                  attributes: {},
                  children: [
                    {
                      tagName: 'mj-image',
                      attributes: {
                        alt: 'Zetkin logo',
                        src: 'https://zetkin.org/logo.png',
                      },
                    },
                    {
                      tagName: 'mj-text',
                      attributes: {},
                      content: '<h1>Hello, friend!</h1>',
                    },
                    {
                      tagName: 'mj-text',
                      attributes: {},
                      content:
                        '<p>We want to invite you to <a class="email-link-thelink" href="https://zetkin.org">our <b>PARTY</b></a>, friend</p>',
                    },
                    {
                      tagName: 'mj-button',
                      attributes: {
                        'css-class': 'email-link-thebutton',
                        href: 'https://zetkin.org',
                      },
                      content: 'I want to come',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }).html;

    expect(output).toEqual(expected);
  });

  it('returns MJML-rendered HTML for email with frame', async () => {
    const email = mockEmail({
      subject: 'Hello',
      theme: {
        id: 0,
        block_attributes: {
          button: {
            'background-color': 'green',
            'font-size': '22px',
            padding: '20px',
          },
          image: {
            border: '2px solid black',
            padding: '10px',
          },
        },
        css: 'h1 { color: red; }',
        frame_mjml: {
          tagName: 'mj-wrapper',
          attributes: {},
          children: [
            {
              tagName: 'mj-section',
              attributes: {},
              children: [
                {
                  tagName: 'mj-column',
                  attributes: {},
                  children: [
                    {
                      tagName: 'placeholder',
                      attributes: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      content: JSON.stringify({
        blocks: [
          {
            kind: 'image',
            data: {
              alt: 'Zetkin logo',
              src: 'https://zetkin.org/logo.png',
            },
          },
          {
            kind: 'header',
            data: {
              level: 1,
              content: [
                {
                  kind: 'string',
                  value: 'Hello, you!',
                },
              ],
            },
          },
          {
            kind: 'paragraph',
            data: {
              content: [
                {
                  kind: 'string',
                  value: 'Welcome to the party!',
                },
              ],
            },
          },
          {
            kind: 'button',
            data: {
              href: 'https://zetkin.org',
              tag: 'thebutton',
              text: 'I want to come',
            },
          },
        ],
      }),
    });

    const output = renderEmailHtml(email, {});

    // The expected output is HTML as returned by MJML
    const expected = mjml2html({
      tagName: 'mjml',
      attributes: {},
      children: [
        {
          tagName: 'mj-head',
          attributes: {},
          children: [
            {
              tagName: 'mj-style',
              attributes: {},
              content: 'h1 { color: red; }',
            },
          ],
        },
        {
          tagName: 'mj-body',
          attributes: {},
          children: [
            {
              tagName: 'mj-wrapper',
              attributes: {},
              children: [
                {
                  tagName: 'mj-section',
                  attributes: {},
                  children: [
                    {
                      tagName: 'mj-column',
                      attributes: {},
                      children: [
                        {
                          tagName: 'mj-image',
                          attributes: {
                            alt: 'Zetkin logo',
                            border: '2px solid black',
                            padding: '10px',
                            src: 'https://zetkin.org/logo.png',
                          },
                        },
                        {
                          tagName: 'mj-text',
                          attributes: {},
                          content: '<h1>Hello, you!</h1>',
                        },
                        {
                          tagName: 'mj-text',
                          attributes: {},
                          content: '<p>Welcome to the party!</p>',
                        },
                        {
                          tagName: 'mj-button',
                          attributes: {
                            'background-color': 'green',
                            'css-class': 'email-link-thebutton',
                            'font-size': '22px',
                            href: 'https://zetkin.org',
                            padding: '20px',
                          },
                          content: 'I want to come',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }).html;

    expect(output).toEqual(expected);
  });

  it('sanitizes user inputs', async () => {
    const email = mockEmail({
      subject: '<script>alert(4)</script>',
      content: JSON.stringify({
        blocks: [
          {
            kind: 'paragraph',
            data: {
              // We want to invite your to[our **PARTY**](https://zetkin.org), {{target.first_name}}.
              content: [
                {
                  kind: 'string',
                  value: '<script>alert(1)</script>',
                },
                {
                  kind: 'variable',
                  name: 'target.first_name',
                },
                {
                  kind: 'link',
                  tag: '"><script>alert(4)</script>',
                  href: 'javascript:alert(1)',
                  content: [
                    {
                      kind: 'string',
                      value: 'link text',
                    },
                  ],
                },
              ],
            },
          },
          {
            kind: 'header',
            data: {
              level: '1> <script>alert(3)</script><h',
              content: [
                {
                  kind: 'string',
                  value: 'Hello, ',
                },
              ],
            },
          },
          {
            kind: 'button',
            data: {
              href: 'javascript:alert(2)',
              tag: 'tagbutton',
              text: 'button text',
            },
          },
        ],
      }),
    });

    const output = renderEmailHtml(email, {
      'target.first_name': '<script>alert(2)</script>',
    });

    // Test for inline scripts in paragraphs
    expect(output).toMatch(/.*&lt;script&gt;alert\(1\)&lt;\/script&gt;.*/);
    expect(output).not.toMatch(/.*<script>alert\(1\)<\/script>.*/);

    // Variables should be sanatized
    expect(output).toMatch(/.*&lt;script&gt;alert\(2\)&lt;\/script&gt;.*/);
    expect(output).not.toMatch(/.*<script>alert\(2\)<\/script>.*/);

    // Link tags should be sanatized
    expect(output).toMatch(/.*%22><script>alert\(4\)<\/script>.*/);
    expect(output).not.toMatch(/.*"><script>alert\(4\)<\/script>.*/);

    // The subject is not present in the email, but if it is in the future it should not contain javascript
    expect(output).not.toMatch(/.*<script>alert\(3\)<\/script>.*/);

    // `javascript:` scheme links are not allowed
    expect(output).not.toMatch(/.*javascript:alert\(1\).*/);
    expect(output).not.toMatch(/.*javascript:alert\(2\).*/);
  });
});

export default function mockEmail(
  overrides?: Partial<ZetkinEmail>
): ZetkinEmail {
  return {
    id: 1,
    campaign: null,
    config: {
      config: {},
      id: 1,
      no_reply: false,
      organization: {
        id: 1,
        title: 'Organization',
      },
      sender_email: 'info@example.com',
      sender_name: 'The Org',
    },
    content: '{ blocks: [] }',
    theme: null,
    locked: null,
    organization: {
      id: 1,
      title: 'Organization',
    },
    published: null,
    processed: null,
    subject: 'This is the subject',
    target: {
      id: 1,
      filter_spec: [],
      title: '',
    },
    title: '',
    ...overrides,
  };
}
