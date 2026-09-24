import { describe, expect, beforeEach, it, jest } from '@jest/globals';
import singletonRouter from 'next/router';
import userEvent from '@testing-library/user-event';

import messageIds from 'features/search/l10n/messageIds';
import { render } from 'utils/testing';
import ResultsList from '.';
import {
  SEARCH_DATA_TYPE,
  SearchResult,
} from 'features/search/components/types';

jest.mock('next/dist/client/router', () =>
  jest.requireActual('next-router-mock')
);

beforeEach(() => {
  singletonRouter.query = {
    orgId: '1',
  };
});

function makeProjects(count: number): SearchResult[] {
  return Array.from({ length: count }, (ignored, index) => ({
    match: {
      id: index + 1,
      title: `Project ${index + 1}`,
    },
    type: SEARCH_DATA_TYPE.PROJECT,
  })) as unknown as SearchResult[];
}

function makePeople(count: number): SearchResult[] {
  return Array.from({ length: count }, (ignored, index) => ({
    match: {
      first_name: 'Rosa',
      id: 100 + index,
      last_name: `Luxemburg ${index + 1}`,
    },
    type: SEARCH_DATA_TYPE.PERSON,
  })) as unknown as SearchResult[];
}

describe('ResultsList', () => {
  it('groups results by data type', () => {
    const { getByMessageId } = render(
      <ResultsList
        query="rosa"
        results={[...makePeople(2), ...makeProjects(2)]}
      />
    );

    expect(getByMessageId(messageIds.groups.person)).not.toBeNull();
    expect(getByMessageId(messageIds.groups.campaign)).not.toBeNull();
  });

  it('shows three per group before it is expanded', () => {
    const { getAllByTestId, getByTestId } = render(
      <ResultsList query="rosa" results={makePeople(9)} />
    );

    expect(getAllByTestId('SearchDialog-resultsListItem').length).toBe(3);
    expect(getByTestId('SearchDialog-showMore-person')).not.toBeNull();
  });

  it('expands only the group whose button was clicked', async () => {
    const user = userEvent.setup();
    const { getAllByTestId, getByTestId } = render(
      <ResultsList
        query="rosa"
        results={[...makePeople(9), ...makeProjects(9)]}
      />
    );

    expect(getAllByTestId('SearchDialog-resultsListItem').length).toBe(6);

    await user.click(getByTestId('SearchDialog-showMore-person'));

    // Eight people and three projects, the project group untouched
    expect(getAllByTestId('SearchDialog-resultsListItem').length).toBe(11);
    expect(getByTestId('SearchDialog-showMore-campaign')).not.toBeNull();
  });

  it('drops the button when a group is fully shown', async () => {
    const user = userEvent.setup();
    const { getAllByTestId, getByTestId, queryByTestId } = render(
      <ResultsList query="rosa" results={makePeople(5)} />
    );

    await user.click(getByTestId('SearchDialog-showMore-person'));

    expect(getAllByTestId('SearchDialog-resultsListItem').length).toBe(5);
    expect(queryByTestId('SearchDialog-showMore-person')).toBeNull();
  });

  it('says so when there is nothing to show', () => {
    const { getByMessageId } = render(
      <ResultsList query="rosa" results={[]} />
    );

    expect(getByMessageId(messageIds.noResults)).not.toBeNull();
  });
});
