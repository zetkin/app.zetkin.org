import { describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react';

import createStore from 'core/store';
import IApiClient from 'core/api/client/IApiClient';
import { makeWrapper } from 'utils/testing';
import mockApiClient from 'utils/testing/mocks/mockApiClient';
import mockPerson from 'utils/testing/mocks/mockPerson';
import mockState from 'utils/testing/mocks/mockState';
import { mockAppliedTag } from 'utils/testing/mocks/mockTag';
import { remoteListLoaded } from 'utils/storeUtils';
import usePersonTags from 'features/tags/hooks/usePersonTags';
import useMergePersons from './useMergePersons';

const ORG_ID = 1;
const BASE_PERSON_ID = 1;
const DUPLICATE_PERSON_ID = 2;

describe('useMergePersons()', () => {
  it('reloads the tags of the person that the others were merged into', async () => {
    const organizerTag = mockAppliedTag({ id: 1, title: 'Organizer' });
    const renterTag = mockAppliedTag({ id: 2, title: 'Renter' });

    const emptyState = mockState();
    const store = createStore(
      mockState({
        ...emptyState,
        tags: {
          ...emptyState.tags,
          tagsByPersonId: {
            [BASE_PERSON_ID]: remoteListLoaded([organizerTag]),
          },
        },
      })
    );

    const apiClient = mockApiClient({
      get: jest
        .fn<IApiClient['get']>()
        .mockResolvedValue([organizerTag, renterTag]),
      post: jest
        .fn<IApiClient['post']>()
        .mockResolvedValue(mockPerson({ id: BASE_PERSON_ID })),
    });
    const wrapper = makeWrapper(store, apiClient);

    const { result: mergeResult } = renderHook(() => useMergePersons(ORG_ID), {
      wrapper,
    });

    await act(async () => {
      await mergeResult.current([BASE_PERSON_ID, DUPLICATE_PERSON_ID], {});
    });

    const { result: tagsResult } = renderHook(
      () => usePersonTags(ORG_ID, BASE_PERSON_ID),
      { wrapper }
    );

    expect(apiClient.get).toHaveBeenCalledWith(
      `/api/orgs/${ORG_ID}/people/${BASE_PERSON_ID}/tags`
    );
    await waitFor(() => {
      expect(tagsResult.current.data).toEqual([organizerTag, renterTag]);
    });
  });
});
