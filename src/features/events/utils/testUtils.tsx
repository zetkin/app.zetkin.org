import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import Environment from 'core/env/Environment';
import { EnvProvider } from 'core/env/EnvContext';
import IApiClient from 'core/api/client/IApiClient';
import { RemoteItem } from 'utils/storeUtils';
import RosaLuxemburgUser from '../../../../integrationTesting/mockData/users/RosaLuxemburgUser';
import { Store } from 'core/store';
import { UserContext } from 'core/env/UserContext';
import { ZetkinEvent } from 'utils/types/zetkin';

export const makeWrapper = (store: Store) =>
  function Wrapper({ children }: { children: ReactNode }) {
    const apiClient: jest.Mocked<IApiClient> = {
      delete: jest.fn(),
      get: jest.fn(),
      patch: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      rpc: jest.fn(),
    };

    const env = new Environment(store, apiClient);
    return (
      <ReduxProvider store={store}>
        <EnvProvider env={env}>
          <UserContext.Provider value={RosaLuxemburgUser}>
            {children}
          </UserContext.Provider>
        </EnvProvider>
      </ReduxProvider>
    );
  };

export const remoteListWithEventItems = (
  items: RemoteItem<ZetkinEvent>[],
  loaded: string
) => {
  return {
    error: false,
    isLoading: false,
    isStale: false,
    items,
    loaded,
  };
};
