import { CLUSTER_TYPE } from 'features/campaigns/hooks/useClusteredActivities';
import clusterEventsForWeekCalender from './clusterEventsForWeekCalender';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ACTIVITIES, EventActivity } from 'features/campaigns/types';

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
  end_time: '1857-07-05T13:37:00.000Z',
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
  published: null,
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

describe('doArbitraryClustering()', () => {
  it('should not events that do not overlap', () => {
    const result = clusterEventsForWeekCalender([
      mockEvent(1, {
        // 13:00 - 14:00
        end_time: '1857-07-05T14:00:00.000Z',
        start_time: '1857-07-05T13:00:00.000Z',
      }),
      mockEvent(2, {
        // 15:00 - 17:00
        end_time: '1857-07-05T17:00:00.000Z',
        start_time: '1857-07-05T15:00:00.000Z',
      }),
    ]);
    expect(result.length).toBe(3);
    expect(result[0].length).toBe(2);
    expect(result[1].length).toBe(0);
    expect(result[2].length).toBe(0);
  });

  it('should put overlapping clusters in separate lanes', () => {
    const result = clusterEventsForWeekCalender([
      mockEvent(1, {
        // 13:00 - 15:00
        end_time: '1857-07-05T15:00:00.000Z',
        start_time: '1857-07-05T13:00:00.000Z',
      }),
      mockEvent(2, {
        // 14:00 - 16:00
        end_time: '1857-07-05T16:00:00.000Z',
        start_time: '1857-07-05T14:00:00.000Z',
      }),
    ]);
    expect(result.length).toBe(3);
    expect(result[0].length).toBe(1);
    expect(result[0][0].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect(result[0][0].events[0].id).toBe(1);
    expect(result[1].length).toBe(1);
    expect(result[1][0].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect(result[1][0].events[0].id).toBe(2);
  });

  it('should apply regular clustering first', () => {
    const result = clusterEventsForWeekCalender([
      mockEvent(1, {
        // 13:00 - 15:00
        end_time: '1857-07-05T15:00:00.000Z',
        start_time: '1857-07-05T13:00:00.000Z',
      }),
      mockEvent(2, {
        // 15:00 - 17:00
        end_time: '1857-07-05T17:00:00.000Z',
        start_time: '1857-07-05T15:00:00.000Z',
      }),
      mockEvent(3, {
        // 14:00 - 16:00
        end_time: '1857-07-05T16:00:00.000Z',
        start_time: '1857-07-05T14:00:00.000Z',
      }),
      mockEvent(4, {
        // 16:00 - 18:00
        end_time: '1857-07-05T18:00:00.000Z',
        start_time: '1857-07-05T16:00:00.000Z',
      }),
    ]);
    expect(result.length).toBe(3);
    expect(result[0].length).toBe(1);
    expect(result[0][0].kind).toBe(CLUSTER_TYPE.MULTI_SHIFT);
    expect(result[0][0].events[0].id).toBe(1);
    expect(result[0][0].events[1].id).toBe(2);
    expect(result[1].length).toBe(1);
    expect(result[1][0].kind).toBe(CLUSTER_TYPE.MULTI_SHIFT);
    expect(result[1][0].events[0].id).toBe(3);
    expect(result[1][0].events[1].id).toBe(4);
  });

  it('should arbitrarily cluster single events when lanes are full', () => {
    const result = clusterEventsForWeekCalender([
      mockEvent(1, {
        // 13:00 - 17:00
        end_time: '1857-07-05T17:00:00.000Z',
        start_time: '1857-07-05T13:00:00.000Z',
      }),
      mockEvent(2, {
        // 14:00 - 17:00
        end_time: '1857-07-05T17:00:00.000Z',
        start_time: '1857-07-05T14:00:00.000Z',
      }),
      mockEvent(3, {
        // 15:00 - 17:00
        end_time: '1857-07-05T17:00:00.000Z',
        start_time: '1857-07-05T15:00:00.000Z',
      }),
      mockEvent(4, {
        // 16:00 - 17:00
        end_time: '1857-07-05T17:00:00.000Z',
        start_time: '1857-07-05T16:00:00.000Z',
      }),
    ]);

    expect(result.length).toBe(3);
    expect(result[0].length).toBe(1);
    expect(result[0][0].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect(result[1].length).toBe(1);
    expect(result[1][0].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect(result[2].length).toBe(1);
    expect(result[2][0].kind).toBe(CLUSTER_TYPE.ARBITRARY);
    expect(result[2][0].events[0].id).toBe(3);
    expect(result[2][0].events[1].id).toBe(4);
  });

  it('should merge clusters in last lane when lanes are full', () => {
    const result = clusterEventsForWeekCalender([
      mockEvent(1, {
        // 10:00 - 14:00
        end_time: '1857-07-05T14:00:00.000Z',
        location: { id: 1, lat: 0, lng: 0, title: '' },
        start_time: '1857-07-05T10:00:00.000Z',
      }),
      mockEvent(2, {
        // 10:00 - 14:00
        end_time: '1857-07-05T14:00:00.000Z',
        location: { id: 2, lat: 0, lng: 0, title: '' },
        start_time: '1857-07-05T10:00:00.000Z',
      }),
      mockEvent(3, {
        // 11:00 - 14:00
        end_time: '1857-07-05T14:00:00.000Z',
        location: { id: 3, lat: 0, lng: 0, title: '' },
        start_time: '1857-07-05T11:00:00.000Z',
      }),
      mockEvent(4, {
        // 11:00 - 14:00
        end_time: '1857-07-05T14:00:00.000Z',
        location: { id: 4, lat: 0, lng: 0, title: '' },
        start_time: '1857-07-05T11:00:00.000Z',
      }),
      mockEvent(5, {
        // 12:00 - 14:00
        end_time: '1857-07-05T14:00:00.000Z',
        location: { id: 5, lat: 0, lng: 0, title: '' },
        start_time: '1857-07-05T12:00:00.000Z',
      }),
      mockEvent(6, {
        // 12:00 - 14:00
        end_time: '1857-07-05T14:00:00.000Z',
        location: { id: 6, lat: 0, lng: 0, title: '' },
        start_time: '1857-07-05T12:00:00.000Z',
      }),
      mockEvent(7, {
        // 13:00 - 14:00
        end_time: '1857-07-05T14:00:00.000Z',
        location: { id: 7, lat: 0, lng: 0, title: '' },
        start_time: '1857-07-05T13:00:00.000Z',
      }),
      mockEvent(8, {
        // 13:00 - 14:00
        end_time: '1857-07-05T14:00:00.000Z',
        location: { id: 8, lat: 0, lng: 0, title: '' },
        start_time: '1857-07-05T13:00:00.000Z',
      }),
    ]);

    expect(result.length).toBe(3);
    expect(result[0].length).toBe(1);
    expect(result[0][0].kind).toBe(CLUSTER_TYPE.MULTI_LOCATION);
    expect(result[1].length).toBe(1);
    expect(result[1][0].kind).toBe(CLUSTER_TYPE.MULTI_LOCATION);
    expect(result[2].length).toBe(1);
    expect(result[2][0].kind).toBe(CLUSTER_TYPE.ARBITRARY);
    expect(result[2][0].events[0].id).toBe(5);
    expect(result[2][0].events[1].id).toBe(6);
    expect(result[2][0].events[2].id).toBe(7);
    expect(result[2][0].events[3].id).toBe(8);
  });
});
