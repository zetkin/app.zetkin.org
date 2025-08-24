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
import { ZetkinLocation } from 'features/areaAssignments/types';
import submitHouseholdVisits from '../rpc/submitHouseholdVisits';

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
      initialState.areaAssignments.locationsByAssignmentId[ASSIGNMENT_ID] =
        remoteList();
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
        get: jest.fn().mockResolvedValue({}),
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
      expect(date.getTime() / 10000).toBeCloseTo(
        new Date().getTime() / 10000,
        1
      );
    });

    it('triggers a refresh of the location stats', async () => {
      const mockLocation: ZetkinLocation = {
        created: new Date().toISOString(),
        created_by_user_id: 1,
        description: '',
        id: LOCATION_ID,
        latitude: 55,
        longitude: 13,
        num_estimated_households: 0,
        num_households_successful: 1,
        num_households_visited: 1,
        num_known_households: 0,
        num_successful_visits: 1,
        num_visits: 1,
        organization_id: 1,
        title: '123 Location Street',
        type: 'assignment',
      };

      const store = createStore(initialState);
      const newVisit = mockHouseholdVisit();
      const apiClient = mockApiClient({
        get: jest.fn().mockResolvedValue(mockLocation),
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

      const stateAfterAction = store.getState();
      const locationItem =
        stateAfterAction.areaAssignments.locationsByAssignmentId[
          ASSIGNMENT_ID
        ].items.find((item) => item.id == LOCATION_ID);

      expect(locationItem?.data).toEqual(mockLocation);
    });
  });

  describe('Location-level assignment', () => {
    let initialState: RootState;

    beforeEach(() => {
      initialState = mockState();
      initialState.areaAssignments.locationsByAssignmentId[ASSIGNMENT_ID] =
        remoteList();
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
        get: jest.fn().mockResolvedValue({}),
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

    it('reportLocationVisit() triggers refresh of location stats', async () => {
      const mockLocation: ZetkinLocation = {
        created: new Date().toISOString(),
        created_by_user_id: 1,
        description: '',
        id: LOCATION_ID,
        latitude: 55,
        longitude: 13,
        num_estimated_households: 0,
        num_households_successful: 1,
        num_households_visited: 1,
        num_known_households: 0,
        num_successful_visits: 1,
        num_visits: 1,
        organization_id: 1,
        title: '123 Location Street',
        type: 'assignment',
      };

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
        get: jest.fn().mockResolvedValue(mockLocation),
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

      const stateAfterAction = store.getState();
      const locationItem =
        stateAfterAction.areaAssignments.locationsByAssignmentId[
          ASSIGNMENT_ID
        ].items.find((item) => item.id == LOCATION_ID);

      expect(locationItem?.data).toEqual(mockLocation);
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
        get: jest.fn().mockResolvedValue({}),
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
      expect(date.getTime() / 10000).toBeCloseTo(
        new Date().getTime() / 10000,
        1
      );

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
        get: jest.fn().mockResolvedValue({}),
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
      expect(date.getTime() / 10000).toBeCloseTo(
        new Date().getTime() / 10000,
        1
      );

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
        get: jest.fn().mockResolvedValue({}),
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

    it('reportHouseholdVisit() triggers refresh of location stats', async () => {
      const mockLocation: ZetkinLocation = {
        created: new Date().toISOString(),
        created_by_user_id: 1,
        description: '',
        id: LOCATION_ID,
        latitude: 55,
        longitude: 13,
        num_estimated_households: 0,
        num_households_successful: 1,
        num_households_visited: 1,
        num_known_households: 0,
        num_successful_visits: 1,
        num_visits: 1,
        organization_id: 1,
        title: '123 Location Street',
        type: 'assignment',
      };

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
        get: jest.fn().mockResolvedValue(mockLocation),
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

      const stateAfterAction = store.getState();
      const locationItem =
        stateAfterAction.areaAssignments.locationsByAssignmentId[
          ASSIGNMENT_ID
        ].items.find((item) => item.id == LOCATION_ID);

      expect(locationItem?.data).toEqual(mockLocation);
    });
  });

  describe('Location-level reportHouseholdVisits()', () => {
    let initialState: RootState;

    beforeEach(() => {
      initialState = mockState();
      initialState.areaAssignments.areaAssignmentList.items.push(
        remoteItem(ASSIGNMENT_ID, {
          data: mockAreaAssignment({
            id: ASSIGNMENT_ID,
            reporting_level: 'location',
          }),
          loaded: new Date().toISOString(),
        })
      );

      initialState.areaAssignments.visitsByHouseholdId = {};
      initialState.areaAssignments.locationsByAssignmentId[ASSIGNMENT_ID] =
        remoteList();
      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID] = remoteList();
      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID].loaded =
        new Date().toISOString();
    });

    it('reportHouseholdVisits() triggers a PATCH call when a currentLocationVisit already exists', async () => {
      const todayVisit = mockLocationVisit({
        assignment_id: ASSIGNMENT_ID,
        id: 77,
        location_id: LOCATION_ID,
      });
      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID] = remoteList([
        todayVisit,
      ]);
      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID].loaded =
        new Date().toISOString();

      const store = createStore(initialState);
      const updatedVisit = {
        ...todayVisit,
        metrics: [
          {
            metric_id: 10001,
            num_values: [0, 0, 1, 0, 0],
          },
          {
            metric_id: 10002,
            num_values: [0, 0, 0, 1, 0],
          },
          { metric_id: 97, response: 'no' },
        ],
        num_households_visited: 3,
      };
      const apiClient = mockApiClient({
        get: jest.fn().mockResolvedValue({ id: LOCATION_ID, title: 'Loc' }),
        patch: jest.fn().mockResolvedValue(updatedVisit),
      });

      const { result } = renderHook(
        () => useVisitReporting(1, ASSIGNMENT_ID, LOCATION_ID),
        { wrapper: makeWrapper(store, apiClient) }
      );

      await act(async () => {
        await result.current.reportHouseholdVisits(
          [1, 2, 3],
          [
            {
              metric_id: 10001,
              response: '3',
            },
            {
              metric_id: 10002,
              response: '4',
            },
            { metric_id: 97, response: 'no' },
          ]
        );
      });

      expect(apiClient.patch).toHaveBeenCalledWith(
        `/api2/orgs/1/area_assignments/${ASSIGNMENT_ID}/locations/${LOCATION_ID}/visits/${todayVisit.id}`,
        expect.objectContaining({ metrics: expect.any(Array) })
      );

      const patched =
        store.getState().canvass.visitsByAssignmentId[ASSIGNMENT_ID].items[0]
          .data;
      expect(patched).toEqual(updatedVisit);
    });

    it('reportHouseholdVisits() triggers a POST call when no location visit exists', async () => {
      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID] = remoteList([]);
      initialState.canvass.visitsByAssignmentId[ASSIGNMENT_ID].loaded =
        new Date().toISOString();

      const store = createStore(initialState);
      const newVisit = {
        assignment_id: ASSIGNMENT_ID,
        id: 88,
        location_id: LOCATION_ID,
        metrics: [
          { metric_id: 97, response: 'no' },
          { metric_id: 98, response: 'yes' },
          { metric_id: 99, response: 'no' },
        ],
        num_households_visited: 3,
      };

      const apiClient = mockApiClient({
        get: jest.fn().mockResolvedValue({ id: LOCATION_ID, title: 'Loc' }),
        post: jest.fn().mockResolvedValue(newVisit),
      });

      const { result } = renderHook(
        () => useVisitReporting(1, ASSIGNMENT_ID, LOCATION_ID),
        { wrapper: makeWrapper(store, apiClient) }
      );

      await act(async () => {
        await result.current.reportHouseholdVisits(
          [1, 2, 3],
          [
            { metric_id: 97, response: 'no' },
            { metric_id: 98, response: 'yes' },
            { metric_id: 99, response: 'no' },
          ]
        );
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        `/api2/orgs/1/area_assignments/${ASSIGNMENT_ID}/locations/${LOCATION_ID}/visits`,
        expect.objectContaining({ metrics: expect.any(Array) })
      );
      const created =
        store.getState().canvass.visitsByAssignmentId[ASSIGNMENT_ID].items[0]
          .data;
      expect(created).toEqual(newVisit);
    });
  });

  describe('Household-level reportHouseholdVisits()', () => {
    let initialState: RootState;
    const ORG_ID = 1;

    beforeEach(() => {
      initialState = mockState();
      initialState.areaAssignments.locationsByAssignmentId[ASSIGNMENT_ID] =
        remoteList();
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

    it('reportHouseholdVisits() triggers RPC call when reporting level is not location', async () => {
      const store = createStore(initialState);

      const mockRpcResult = {
        visits: [
          mockHouseholdVisit({
            assignment_id: ASSIGNMENT_ID,
            household_id: 1,
            id: 20001,
          }),
          mockHouseholdVisit({
            assignment_id: ASSIGNMENT_ID,
            household_id: 2,
            id: 20002,
          }),
          mockHouseholdVisit({
            assignment_id: ASSIGNMENT_ID,
            household_id: 3,
            id: 20003,
          }),
        ],
      };

      const mockLocation = {
        id: LOCATION_ID,
        num_visits: 3,
        title: 'Test Location',
      };

      const apiClient = mockApiClient({
        get: jest.fn().mockResolvedValue(mockLocation),
        rpc: jest.fn().mockResolvedValue(mockRpcResult),
      });

      const { result } = renderHook(
        () => useVisitReporting(ORG_ID, ASSIGNMENT_ID, LOCATION_ID),
        { wrapper: makeWrapper(store, apiClient) }
      );

      const householdIds = [1, 2, 3];
      const responses = [
        { metric_id: 99, response: 'yes' },
        { metric_id: 100, response: 'no' },
      ];

      await act(async () => {
        await result.current.reportHouseholdVisits(householdIds, responses);
      });

      expect(apiClient.rpc).toHaveBeenCalledWith(submitHouseholdVisits, {
        assignmentId: ASSIGNMENT_ID,
        households: householdIds,
        orgId: ORG_ID,
        responses: responses,
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        `/api2/orgs/${ORG_ID}/area_assignments/${ASSIGNMENT_ID}/locations/${LOCATION_ID}`
      );

      const stateAfterAction = store.getState();
      expect(
        stateAfterAction.areaAssignments.visitsByHouseholdId[1].items[0].data
      ).toEqual(mockRpcResult.visits[0]);
      expect(
        stateAfterAction.areaAssignments.visitsByHouseholdId[2].items[0].data
      ).toEqual(mockRpcResult.visits[1]);
      expect(
        stateAfterAction.areaAssignments.visitsByHouseholdId[3].items[0].data
      ).toEqual(mockRpcResult.visits[2]);
    });
  });
});
