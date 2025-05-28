import { act, renderHook } from '@testing-library/react';

import useVisitReporting from './useVisitReporting';
import { makeWrapper } from 'utils/testing';
import mockState from 'utils/testing/mocks/mockState';
import createStore, { RootState } from 'core/store';
import { remoteItem, remoteList } from 'utils/storeUtils';
import mockApiClient from 'utils/testing/mocks/mockApiClient';
import mockHouseholdVisit from 'utils/testing/mocks/mockHouseholdVisit';
import mockAreaAssignment from 'utils/testing/mocks/mockAreaAssignment';
import mockLocationVisit from 'utils/testing/mocks/mockLocationVisit';

const ASSIGNMENT_ID = 11;
const LOCATION_ID = 101;
const HOUSEHOLD_ID = 1001;

describe('useVisitReporting()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    window.localStorage.clear();
  });

  describe('Household-level assignment', () => {
    let initialState: RootState;

    beforeEach(() => {
      initialState = mockState();
      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID] = remoteList();
      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID].loaded =
        new Date().toISOString();
      initialState.areaAssignments.areaAssignmentList.items.push(
        remoteItem(ASSIGNMENT_ID, {
          data: mockAreaAssignment({
            id: ASSIGNMENT_ID,
            reporting_level: 'household',
          }),
          loaded: new Date().toISOString(),
        })
      );
    });

    it('includes last visits from store', () => {
      const timestamp = new Date().toISOString();

      initialState.areaAssignments.visitsByHouseholdId[HOUSEHOLD_ID] =
        remoteList([
          mockHouseholdVisit({
            assignment_id: ASSIGNMENT_ID,
            created: timestamp,
            created_by_user_id: 1,
            household_id: HOUSEHOLD_ID,
            id: 10001,
          }),
        ]);

      initialState.areaAssignments.visitsByHouseholdId[HOUSEHOLD_ID + 1] =
        remoteList([
          mockHouseholdVisit({
            assignment_id: ASSIGNMENT_ID,
            created: '1857-07-05T13:37:00.000Z', // This is old
            household_id: HOUSEHOLD_ID + 1,
            id: 10002,
          }),
          mockHouseholdVisit({
            assignment_id: ASSIGNMENT_ID,
            created: timestamp,
            household_id: HOUSEHOLD_ID + 1,
            id: 10003,
          }),
          mockHouseholdVisit({
            assignment_id: ASSIGNMENT_ID,
            created: '1857-07-05T13:37:00.000Z', // This is old
            household_id: HOUSEHOLD_ID + 1,
            id: 10004,
          }),
        ]);

      const store = createStore(initialState);

      const { result } = renderHook(
        () => useVisitReporting(1, ASSIGNMENT_ID, LOCATION_ID),
        {
          wrapper: makeWrapper(store),
        }
      );

      expect(result.current.lastVisitByHouseholdId).toEqual({
        [HOUSEHOLD_ID]: {
          created: timestamp,
          metrics: [{ metric_id: 10001, response: 'yes' }],
        },
        [HOUSEHOLD_ID + 1]: {
          created: timestamp,
          metrics: [{ metric_id: 10001, response: 'yes' }],
        },
      });
    });

    it('reportHouseholdVisit() creates household visit at correct URL', async () => {
      const store = createStore(initialState);
      const newVisit = mockHouseholdVisit();
      const apiClient = mockApiClient({
        post: jest.fn().mockResolvedValue(newVisit),
      });

      const { result } = renderHook(
        () => useVisitReporting(1, ASSIGNMENT_ID, LOCATION_ID),
        {
          wrapper: makeWrapper(store, apiClient),
        }
      );

      await act(async () => {
        await result.current.reportHouseholdVisit(HOUSEHOLD_ID, [
          {
            metric_id: 10001,
            response: 'yes',
          },
        ]);
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api2/orgs/1/area_assignments/11/households/1001/visits',
        {
          metrics: [
            {
              metric_id: 10001,
              response: 'yes',
            },
          ],
        }
      );

      const stateAfterAction = store.getState();
      expect(
        stateAfterAction.areaAssignments.visitsByHouseholdId[HOUSEHOLD_ID]
          .items[0].data
      ).toEqual(newVisit);

      const dateStr =
        result.current.lastVisitByHouseholdId[HOUSEHOLD_ID].created;
      const date = new Date(dateStr);
      expect(date.getTime() / 1000).toBeCloseTo(new Date().getTime() / 1000, 1);
    });
  });

  describe('Location-level assignment', () => {
    let initialState: RootState;

    beforeEach(() => {
      initialState = mockState();
      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID] = remoteList();
      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID].loaded =
        new Date().toISOString();
      initialState.areaAssignments.areaAssignmentList.items.push(
        remoteItem(ASSIGNMENT_ID, {
          data: mockAreaAssignment({
            id: ASSIGNMENT_ID,
            reporting_level: 'location',
          }),
          loaded: new Date().toISOString(),
        })
      );
    });

    it('includes last household visits from store', () => {
      const timestamp = new Date().toISOString();

      initialState.areaAssignments.visitsByHouseholdId[HOUSEHOLD_ID] =
        remoteList([
          mockHouseholdVisit({
            assignment_id: ASSIGNMENT_ID,
            created: timestamp,
            created_by_user_id: 1,
            household_id: HOUSEHOLD_ID,
            id: 10001,
          }),
        ]);

      initialState.areaAssignments.visitsByHouseholdId[HOUSEHOLD_ID + 1] =
        remoteList([
          mockHouseholdVisit({
            assignment_id: ASSIGNMENT_ID,
            created: '1857-07-05T13:37:00.000Z', // This is old
            household_id: HOUSEHOLD_ID + 1,
            id: 10002,
          }),
          mockHouseholdVisit({
            assignment_id: ASSIGNMENT_ID,
            created: timestamp,
            household_id: HOUSEHOLD_ID + 1,
            id: 10003,
          }),
          mockHouseholdVisit({
            assignment_id: ASSIGNMENT_ID,
            created: '1857-07-05T13:37:00.000Z', // This is old
            household_id: HOUSEHOLD_ID + 1,
            id: 10004,
          }),
        ]);

      const store = createStore(initialState);

      const { result } = renderHook(
        () => useVisitReporting(1, ASSIGNMENT_ID, LOCATION_ID),
        {
          wrapper: makeWrapper(store),
        }
      );

      expect(result.current.lastVisitByHouseholdId).toEqual({
        [HOUSEHOLD_ID]: {
          created: timestamp,
          metrics: [{ metric_id: 10001, response: 'yes' }],
        },
        [HOUSEHOLD_ID + 1]: {
          created: timestamp,
          metrics: [{ metric_id: 10001, response: 'yes' }],
        },
      });
    });

    it('reportLocationVisit() creates location visit at correct URL', async () => {
      const store = createStore(initialState);
      const newVisit = mockLocationVisit({
        assignment_id: ASSIGNMENT_ID,
        metrics: [
          {
            metric_id: 10001,
            num_no: 1,
            num_yes: 1,
          },
        ],
        num_households_visited: 2,
      });

      const apiClient = mockApiClient({
        post: jest.fn().mockResolvedValue(newVisit),
      });

      const { result } = renderHook(
        () => useVisitReporting(1, ASSIGNMENT_ID, LOCATION_ID),
        {
          wrapper: makeWrapper(store, apiClient),
        }
      );

      await act(async () => {
        await result.current.reportLocationVisit(2, [
          {
            metric_id: 10001,
            num_no: 1,
            num_yes: 1,
          },
        ]);
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api2/orgs/1/area_assignments/11/locations/101/visits',
        {
          metrics: [
            {
              metric_id: 10001,
              num_no: 1,
              num_yes: 1,
            },
          ],
          num_households_visited: 2,
        }
      );

      const stateAfterAction = store.getState();
      expect(
        stateAfterAction.canvass.visitsByAssignmentId[ASSIGNMENT_ID].items[0]
          .data
      ).toEqual(newVisit);
    });

    it('reportHouseholdVisit() creates new location visit when there is none', async () => {
      const store = createStore(initialState);
      const newVisit = mockLocationVisit({
        assignment_id: ASSIGNMENT_ID,
        metrics: [
          {
            metric_id: 10001,
            num_no: 0,
            num_yes: 1,
          },
        ],
        num_households_visited: 1,
      });

      const apiClient = mockApiClient({
        post: jest.fn().mockResolvedValue(newVisit),
      });

      const { result } = renderHook(
        () => useVisitReporting(1, ASSIGNMENT_ID, LOCATION_ID),
        {
          wrapper: makeWrapper(store, apiClient),
        }
      );

      await act(async () => {
        await result.current.reportHouseholdVisit(HOUSEHOLD_ID, [
          {
            metric_id: 10001,
            response: 'yes',
          },
        ]);
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api2/orgs/1/area_assignments/11/locations/101/visits',
        {
          metrics: [
            {
              metric_id: 10001,
              num_no: 0,
              num_yes: 1,
            },
          ],
          num_households_visited: 1,
        }
      );

      const dateStr =
        result.current.lastVisitByHouseholdId[HOUSEHOLD_ID].created;
      const date = new Date(dateStr);
      expect(date.getTime() / 1000).toBeCloseTo(new Date().getTime() / 1000, 1);

      const stateAfterAction = store.getState();
      expect(
        stateAfterAction.canvass.visitsByAssignmentId[ASSIGNMENT_ID].items[0]
          .data
      ).toEqual(newVisit);
    });

    it('includes current location visit when one exists', () => {
      const correctCurrentVisit = mockLocationVisit({
        // This one is good
        assignment_id: ASSIGNMENT_ID,
        id: 10001,
        location_id: LOCATION_ID,
      });

      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID] = remoteList([
        mockLocationVisit({
          assignment_id: ASSIGNMENT_ID,
          created: '1857-07-05T13:37:00.000Z', // Old
          id: 10002,
          location_id: LOCATION_ID,
        }),
        correctCurrentVisit,
        mockLocationVisit({
          assignment_id: ASSIGNMENT_ID,
          id: 10003,
          location_id: LOCATION_ID + 1, // Wrong location
        }),
        mockLocationVisit({
          assignment_id: ASSIGNMENT_ID,
          created_by_user_id: 2, // Some other user
          id: 10004,
          location_id: LOCATION_ID,
        }),
      ]);

      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID].loaded =
        new Date().toISOString();

      const store = createStore(initialState);

      const { result } = renderHook(
        () => useVisitReporting(1, ASSIGNMENT_ID, LOCATION_ID),
        {
          wrapper: makeWrapper(store),
        }
      );

      expect(result.current.currentLocationVisit).toEqual(correctCurrentVisit);
    });

    it('reportHouseholdVisit() handles scale5 metric', async () => {
      const store = createStore(initialState);
      const newVisit = mockLocationVisit({
        assignment_id: ASSIGNMENT_ID,
        metrics: [
          {
            metric_id: 10001,
            num_values: [0, 0, 1, 0, 0],
          },
        ],
        num_households_visited: 1,
      });

      const apiClient = mockApiClient({
        post: jest.fn().mockResolvedValue(newVisit),
      });

      const { result } = renderHook(
        () => useVisitReporting(1, ASSIGNMENT_ID, LOCATION_ID),
        {
          wrapper: makeWrapper(store, apiClient),
        }
      );

      await act(async () => {
        await result.current.reportHouseholdVisit(HOUSEHOLD_ID, [
          {
            metric_id: 10001,
            response: '3',
          },
        ]);
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api2/orgs/1/area_assignments/11/locations/101/visits',
        {
          metrics: [
            {
              metric_id: 10001,
              num_values: [0, 0, 1, 0, 0],
            },
          ],
          num_households_visited: 1,
        }
      );

      const dateStr =
        result.current.lastVisitByHouseholdId[HOUSEHOLD_ID].created;
      const date = new Date(dateStr);
      expect(date.getTime() / 1000).toBeCloseTo(new Date().getTime() / 1000, 1);

      const stateAfterAction = store.getState();
      expect(
        stateAfterAction.canvass.visitsByAssignmentId[ASSIGNMENT_ID].items[0]
          .data
      ).toEqual(newVisit);
    });

    it('reportHouseholdVisit() updates recent location visit when one exists', async () => {
      const correctCurrentVisit = mockLocationVisit({
        // This one is good
        assignment_id: ASSIGNMENT_ID,
        id: 10001,
        location_id: LOCATION_ID,
      });

      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID] = remoteList([
        correctCurrentVisit,
      ]);

      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID].loaded =
        new Date().toISOString();

      const store = createStore(initialState);

      const apiClient = mockApiClient({
        patch: jest.fn().mockImplementation((url, data) => ({
          ...correctCurrentVisit,
          ...data,
        })),
      });

      const { result } = renderHook(
        () => useVisitReporting(1, ASSIGNMENT_ID, LOCATION_ID),
        {
          wrapper: makeWrapper(store, apiClient),
        }
      );

      await act(async () => {
        await result.current.reportHouseholdVisit(HOUSEHOLD_ID, [
          { metric_id: 10001, response: 'yes' },
        ]);

        await result.current.reportHouseholdVisit(HOUSEHOLD_ID + 1, [
          { metric_id: 10001, response: 'no' },
        ]);
      });

      expect(apiClient.patch).toHaveBeenCalledTimes(2);
      expect(apiClient.patch).toHaveBeenNthCalledWith(
        1,
        '/api2/orgs/1/area_assignments/11/locations/101/visits/10001',
        {
          metrics: [
            {
              metric_id: 10001,
              num_no: 0,
              num_yes: 1,
            },
          ],
          num_households_visited: 1,
        }
      );

      expect(apiClient.patch).toHaveBeenNthCalledWith(
        2,
        '/api2/orgs/1/area_assignments/11/locations/101/visits/10001',
        {
          metrics: [
            {
              metric_id: 10001,
              num_no: 1,
              num_yes: 1,
            },
          ],
          num_households_visited: 2,
        }
      );

      expect(result.current.currentLocationVisit).toEqual({
        ...correctCurrentVisit,
        metrics: [
          {
            metric_id: 10001,
            num_no: 1,
            num_yes: 1,
          },
        ],
        num_households_visited: 2,
      });
    });
  });
});
