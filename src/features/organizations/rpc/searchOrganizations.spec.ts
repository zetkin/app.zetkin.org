import { describe, expect, it } from '@jest/globals';

import { searchOrganizationsDef } from './searchOrganizations';
import mockApiClient from 'utils/testing/mocks/mockApiClient';
import KPD from '../../../../integrationTesting/mockData/orgs/KPD';

describe('searchOrganizations', () => {
  it('loads all organizations and matches names without case or surrounding whitespace', async () => {
    const apiClient = mockApiClient();
    const otherOrganization = { ...KPD, id: 2, title: 'Another organization' };
    apiClient.get.mockResolvedValue([KPD, otherOrganization]);

    const results = await searchOrganizationsDef.handler(
      { query: '  DEUTSCHLANDS  ' },
      apiClient
    );

    expect(apiClient.get).toHaveBeenCalledWith('/api/orgs');
    expect(results).toEqual([KPD]);
    expect(
      await searchOrganizationsDef.handler({ query: '' }, apiClient)
    ).toEqual([KPD, otherOrganization]);
    expect(
      await searchOrganizationsDef.handler({ query: 'no match' }, apiClient)
    ).toEqual([]);
  });
});
