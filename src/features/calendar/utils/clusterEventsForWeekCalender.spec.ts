import { CLUSTER_TYPE } from 'features/campaigns/hooks/useClusteredActivities';
import clusterEventsForWeekCalender from './clusterEventsForWeekCalender';
import { ZetkinEvent } from 'utils/types/zetkin';
import {
  ACTIVITIES,
  EventActivity,
} from 'features/campaigns/models/CampaignActivitiesModel';

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
    endDate: null,
    kind: ACTIVITIES.EVENT,
    startDate: null,
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
});
