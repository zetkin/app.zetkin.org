import { act, renderHook } from 'utils/testing';
import createStore from 'core/store';
import { makeWrapper } from 'utils/testing';
import mockApiClient from 'utils/testing/mocks/mockApiClient';
import IApiClient from 'core/api/client/IApiClient';
import useLocationHouseholdVisits from './useLocationHouseholdVisits';
import loadLocationHouseholdVisits from '../rpc/loadLocationHouseholdVisits';

describe('useLocationHouseholdVisits', () => {
  it('returns aggregated household visits from RPC', async () => {
    const orgId = 1;
    const assignmentId = 2;
    const locationId = 3;

    const visits = [
      {
        assignment_id: assignmentId,
        created: new Date().toISOString(),
        created_by_user_id: 1,
        household_id: 10,
        id: 100,
        metrics: [],
      },
      {
        assignment_id: assignmentId,
        created: new Date().toISOString(),
        created_by_user_id: 1,
        household_id: 11,
        id: 101,
        metrics: [],
      },
    ];

    const rpcMock = jest.fn().mockImplementation(async (def, params) => {
      if ((def as { name: string }).name === loadLocationHouseholdVisits.name) {
        expect(params).toEqual({ assignmentId, locationId, orgId });
        return { visits };
      }
      throw new Error('Unexpected RPC');
    }) as unknown as jest.MockedFunction<IApiClient['rpc']>;

    const apiClient = mockApiClient({ rpc: rpcMock });

    const store = createStore();
    const wrapper = makeWrapper(store, apiClient);
    const { result } = renderHook(
      () => useLocationHouseholdVisits(orgId, assignmentId, locationId),
      { wrapper }
    );

    // Initially triggers load and returns empty until resolved
    expect(result.current).toEqual([]);

    await act(async () => {
      // Allow state updates to flush
      await Promise.resolve();
    });

    expect(result.current).toHaveLength(2);
    expect(result.current.map((v) => v.household_id)).toEqual([10, 11]);
  });
});
