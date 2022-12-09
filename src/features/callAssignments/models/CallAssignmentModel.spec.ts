import { anything, instance, mock, reset, when } from 'ts-mockito';

import createStore from 'core/store';
import Environment from 'core/env/Environment';
import { FILTER_TYPE } from 'features/smartSearch/components/types';
import IApiClient from 'core/api/client/IApiClient';
import {
  CallAssignmentCaller,
  CallAssignmentData,
  CallAssignmentStats,
} from '../apiTypes';
import CallAssignmentModel, {
  CallAssignmentState,
} from './CallAssignmentModel';
import { remoteItem, remoteList } from 'utils/storeUtils';

function mockList<DataType extends { id: number }>(items?: DataType[]) {
  const list = remoteList<DataType>(items);
  if (items) {
    list.items = items.map((data) => mockItem(data));
  }

  return list;
}

function mockItem<DataType extends { id: number }>(data: DataType) {
  const item = remoteItem<DataType>(data.id, { data });
  item.loaded = new Date().toISOString();
  return item;
}

describe('CallAssignmentModel', () => {
  const mockClient = mock<IApiClient>();

  beforeEach(() => {
    reset(mockClient);
  });

  describe('isTargeted', () => {
    it('is false when target query is empty', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList<CallAssignmentData>([
            {
              cooldown: 3,
              end_date: null,
              id: 2,
              start_date: null,
              target: {
                filter_spec: [],
                id: 101,
              },
              title: 'My assignment',
            },
          ]),
          callersById: {},
          statsById: {},
        },
      });

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);

      expect(model.isTargeted).toBeFalsy();
    });

    it('is true when there are filters in the target query', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList<CallAssignmentData>([
            {
              cooldown: 3,
              end_date: null,
              id: 2,
              start_date: null,
              target: {
                filter_spec: [
                  {
                    config: {},
                    type: FILTER_TYPE.ALL,
                  },
                ],
                id: 101,
              },
              title: 'My assignment',
            },
          ]),
          callersById: {},
          statsById: {},
        },
      });

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);

      expect(model.isTargeted).toBeTruthy();
    });
  });

  describe('state', () => {
    const mockStoreData = (
      startDate: string | null = null,
      endDate: string | null = null,
      mostRecentCallTime: string | null = null
    ) => ({
      callAssignments: {
        assignmentList: mockList<CallAssignmentData>([
          {
            cooldown: 3,
            end_date: endDate,
            id: 2,
            start_date: startDate,
            target: {
              filter_spec: [{ config: {}, type: FILTER_TYPE.ALL }],
              id: 101,
            },
            title: 'My assignment',
          },
        ]),
        callersById: {},
        statsById: {
          2: mockItem({
            allTargets: 100,
            allocated: 0,
            blocked: 0,
            callBackLater: 0,
            calledTooRecently: 0,
            done: 50,
            id: 2,
            missingPhoneNumber: 0,
            mostRecentCallTime: mostRecentCallTime,
            organizerActionNeeded: 0,
            queue: 0,
            ready: 50,
          }),
        },
      },
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('is UNKNOWN when not loaded', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList(),
          callersById: {},
          statsById: {},
        },
      });

      const mockData = mockStoreData();
      when(mockClient.get<CallAssignmentData>(anything())).thenResolve(
        mockData.callAssignments.assignmentList.items[0].data!
      );

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.UNKNOWN);
    });

    it('is DRAFT when there is no start date', () => {
      const store = createStore(mockStoreData());

      jest.useFakeTimers().setSystemTime(new Date('1857-07-04'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.DRAFT);
    });

    it('is SCHEDULED when start date is in the future', () => {
      const store = createStore(mockStoreData('1857-07-05', '1933-06-20'));
      jest.useFakeTimers().setSystemTime(new Date('1857-07-04'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.SCHEDULED);
    });

    it('is OPEN when start_date is in the past and end_date in the future', () => {
      const store = createStore(mockStoreData('1857-07-05', '1933-06-20'));
      jest.useFakeTimers().setSystemTime(new Date('1857-07-08'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.OPEN);
    });

    it('is OPEN when start_date is in the past and there is no end_date', () => {
      const store = createStore(mockStoreData('1857-07-05'));
      jest.useFakeTimers().setSystemTime(new Date('1857-08-04'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.OPEN);
    });

    it('is OPEN when dates are correct, and most recent call was too long ago', () => {
      jest.useFakeTimers().setSystemTime(new Date('1857-08-04T14:37:00Z'));

      const store = createStore(
        mockStoreData('1857-07-05', '1933-06-20', '1857-08-04T13:37:00Z')
      );

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.OPEN);
    });

    it('is ACTIVE when open with very recent call', () => {
      jest.useFakeTimers().setSystemTime(new Date('1857-08-04T13:38:00'));

      const store = createStore(
        mockStoreData('1857-07-05', '1933-06-20', '1857-08-04T13:37:00Z')
      );

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.ACTIVE);
    });

    it('is CLOSED when end date is in the past', () => {
      const store = createStore(mockStoreData('1857-07-05', '1933-06-20'));

      jest.useFakeTimers().setSystemTime(new Date('1933-06-21'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.CLOSED);
    });
  });

  describe('getStats()', () => {
    it('returns null future (without loading) when not targeted', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList<CallAssignmentData>([
            {
              cooldown: 3,
              end_date: null,
              id: 2,
              start_date: null,
              target: {
                filter_spec: [],
                id: 101,
              },
              title: 'My assignment',
            },
          ]),
          callersById: {},
          statsById: {},
        },
      });

      const apiClient = instance(mockClient);

      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);

      const future = model.getStats();

      expect(future.data).toBeNull();
      expect(future.isLoading).toBeFalsy();
      expect(future.error).toBeNull();
    });

    it('returns future with placeholder data while loading', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList<CallAssignmentData>([
            {
              cooldown: 3,
              end_date: null,
              id: 2,
              start_date: null,
              target: {
                filter_spec: [
                  {
                    config: {},
                    type: FILTER_TYPE.ALL,
                  },
                ],
                id: 101,
              },
              title: 'My assignment',
            },
          ]),
          callersById: {},
          statsById: {},
        },
      });

      when(mockClient.get<CallAssignmentStats>(anything())).thenResolve({
        allTargets: 100,
        allocated: 0,
        blocked: 0,
        callBackLater: 0,
        calledTooRecently: 0,
        done: 50,
        id: 2,
        missingPhoneNumber: 0,
        mostRecentCallTime: null,
        organizerActionNeeded: 0,
        queue: 0,
        ready: 50,
      });

      const apiClient = instance(mockClient);

      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);

      const future = model.getStats();

      expect(future.data).toEqual({
        allTargets: 0,
        allocated: 0,
        blocked: 0,
        callBackLater: 0,
        calledTooRecently: 0,
        done: 0,
        id: 2,
        missingPhoneNumber: 0,
        mostRecentCallTime: null,
        organizerActionNeeded: 0,
        queue: 0,
        ready: 0,
      });
      expect(future.isLoading).toBeTruthy();
      expect(future.error).toBeNull();
    });

    it('returns assignment stats when loaded', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList<CallAssignmentData>([
            {
              cooldown: 3,
              end_date: null,
              id: 2,
              start_date: null,
              target: {
                filter_spec: [
                  {
                    config: {},
                    type: FILTER_TYPE.ALL,
                  },
                ],
                id: 101,
              },
              title: 'My assignment',
            },
          ]),
          callersById: {},
          statsById: {
            2: mockItem({
              allTargets: 100,
              allocated: 0,
              blocked: 0,
              callBackLater: 0,
              calledTooRecently: 0,
              done: 50,
              id: 2,
              missingPhoneNumber: 0,
              mostRecentCallTime: null,
              organizerActionNeeded: 0,
              queue: 0,
              ready: 50,
            }),
          },
        },
      });

      const apiClient = instance(mockClient);

      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);

      const future = model.getStats();

      expect(future.data).toEqual({
        allTargets: 100,
        allocated: 0,
        blocked: 0,
        callBackLater: 0,
        calledTooRecently: 0,
        done: 50,
        id: 2,
        missingPhoneNumber: 0,
        mostRecentCallTime: null,
        organizerActionNeeded: 0,
        queue: 0,
        ready: 50,
      });
      expect(future.isLoading).toBeFalsy();
      expect(future.error).toBeNull();
    });
  });

  describe('getFilteredCallers', () => {
    it('returns all callers if the search string is empty', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList(),
          callersById: {
            2: mockList<CallAssignmentCaller>([
              {
                excluded_tags: [],
                first_name: 'Rosa',
                id: 3,
                last_name: 'Luxemburg',
                prioritized_tags: [],
              },
            ]),
          },
          statsById: {},
        },
      });

      const apiClient = instance(mockClient);

      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);

      const future = model.getFilteredCallers('');

      expect(future.data).toEqual([
        {
          excluded_tags: [],
          first_name: 'Rosa',
          id: 3,
          last_name: 'Luxemburg',
          prioritized_tags: [],
        },
      ]);
    });
    it('returns callers that matches the search string', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList(),
          callersById: {
            2: mockList<CallAssignmentCaller>([
              {
                excluded_tags: [],
                first_name: 'Rosa',
                id: 3,
                last_name: 'Luxemburg',
                prioritized_tags: [],
              },
              {
                excluded_tags: [],
                first_name: 'Angela',
                id: 4,
                last_name: 'Davis',
                prioritized_tags: [],
              },
            ]),
          },
          statsById: {},
        },
      });

      const apiClient = instance(mockClient);

      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);

      const future = model.getFilteredCallers('rosa');

      expect(future.data).toEqual([
        {
          excluded_tags: [],
          first_name: 'Rosa',
          id: 3,
          last_name: 'Luxemburg',
          prioritized_tags: [],
        },
      ]);
    });
    it('returns future with no data if no caller matches the search string', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList(),
          callersById: {
            2: mockList<CallAssignmentCaller>([
              {
                excluded_tags: [],
                first_name: 'Rosa',
                id: 3,
                last_name: 'Luxemburg',
                prioritized_tags: [],
              },
              {
                excluded_tags: [],
                first_name: 'Angela',
                id: 4,
                last_name: 'Davis',
                prioritized_tags: [],
              },
            ]),
          },
          statsById: {},
        },
      });

      const apiClient = instance(mockClient);

      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);

      const future = model.getFilteredCallers('boris');

      expect(future.data).toEqual([]);
    });
    it('returns future with no data if there are no callers but a search string', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList(),
          callersById: {
            2: mockList<CallAssignmentCaller>([]),
          },
          statsById: {},
        },
      });

      const apiClient = instance(mockClient);

      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);

      const future = model.getFilteredCallers('rosa');

      expect(future.data).toEqual([]);
    });
  });
});
