import 'next-router-mock/dynamic-routes';
import dayjs from 'dayjs';
import mockRouter from 'next-router-mock';

import mockUpdate from 'utils/testing/mocks/mockUpdate';
import { UPDATE_TYPES } from 'zui/ZUITimeline/types';
import { fireEvent, render } from 'utils/testing';
import ZUITimeline, { SHOW_INITIALLY, ZUITimelineProps } from 'zui/ZUITimeline';

import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import messageIds from './l10n/messageIds';

jest.mock('remark-parse', () => null);
jest.mock('remark-gfm', () => null);
jest.mock('unified', () => null);

mockRouter.useParser(
  createDynamicRouteParser(['/organize/[orgId]/people/[id]'])
);
jest.mock('next/dist/client/router', () => require('next-router-mock'));
jest.mock('isomorphic-dompurify', () => ({
  sanitize: (dirtyHtml: string) => dirtyHtml,
}));

const NUM_UPDATES = 10;

const props: ZUITimelineProps = {
  onAddNote: () => null,
  onEditNote: () => null,
  updates: Array.from(Array(NUM_UPDATES).keys()).map(() =>
    mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE, {
      timestamp: dayjs()
        .subtract(Math.random() * 100, 'hours')
        .format(),
    })
  ),
};

describe('ZUITimeline', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/initial');
  });

  it('displays all updates', () => {
    const { getAllByLabelText } = render(<ZUITimeline {...props} />);
    const updates = getAllByLabelText('timeline update');
    expect(
      updates.filter(
        (update) => getComputedStyle(update).visibility === 'visible'
      ).length
    ).toEqual(NUM_UPDATES);
  });

  it('if expandable, expands to show all updates', () => {
    const { getAllByLabelText, getByMessageId } = render(
      <ZUITimeline {...props} expandable={true} />
    );
    const updatesBefore = getAllByLabelText('timeline update');
    expect(
      updatesBefore.filter(
        (update) => getComputedStyle(update).visibility === 'visible'
      ).length
    ).toEqual(SHOW_INITIALLY);
    const showMore = getByMessageId(messageIds.expand);
    fireEvent.click(showMore);
    const updates = getAllByLabelText('timeline update');
    expect(
      updates.filter(
        (update) => getComputedStyle(update).visibility === 'visible'
      ).length
    ).toEqual(NUM_UPDATES);
  });
});
