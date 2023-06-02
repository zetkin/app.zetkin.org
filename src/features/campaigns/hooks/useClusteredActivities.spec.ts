import { renderHook } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';

import {
  ACTIVITIES,
  CallAssignmentActivity,
  EventActivity,
  SurveyActivity,
} from '../models/CampaignActivitiesModel';
import useClusteredActivities, {
  CLUSTER_TYPE,
  ClusteredEvent,
} from './useClusteredActivities';
import {
  ZetkinCallAssignment,
  ZetkinEvent,
  ZetkinSurvey,
} from 'utils/types/zetkin';

const mockEventData: ZetkinEvent = {
  activity: {
    id: 1,
    title: 'Flyering',
  },
  campaign: {
    id: 1,
    title: 'My campaign',
  },
  cancelled: null,
  contact: null,
  end_time: '1857-07-05T14:37:00.000Z',
  id: 1,
  info_text: '',
  location: {
    id: 1,
    lat: 0,
    lng: 0,
    title: 'Dorfplatz',
  },
  num_participants_available: 0,
  num_participants_required: 0,
  organization: {
    id: 1,
    title: 'KPD',
  },
  published: '1857-07-05T13:37:00.000Z',
  start_time: '1857-07-05T13:37:00.000Z',
};

function mockEvent(id: number, data: Partial<ZetkinEvent>): EventActivity {
  return {
    data: {
      ...mockEventData,
      ...data,
      id,
    },
    kind: ACTIVITIES.EVENT,
    visibleFrom: null,
    visibleUntil: null,
  };
}

describe('useClusteredActivities()', () => {
  it('does nothing with unrelated events on different days', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(1, {
          end_time: '1857-07-01T13:00:00.000Z',
          start_time: '1857-07-01T12:00:00.000Z',
        }),
        mockEvent(2, {
          end_time: '1857-07-02T13:00:00.000Z',
          start_time: '1857-07-02T12:00:00.000Z',
        }),
        mockEvent(3, {
          end_time: '1857-07-03T13:00:00.000Z',
          start_time: '1857-07-03T12:00:00.000Z',
        }),
      ])
    );

    expect(result.current.length).toBe(3);
    expect(result.current[0].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect((result.current[0] as ClusteredEvent).events[0].id).toBe(1);
    expect(result.current[1].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect((result.current[1] as ClusteredEvent).events[0].id).toBe(2);
    expect(result.current[2].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect((result.current[2] as ClusteredEvent).events[0].id).toBe(3);
  });

  it('clusters three multi-shift events and leaves a third unrelated', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(1, {
          end_time: '1857-07-05T13:00:00.000Z',
          start_time: '1857-07-05T12:00:00.000Z',
        }),
        mockEvent(2, {
          end_time: '1857-07-05T14:00:00.000Z',
          start_time: '1857-07-05T13:00:00.000Z',
        }),
        mockEvent(3, {
          end_time: '1857-07-05T15:00:00.000Z',
          start_time: '1857-07-05T14:00:00.000Z',
        }),
        mockEvent(4, {
          end_time: '1857-07-05T17:00:00.000Z',
          start_time: '1857-07-05T16:00:00.000Z',
        }),
      ])
    );

    expect(result.current.length).toBe(2);
    expect(result.current[0].kind).toBe(CLUSTER_TYPE.MULTI_SHIFT);
    expect((result.current[0] as ClusteredEvent).events.length).toBe(3);
    expect((result.current[0] as ClusteredEvent).events[0].id).toBe(1);
    expect((result.current[0] as ClusteredEvent).events[1].id).toBe(2);
    expect((result.current[0] as ClusteredEvent).events[2].id).toBe(3);
    expect(result.current[1].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect((result.current[1] as ClusteredEvent).events.length).toBe(1);
    expect((result.current[1] as ClusteredEvent).events[0].id).toBe(4);
  });

  it('clusters two multi-shift events, but ignores events in different location', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(1, {
          end_time: '1857-07-05T13:00:00.000Z',
          location: {
            id: 1,
            lat: 0,
            lng: 0,
            title: '',
          },
          start_time: '1857-07-05T12:00:00.000Z',
        }),
        mockEvent(2, {
          end_time: '1857-07-05T14:00:00.000Z',
          location: {
            id: 1,
            lat: 0,
            lng: 0,
            title: '',
          },
          start_time: '1857-07-05T13:00:00.000Z',
        }),
        mockEvent(3, {
          end_time: '1857-07-05T15:00:00.000Z',
          location: {
            id: 2, // <-- Different location
            lat: 0,
            lng: 0,
            title: '',
          },
          start_time: '1857-07-05T14:00:00.000Z',
        }),
      ])
    );

    expect(result.current.length).toBe(2);
    expect(result.current[0].kind).toBe(CLUSTER_TYPE.MULTI_SHIFT);
    expect((result.current[0] as ClusteredEvent).events.length).toBe(2);
    expect((result.current[0] as ClusteredEvent).events[0].id).toBe(1);
    expect((result.current[0] as ClusteredEvent).events[1].id).toBe(2);
    expect(result.current[1].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect((result.current[1] as ClusteredEvent).events.length).toBe(1);
    expect((result.current[1] as ClusteredEvent).events[0].id).toBe(3);
  });

  it('includes non-event activities in the correct order', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(1, {
          end_time: '1857-07-05T13:00:00.000Z',
          location: {
            id: 1,
            lat: 0,
            lng: 0,
            title: '',
          },
          start_time: '1857-07-05T12:00:00.000Z',
        }),
        {
          // Fake data, will never be used
          data: { id: 1 } as ZetkinSurvey,
          kind: ACTIVITIES.SURVEY,
          // This should appear first
          visibleFrom: new Date('1857-07-05T11:37:00.000Z'),
          visibleUntil: new Date('1857-07-06T13:37:00.000Z'),
        },
        {
          // Fake data, will never be used
          data: { id: 2 } as ZetkinCallAssignment,
          kind: ACTIVITIES.CALL_ASSIGNMENT,
          // This should appear last
          visibleFrom: new Date('1857-07-05T13:37:00.000Z'),
          visibleUntil: new Date('1857-07-06T13:37:00.000Z'),
        },
        mockEvent(2, {
          end_time: '1857-07-05T14:00:00.000Z',
          location: {
            id: 1,
            lat: 0,
            lng: 0,
            title: '',
          },
          start_time: '1857-07-05T13:00:00.000Z',
        }),
      ])
    );

    expect(result.current.length).toBe(3);
    expect(result.current[0].kind).toBe(ACTIVITIES.SURVEY);
    expect(result.current[1].kind).toBe(CLUSTER_TYPE.MULTI_SHIFT);
    expect(result.current[2].kind).toBe(ACTIVITIES.CALL_ASSIGNMENT);

    expect((result.current[0] as SurveyActivity).data.id).toBe(1);
    expect((result.current[2] as CallAssignmentActivity).data.id).toBe(2);
  });
  it('does nothing with unrelated events on the same time but different locations', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(1, {
          campaign: {
            id: 1,
            title: 'Handing out papers',
          },
          location: {
            id: 1,
            lat: 12123.1,
            lng: 12123.2,
            title: 'The square',
          },
        }),
        mockEvent(2, {
          campaign: {
            id: 2,
            title: 'Handing out flyers',
          },
          location: {
            id: 2,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square',
          },
        }),
        mockEvent(3, {
          campaign: {
            id: 3,
            title: 'Going home',
          },
          location: {
            id: 3,
            lat: 12987.1,
            lng: 12987.2,
            title: 'The square',
          },
        }),
      ])
    );
    expect(result.current.length).toBe(3);
    expect(result.current[0].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect((result.current[0] as ClusteredEvent).events[0].id).toBe(1);
    expect(result.current[1].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect((result.current[1] as ClusteredEvent).events[0].id).toBe(2);
    expect(result.current[2].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect((result.current[2] as ClusteredEvent).events[0].id).toBe(3);
  });

  it('does nothing with two identical events but with no physical locations', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(1, {
          location: null,
        }),
        mockEvent(2, {
          location: null,
        }),
      ])
    );
    expect(result.current.length).toBe(2);
    expect(result.current[0].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect(result.current[1].kind).toBe(CLUSTER_TYPE.SINGLE);
  });

  it('should cluster events that are related and at the same time but not in the same location', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(2, {
          location: {
            id: 1,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square',
          },
        }),
        mockEvent(2, {
          location: {
            id: 2,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square',
          },
        }),
      ])
    );
    expect(result.current.length).toBe(1);
  });

  it('should cluster related events on different locations but split unrelated events based on dates', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(2, {
          location: {
            id: 1,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square',
          },
        }),
        mockEvent(2, {
          location: {
            id: 2,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square',
          },
        }),
        mockEvent(2, {
          end_time: '1857-07-03T13:00:00.000Z',
          location: {
            id: 2,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square',
          },
          start_time: '1857-07-03T12:00:00.000Z',
        }),
      ])
    );
    expect(result.current.length).toBe(2);
  });

  it('should cluster related events on different locations but split unrelated events based on activity', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(112, {
          location: {
            id: 112,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square',
          },
        }),
        mockEvent(321, {
          activity: {
            id: 5,
            title: 'Splits hopefully',
          },
          location: {
            id: 2,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square',
          },
        }),
        mockEvent(123, {
          location: {
            id: 2,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square',
          },
        }),
      ])
    );
    expect(result.current.length).toBe(2);
  });

  it('should not cluster unrelated events in the same locations', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(112, {
          location: {
            id: 112,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square',
          },
        }),
        mockEvent(321, {
          activity: {
            id: 5,
            title: 'Splits hopefully',
          },
          location: {
            id: 112,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square',
          },
        }),
      ])
    );
    expect(result.current.length).toBe(2);
  });

  it('should not cluster unrelated events in the same locations', () => {
    const { result } = renderHook(() =>
      useClusteredActivities([
        mockEvent(9, {
          location: {
            id: 112,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square1',
          },
        }),
        mockEvent(10, {
          location: {
            id: 222,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square2',
          },
        }),
        mockEvent(11, {
          location: {
            id: 2222,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square3',
          },
        }),
        mockEvent(321, {
          activity: {
            id: 5,
            title: 'Splits hopefully',
          },
          location: {
            id: 112,
            lat: 12321.1,
            lng: 12321.2,
            title: 'The square',
          },
        }),
        mockEvent(1, {
          end_time: '1857-07-05T13:00:00.000Z',
          location: {
            id: 1,
            lat: 0,
            lng: 0,
            title: '',
          },
          start_time: '1857-07-05T12:00:00.000Z',
        }),
        mockEvent(2, {
          end_time: '1857-07-05T14:00:00.000Z',
          location: {
            id: 1,
            lat: 0,
            lng: 0,
            title: '',
          },
          start_time: '1857-07-05T13:00:00.000Z',
        }),
        mockEvent(3, {
          end_time: '1857-07-05T15:00:00.000Z',
          location: {
            id: 2, // <-- Different location
            lat: 0,
            lng: 0,
            title: '',
          },
          start_time: '1857-07-05T14:00:00.000Z',
        }),
      ])
    );
    expect(result.current.length).toBe(4);
  });
});
