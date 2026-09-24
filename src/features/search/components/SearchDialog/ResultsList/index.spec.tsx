import { describe, expect, beforeEach, it, jest } from '@jest/globals';
import singletonRouter from 'next/router';
import userEvent from '@testing-library/user-event';

import messageIds from 'features/search/l10n/messageIds';
import mockPerson from 'utils/testing/mocks/mockPerson';
import mockView from 'utils/testing/mocks/mockView';
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

function people(count: number): SearchResult[] {
  return Array.from({ length: count }, (ignored, index) => ({
    match: mockPerson({ id: index + 1, last_name: `Luxemburg ${index + 1}` }),
    type: SEARCH_DATA_TYPE.PERSON,
  }));
}

function lists(count: number): SearchResult[] {
  return Array.from({ length: count }, (ignored, index) => ({
    match: mockView({ id: index + 1, title: `List ${index + 1}` }),
    type: SEARCH_DATA_TYPE.VIEW,
  }));
}

describe('ResultsList', () => {
  it('groups results by data type', () => {
    const { getByMessageId } = render(
      <ResultsList
        onSelectType={jest.fn()}
        results={[...people(2), ...lists(2)]}
        selectedType={null}
      />
    );

    expect(getByMessageId(messageIds.groups.person)).not.toBeNull();
    expect(getByMessageId(messageIds.groups.view)).not.toBeNull();
  });

  it('previews three results per group', () => {
    const { getAllByTestId, getByTestId } = render(
      <ResultsList
        onSelectType={jest.fn()}
        results={people(9)}
        selectedType={null}
      />
    );

    expect(getAllByTestId('SearchDialog-resultsListItem').length).toBe(3);
    expect(getByTestId('SearchDialog-showMore-person')).not.toBeNull();
  });

  it('selects the data type when show more is clicked', async () => {
    const user = userEvent.setup();
    const onSelectType = jest.fn();
    const { getByTestId } = render(
      <ResultsList
        onSelectType={onSelectType}
        results={people(9)}
        selectedType={null}
      />
    );

    await user.click(getByTestId('SearchDialog-showMore-person'));

    expect(onSelectType).toHaveBeenCalledWith(SEARCH_DATA_TYPE.PERSON);
  });

  it('shows every result of the selected data type, without its heading', () => {
    const { getAllByTestId, queryByMessageId, queryByTestId } = render(
      <ResultsList
        onSelectType={jest.fn()}
        results={people(9)}
        selectedType={SEARCH_DATA_TYPE.PERSON}
      />
    );

    expect(getAllByTestId('SearchDialog-resultsListItem').length).toBe(9);
    expect(queryByTestId('SearchDialog-showMore-person')).toBeNull();
    expect(queryByMessageId(messageIds.groups.person)).toBeNull();
  });

  it('says so when there is nothing to show', () => {
    const { getByMessageId } = render(
      <ResultsList onSelectType={jest.fn()} results={[]} selectedType={null} />
    );

    expect(getByMessageId(messageIds.noResults)).not.toBeNull();
  });
});
