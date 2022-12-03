import { anything, instance, mock, reset, when } from 'ts-mockito';

import createStore from 'core/store';
import Environment from 'core/env/Environment';
import { FILTER_TYPE } from 'features/smartSearch/components/types';
import IApiClient from 'core/api/client/IApiClient';
import { CallAssignmentData, CallAssignmentStats } from '../apiTypes';
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
              id: 2,
              target: {
                filter_spec: [],
                id: 101,
              },
              title: 'My assignment',
            },
          ]),
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
              id: 2,
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
    const mockAssignment = {
      cooldown: 3,
      id: 2,
      target: {
        filter_spec: [],
        id: 101,
      },
      title: 'My assignment',
    };

    afterEach(() => {
      jest.useRealTimers();
    });

    it('is UNKNOWN when not loaded', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList<CallAssignmentData>(),
          statsById: {},
        },
      });

      when(mockClient.get<CallAssignmentData>(anything())).thenResolve(
        mockAssignment
      );

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.UNKNOWN);
    });

    it('is DRAFT when there is no start date', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList<CallAssignmentData>([
            {
              ...mockAssignment,
            },
          ]),
          statsById: {},
        },
      });

      jest.useFakeTimers().setSystemTime(new Date('1857-07-04'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.DRAFT);
    });

    it('is SCHEDULED when start date is in the future', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList<CallAssignmentData>([
            {
              ...mockAssignment,
              end_date: '1933-06-20',
              start_date: '1857-07-05',
            },
          ]),
          statsById: {},
        },
      });

      jest.useFakeTimers().setSystemTime(new Date('1857-07-04'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.SCHEDULED);
    });

    it('is OPEN when start_date is in the past and end_date in the future', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList<CallAssignmentData>([
            {
              ...mockAssignment,
              end_date: '1933-06-20',
              start_date: '1857-07-05',
            },
          ]),
          statsById: {},
        },
      });

      jest.useFakeTimers().setSystemTime(new Date('1857-07-08'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.OPEN);
    });

    it('is OPEN when start_date is in the past and there is no end_date', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList<CallAssignmentData>([
            {
              ...mockAssignment,
              start_date: '1857-07-05',
            },
          ]),
          statsById: {},
        },
      });

      jest.useFakeTimers().setSystemTime(new Date('1857-08-04'));

      const apiClient = instance(mockClient);
      const env = new Environment(store, apiClient);
      const model = new CallAssignmentModel(env, 1, 2);
      expect(model.state).toBe(CallAssignmentState.OPEN);
    });

    it('is CLOSED when end date is in the past', () => {
      const store = createStore({
        callAssignments: {
          assignmentList: mockList<CallAssignmentData>([
            {
              ...mockAssignment,
              end_date: '1933-06-20',
              start_date: '1857-07-05',
            },
          ]),
          statsById: {},
        },
      });

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
              id: 2,
              target: {
                filter_spec: [],
                id: 101,
              },
              title: 'My assignment',
            },
          ]),
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
              id: 2,
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
              id: 2,
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
        organizerActionNeeded: 0,
        queue: 0,
        ready: 50,
      });
      expect(future.isLoading).toBeFalsy();
      expect(future.error).toBeNull();
    });
  });
});
