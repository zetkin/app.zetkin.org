import deliveryProblems from './deliveryProblems';
import { ZetkinEmail } from 'utils/types/zetkin';
import { BLOCK_TYPES, DeliveryProblem } from '../types';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';

const mockEmailContent = JSON.stringify({
  blocks: [
    {
      data: {
        level: 1,
        text: 'Hello <span contenteditable="false" style="background-color: rgba(0, 0, 0, 0.1); padding: 0.1em 0.5em; border-radius: 1em; display: inline-block;" data-slug="first_name">First name</span>!',
      },
      id: 'afcJCL8gA8',
      type: 'header',
    },
  ],
});

const mockEmail = (emailOverrides?: Partial<ZetkinEmail>): ZetkinEmail => {
  return {
    campaign: { id: 1, title: 'First project' },
    content: mockEmailContent,
    frame: {
      id: 1,
    },
    id: 1,
    locked: '2024-02-26T12:27:32.237413',
    organization: { id: 1, title: 'My Organization' },
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
                //Invalid url
                text: `Welcome new member, <a href="blipblop">this is a link with an invalid url</a><br>`,
              },
              id: 'w09wrejf',
              type: BLOCK_TYPES.PARAGRAPH,
            },
            {
              data: {
                //No buttonText property
                //Invalid url
                url: 'angela',
              },
              id: 'sldkf8ew98',
              type: BLOCK_TYPES.BUTTON,
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
