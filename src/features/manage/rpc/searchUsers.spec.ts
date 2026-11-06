import { describe, expect, it } from '@jest/globals';

import { searchUsersDef } from './searchUsers';
import mockApiClient from 'utils/testing/mocks/mockApiClient';
import RosaLuxemburgUser from '../../../../integrationTesting/mockData/users/RosaLuxemburgUser';

describe('searchUsers', () => {
  it.each(['Rosa Luxemburg', 'rosa@zetkin.org'])(
    'searches for %s without loading the user collection',
    async (query) => {
      const apiClient = mockApiClient();
      apiClient.post.mockResolvedValue([RosaLuxemburgUser]);
      const params = searchUsersDef.schema.parse({ query: ` ${query} ` });
      const users = await searchUsersDef.handler(params, apiClient);

      expect(apiClient.post).toHaveBeenCalledWith('/api/search/user', {
        q: query,
      });
      expect(apiClient.get).not.toHaveBeenCalled();
      expect(users).toEqual([RosaLuxemburgUser]);
    }
  );

  it.each(['', '   '])('rejects an empty query', (query) => {
    expect(searchUsersDef.schema.safeParse({ query }).success).toBe(false);
  });
});
