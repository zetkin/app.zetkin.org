import dayjs from 'dayjs';
import { NextRouter } from 'next/router';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';

import createStore from 'core/store';
import Environment from 'core/env/Environment';
import { FILTER_TYPE } from 'features/smartSearch/components/types';
import IApiClient from 'core/api/client/IApiClient';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import {
  Call,
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
  const mockRouter = mock<NextRouter>();

  beforeEach(() => {
    reset(mockClient);
    reset(mockRouter);
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
            campaign: null,
            cooldown: 3,
            description: '',
            disable_caller_notes: false,
            end_date: endDate,
            expose_target_details: false,
            goal: {
              filter_spec: [],
              id: 102,
            },
            id: 2,
            instructions: 'Be nice when you call people.',
            organization: {
              id: 1,
              title: '',
            },
            start_date: startDate,
            target: {
              filter_spec: [{ config: {}, type: FILTER_TYPE.ALL }],
              id: 101,
            },
            title: 'My assignment',
          },
        ]),
        callList: mockList<Call>(),
        callersById: {},
        statsById: {
          2: mockItem({
            allTargets: 100,
            allocated: 0,
            blocked: 0,
            callBackLater: 0,
            calledTooRecently: 0,
            callsMade: 0,
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
          callList: mockList<Call>(),
          callersById: {},
          statsById: {},
        },
      });

      const mockData = mockStoreData();
      when(mockClient.get<CallAssignmentData>(anything())).thenResolve(
        mockData.callAssignments.assignmentList.items[0].data!
      );

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.UNKNOWN);
    });

    it('is DRAFT when there is no start date', () => {
      const store = createStore(mockStoreData());

      jest.useFakeTimers().setSystemTime(new Date('1857-07-04'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.DRAFT);
    });

    it('is SCHEDULED when start date is in the future', () => {
      const store = createStore(mockStoreData('1857-07-05', '1933-06-20'));
      jest.useFakeTimers().setSystemTime(new Date('1857-07-04'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.SCHEDULED);
    });

    it('is OPEN when start_date is in the past and end_date in the future', () => {
      const store = createStore(mockStoreData('1857-07-05', '1933-06-20'));
      jest.useFakeTimers().setSystemTime(new Date('1857-07-08'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.OPEN);
    });

    it('is OPEN when start_date is in the past and there is no end_date', () => {
      const store = createStore(mockStoreData('1857-07-05'));
      jest.useFakeTimers().setSystemTime(new Date('1857-08-04'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.OPEN);
    });

    it('is OPEN when dates are correct, and most recent call was too long ago', () => {
      jest.useFakeTimers().setSystemTime(new Date('1857-08-04T14:37:00Z'));

      const store = createStore(
        mockStoreData('1857-07-05', '1933-06-20', '1857-08-04T13:37:00Z')
      );

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.OPEN);
    });

    it('is ACTIVE when open with very recent call', () => {
      jest.useFakeTimers().setSystemTime(new Date('1857-08-04T13:38:00'));

      const store = createStore(
        mockStoreData('1857-07-05', '1933-06-20', '1857-08-04T13:37:00Z')
      );

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.ACTIVE);
    });

    it('is CLOSED when end date is in the past', () => {
      const store = createStore(mockStoreData('1857-07-05', '1933-06-20'));

      jest.useFakeTimers().setSystemTime(new Date('1933-06-21'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
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
              campaign: null,
              cooldown: 3,
              description: '',
              disable_caller_notes: false,
              end_date: null,
              expose_target_details: false,
              goal: {
                filter_spec: [],
                id: 102,
              },
              id: 2,
              instructions: 'Be nice when you call people.',
              organization: {
                id: 1,
                title: '',
              },
              start_date: null,
              target: {
                filter_spec: [],
                id: 101,
              },
              title: 'My assignment',
            },
          ]),
          callList: mockList<Call>(),
          callersById: {},
          statsById: {},
        },
      });

      const apiClient = instance(mockClient);

      const env = new Environment(store, apiClient, instance(mockRouter));
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
              campaign: null,
              cooldown: 3,
              description: '',
              disable_caller_notes: false,
              end_date: null,
              expose_target_details: false,
              goal: {
                filter_spec: [],
                id: 102,
              },
              id: 2,
              instructions: 'Be nice when you call people.',
              organization: {
                id: 1,
                title: '',
              },
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
          callList: mockList<Call>(),
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
        callsMade: 0,
        done: 50,
        id: 2,
        missingPhoneNumber: 0,
        mostRecentCallTime: null,
        organizerActionNeeded: 0,
        queue: 0,
        ready: 50,
      });

      const apiClient = instance(mockClient);

      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);

      const future = model.getStats();

      expect(future.data).toEqual({
        allTargets: 0,
        allocated: 0,
        blocked: 0,
        callBackLater: 0,
        calledTooRecently: 0,
        callsMade: 0,
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
              campaign: null,
              cooldown: 3,
              description: '',
              disable_caller_notes: false,
              end_date: null,
              expose_target_details: false,
              goal: {
                filter_spec: [],
                id: 102,
              },
              id: 2,
              instructions: 'Be nice when you call people.',
              organization: {
                id: 1,
                title: '',
              },
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
          callList: mockList<Call>(),
          callersById: {},
          statsById: {
            2: mockItem({
              allTargets: 100,
              allocated: 0,
              blocked: 0,
              callBackLater: 0,
              calledTooRecently: 0,
              callsMade: 0,
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

      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);

      const future = model.getStats();

      expect(future.data).toEqual({
        allTargets: 100,
        allocated: 0,
        blocked: 0,
        callBackLater: 0,
        calledTooRecently: 0,
        callsMade: 0,
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

  describe('getFilteredCallers()', () => {
    it('returns all callers if the search string is empty', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList(),
          callList: mockList<Call>(),
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

      const env = new Environment(store, apiClient, instance(mockRouter));
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
          callList: mockList<Call>(),
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

      const env = new Environment(store, apiClient, instance(mockRouter));
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
          callList: mockList<Call>(),
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

      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);

      const future = model.getFilteredCallers('boris');

      expect(future.data).toEqual([]);
    });

    it('returns future with no data if there are no callers but a search string', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList(),
          callList: mockList<Call>(),
          callersById: {
            2: mockList<CallAssignmentCaller>([]),
          },
          statsById: {},
        },
      });

      const apiClient = instance(mockClient);

      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);

      const future = model.getFilteredCallers('rosa');

      expect(future.data).toEqual([]);
    });
  });

  describe('start()', () => {
    const mockStoreData = (
      startDate: string | null = null,
      endDate: string | null = null
    ) => ({
      callAssignments: {
        assignmentList: mockList<CallAssignmentData>([
          {
            campaign: null,
            cooldown: 3,
            description: '',
            disable_caller_notes: false,
            end_date: endDate,
            expose_target_details: false,
            goal: {
              filter_spec: [],
              id: 102,
            },
            id: 2,
            instructions: 'Be nice when you call people.',
            organization: {
              id: 1,
              title: '',
            },
            start_date: startDate,
            target: {
              filter_spec: [{ config: {}, type: FILTER_TYPE.ALL }],
              id: 101,
            },
            title: 'My assignment',
          },
        ]),
        callList: mockList<Call>(),
        callersById: {},
        statsById: {},
      },
    });

    const pastDate = (days = 1) =>
      dayjs().subtract(days, 'day').format('YYYY-MM-DD');
    const futureDate = (days = 1) =>
      dayjs().add(days, 'day').format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');

    beforeEach(() => {
      when(mockClient.patch(anything(), anything())).thenResolve({});
    });

    it.each([
      [pastDate(3), pastDate(1), { end_date: null }],
      [pastDate(3), today, { end_date: null }],
      [today, today, { end_date: null }],
      [futureDate(1), futureDate(3), { start_date: today }],
      [futureDate(1), null, { start_date: today }],
      [null, pastDate(1), { end_date: null, start_date: today }],
      [null, futureDate(1), { start_date: today }],
      [null, null, { start_date: today }],
    ])(
      'updates correctly when start is %p, end is %p',
      (startDate, endDate, expectedData) => {
        const store = createStore(mockStoreData(startDate, endDate));
        const apiClient = instance(mockClient);
        const env = new Environment(store, apiClient, instance(mockRouter));
        const model = new CallAssignmentModel(env, 1, 2);
        model.start();

        const [url, data] = capture<string, Partial<ZetkinCallAssignment>>(
          mockClient.patch
        ).last();
        expect(url).toBe('/api/orgs/1/call_assignments/2');
        expect(data).toEqual(expectedData);
      }
    );
  });

  describe('end()', () => {
    const mockStoreData = (
      startDate: string | null = null,
      endDate: string | null = null
    ) => ({
      callAssignments: {
        assignmentList: mockList<CallAssignmentData>([
          {
            campaign: null,
            cooldown: 3,
            description: '',
            disable_caller_notes: false,
            end_date: endDate,
            expose_target_details: false,
            goal: {
              filter_spec: [],
              id: 102,
            },
            id: 2,
            instructions: 'Be nice when you call people.',
            organization: {
              id: 1,
              title: '',
            },
            start_date: startDate,
            target: {
              filter_spec: [{ config: {}, type: FILTER_TYPE.ALL }],
              id: 101,
            },
            title: 'My assignment',
          },
        ]),
        callList: mockList<Call>(),
        callersById: {},
        statsById: {},
      },
    });

    const pastDate = (days = 1) =>
      dayjs().subtract(days, 'day').format('YYYY-MM-DD');
    const futureDate = (days = 1) =>
      dayjs().add(days, 'day').format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');

    beforeEach(() => {
      when(mockClient.patch(anything(), anything())).thenResolve({});
    });

    it('sets end date to today when start is past, end is future', () => {
      const store = createStore(mockStoreData(pastDate(1), futureDate(1)));
      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);
      model.end();

      const [url, data] = capture<string, Partial<ZetkinCallAssignment>>(
        mockClient.patch
      ).last();
      expect(url).toBe('/api/orgs/1/call_assignments/2');
      expect(data).toEqual({
        end_date: today,
      });
    });

    it('sets end date to today when start is past, end is null', () => {
      const store = createStore(mockStoreData(null, null));
      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient, instance(mockRouter));
      const model = new CallAssignmentModel(env, 1, 2);
      model.end();

      const [url, data] = capture<string, Partial<ZetkinCallAssignment>>(
        mockClient.patch
      ).last();
      expect(url).toBe('/api/orgs/1/call_assignments/2');
      expect(data).toEqual({
        end_date: today,
      });
    });
  });
});
