import deliveryProblems from './deliveryProblems';
import { ZetkinEmail } from 'utils/types/zetkin';
import { BlockKind, DeliveryProblem, InlineNodeKind } from '../types';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';

const mockEmailContent = JSON.stringify({
  blocks: [
    {
      data: {
        content: [
          {
            kind: InlineNodeKind.STRING,
            value: 'Hello, ',
          },
          {
            kind: InlineNodeKind.VARIABLE,
            name: 'target.first_name',
          },
          {
            kind: InlineNodeKind.STRING,
            value: '!',
          },
        ],
        level: 1,
      },
      kind: BlockKind.HEADER,
    },
  ],
});

const mockEmail = (emailOverrides?: Partial<ZetkinEmail>): ZetkinEmail => {
  return {
    campaign: { id: 1, title: 'First project' },
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
    content: mockEmailContent,
    id: 1,
    locked: '2024-02-26T12:27:32.237413',
    organization: { id: 1, title: 'My Organization' },
    processed: null,
    published: null,
    subject: 'Hello new member!',
    target: {
      filter_spec: [
        { config: {}, op: OPERATION.ADD, type: FILTER_TYPE.ALL },
        {
          config: { fields: { first_name: 'a' } },
          op: OPERATION.SUB,
          type: FILTER_TYPE.PERSON_DATA,
        },
      ],
      id: 123,
      ...emailOverrides?.target,
    },
    theme: { frame_mjml: null, id: 1 },
    title: 'Welcome email for new members',
    ...emailOverrides,
  };
};

describe('deliveryProblems()', () => {
  it('returns an empty array for a correctly formated email with all data.', () => {
    const problems = deliveryProblems(mockEmail());
    expect(problems.length).toEqual(0);
  });

  it('returns an array with errors for an email with errors', () => {
    const problems = deliveryProblems(
      mockEmail({
        content: JSON.stringify({
          blocks: [
            {
              data: {
                //No button text
                //Invalid url
                href: 'angela',
                tag: '21232a5f',
              },
              kind: BlockKind.BUTTON,
            },
            {
              data: {
                //Invalid url
                content: [
                  {
                    kind: InlineNodeKind.STRING,
                    value: 'Welcome, new member! ',
                  },
                  {
                    content: [
                      {
                        kind: InlineNodeKind.STRING,
                        value: 'This is a link with an invalid URL.',
                      },
                    ],
                    href: 'blipblop',
                    kind: InlineNodeKind.LINK,
                    tag: '24712a5c',
                  },
                  {
                    kind: InlineNodeKind.STRING,
                    value: 'We look forward to meeting you soon!',
                  },
                ],
              },
              kind: BlockKind.PARAGRAPH,
            },
          ],
        }),
        locked: null,
        subject: null,
        target: { filter_spec: [], id: 123 },
      })
    );

    expect(problems.length).toEqual(4);
    expect(problems[0]).toEqual(DeliveryProblem.CONTENT_ERROR);
    expect(problems[1]).toEqual(DeliveryProblem.NO_SUBJECT);
    expect(problems[2]).toEqual(DeliveryProblem.NOT_TARGETED);
    expect(problems[3]).toEqual(DeliveryProblem.TARGETS_NOT_LOCKED);
  });

  it('returns an array with a EMPTY error if there is no content in the email', () => {
    const problems = deliveryProblems(
      mockEmail({ content: JSON.stringify({ blocks: [] }) })
    );

    expect(problems.length).toEqual(1);
    expect(problems[0]).toEqual(DeliveryProblem.EMPTY);
  });
});
