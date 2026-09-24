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
      color: '#000000',
      id: index + 1,
      info_text: '',
      manager: null,
      published: null,
      title: `Project ${index + 1}`,
      visibility: 'hidden',
    },
    type: SEARCH_DATA_TYPE.PROJECT,
  })) as SearchResult[];
}

describe('ResultsList', () => {
  it('lists six results and offers the rest', () => {
    const { getAllByTestId, getByMessageId, getByTestId } = render(
      <ResultsList query="project" results={makeProjects(10)} />
    );

    expect(getAllByTestId('SearchDialog-resultsListItem').length).toBe(6);
    expect(getByTestId('SearchDialog-showMore')).not.toBeNull();
    expect(getByMessageId(messageIds.resultCount.exact)).not.toBeNull();
  });

  it('reveals six more each time the row is clicked', async () => {
    const user = userEvent.setup();
    const { getAllByTestId, getByTestId, queryByTestId } = render(
      <ResultsList query="project" results={makeProjects(14)} />
    );

    await user.click(getByTestId('SearchDialog-showMore'));
    expect(getAllByTestId('SearchDialog-resultsListItem').length).toBe(12);

    await user.click(getByTestId('SearchDialog-showMore'));
    expect(getAllByTestId('SearchDialog-resultsListItem').length).toBe(14);

    // Nothing left to reveal, so the row is only a count
    expect(queryByTestId('SearchDialog-showMore')).toBeNull();
  });

  it('shows the count as a floor when the API capped a data type', () => {
    const { getByMessageId } = render(
      <ResultsList query="project" results={makeProjects(20)} />
    );

    expect(getByMessageId(messageIds.resultCount.capped)).not.toBeNull();
  });

  it('counts exactly when no data type is capped', () => {
    const { getByMessageId } = render(
      <ResultsList query="project" results={makeProjects(19)} />
    );

    expect(getByMessageId(messageIds.resultCount.exact)).not.toBeNull();
  });
});
