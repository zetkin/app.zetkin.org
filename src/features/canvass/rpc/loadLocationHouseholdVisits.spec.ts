import { describe, expect, it, jest } from '@jest/globals';

import mockApiClient from 'utils/testing/mocks/mockApiClient';
import { Zetkin2Household, ZetkinHouseholdVisit } from '../types';
import { loadLocationHouseholdVisitsDef } from './loadLocationHouseholdVisits';

describe('loadLocationHouseholdVisits RPC', () => {
  it('loads visits for all households across multiple pages (>100)', async () => {
    const orgId = 1;
    const locationId = 2;
    const assignmentId = 3;

    const totalHouseholds = 120;
    const pageSize = 100;
    const households: Zetkin2Household[] = Array.from({
      length: totalHouseholds,
    }).map((_, idx) => ({
      id: idx + 1,
      level: 1,
      location_id: locationId,
      title: `HH ${idx + 1}`,
    }));

    const get = jest.fn(async (path: string) => {
      if (
        path.startsWith(
          `/api2/orgs/${orgId}/locations/${locationId}/households?`
        )
      ) {
        const url = new URL('http://test' + path);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const size = parseInt(url.searchParams.get('size') || '100', 10);
        const start = (page - 1) * size;
        const end = Math.min(start + size, households.length);
        return households.slice(start, end);
      }

      const hhMatch = path.match(
        new RegExp(
          `/api2/orgs/${orgId}/area_assignments/${assignmentId}/households/(\\d+)/visits`
        )
      );
      if (hhMatch) {
        const hhId = parseInt(hhMatch[1], 10);
        const visit: ZetkinHouseholdVisit = {
          assignment_id: assignmentId,
          created: new Date().toISOString(),
          created_by_user_id: 99,
          household_id: hhId,
          id: hhId + 1000,
          metrics: [],
        };
        return [visit];
      }

      throw new Error('Unexpected API call: ' + path);
    });

    const apiClient = mockApiClient({
      get: get as unknown as jest.MockedFunction<
        <T>(path: string) => Promise<T>
      >,
    });

    const result = await loadLocationHouseholdVisitsDef.handler(
      { assignmentId, locationId, orgId },
      apiClient
    );

    expect(result.visits).toHaveLength(totalHouseholds);
    // Ensure visits for the last household (beyond 100) are included
    expect(
      result.visits.find((v) => v.household_id === totalHouseholds)
    ).toBeTruthy();

    // Households pages (2) + 120 visit calls
    expect(get).toHaveBeenCalled();
    const householdPageCalls = get.mock.calls.filter((args) =>
      (args[0] as string).includes('/locations/')
    ).length;
    const visitCalls = get.mock.calls.filter(
      (args) =>
        (args[0] as string).includes('/households/') &&
        (args[0] as string).includes('/visits')
    ).length;
    expect(householdPageCalls).toBeGreaterThanOrEqual(
      Math.ceil(totalHouseholds / pageSize)
    );
    expect(visitCalls).toBe(totalHouseholds);
  });
});
