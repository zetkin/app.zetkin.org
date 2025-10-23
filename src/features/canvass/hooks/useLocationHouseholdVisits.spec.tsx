import { act, render } from '@testing-library/react';
import { FC, Suspense } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import createStore from 'core/store';
import mockApiClient from 'utils/testing/mocks/mockApiClient';
import IApiClient from 'core/api/client/IApiClient';
import useLocationHouseholdVisits from './useLocationHouseholdVisits';
import loadLocationHouseholdVisits from '../rpc/loadLocationHouseholdVisits';
import Environment from 'core/env/Environment';
import { EnvProvider } from 'core/env/EnvContext';
import { UserProvider } from 'core/env/UserContext';

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
    const env = new Environment(apiClient);

    const TestComponent: FC = () => {
      const householdVisits = useLocationHouseholdVisits(
        orgId,
        assignmentId,
        locationId
      );
      return (
        <div>
          <p>loaded</p>
          <ul>
            {householdVisits.map((visit) => (
              <li key={visit.id}>{visit.household_id}</li>
            ))}
          </ul>
        </div>
      );
    };

    const { queryByText } = render(
      <ReduxProvider store={store}>
        <EnvProvider env={env}>
          <UserProvider user={null}>
            <Suspense fallback={<p>loading</p>}>
              <TestComponent />
            </Suspense>
          </UserProvider>
        </EnvProvider>
      </ReduxProvider>
    );

    // Initially shows loading
    expect(queryByText('loading')).not.toBeNull();

    await act(async () => {
      // Wait for promise to resolve
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // After load, shows the loaded content
    expect(queryByText('loading')).toBeNull();
    expect(queryByText('loaded')).not.toBeNull();
    expect(queryByText('10')).not.toBeNull();
    expect(queryByText('11')).not.toBeNull();
  });
});
