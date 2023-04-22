import { describe, expect, it } from '@jest/globals';
import { ZetkinEvent } from 'utils/types/zetkin';
import { clusterEventsforWeekCalander } from './clusterdEventsForWeekCalender';
import { ACTIVITIES, EventActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import { CLUSTER_TYPE, ClusteredEvent } from 'features/campaigns/hooks/useClusteredActivities';

const mockEventData: ZetkinEvent = {
  activity: {
    id: 1,
    title: 'Flyering',
  },
  campaign: {
    id: 1,
    title: 'My campaign',
  },
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

describe('clusterEventsforWeekCalander()', () => {
  it('does nothing with unrelated events on the same time but different locations', () => {
    const result = clusterEventsforWeekCalander([
      mockEvent(1, {
        campaign: {
          id: 1,
          title: 'Handing out papers'
        },
        location: {
          id: 1,
          lat: 12123.1,
          lng: 12123.2,
          title: "The square"
        }
      }),
      mockEvent(2, {
        campaign: {
          id: 2,
          title: 'Handing out flyers'
        },
        location: {
          id: 2,
          lat: 12321.1,
          lng: 12321.2,
          title: "The square"
        }
      }),
      mockEvent(3, {
        campaign: {
          id: 3,
          title: 'Going home'
        },
        location: {
          id: 3,
          lat: 12987.1,
          lng: 12987.2,
          title: "The square"
        }
      })
    ])
    expect(result.length).toBe(3);
    expect(result[0].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect((result[0] as ClusteredEvent).events[0].id).toBe(1);
    expect(result[1].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect((result[1] as ClusteredEvent).events[0].id).toBe(2);
    expect(result[2].kind).toBe(CLUSTER_TYPE.SINGLE);
    expect((result[2] as ClusteredEvent).events[0].id).toBe(3);
  })

  it('should cluster events that are related and at the same time but not in the same location', () => {
    const result = clusterEventsforWeekCalander([
      mockEvent(2, {
        location: {
          id: 1,
          lat: 12321.1,
          lng: 12321.2,
          title: "The square"
        }
      }),
      mockEvent(2, {
        location: {
          id: 2,
          lat: 12321.1,
          lng: 12321.2,
          title: "The square"
        }
      }),
    ])
    expect(result.length).toBe(1);
  })

  it('should cluster related events on different locations but split unrelated events based on dates', () => {
    const result = clusterEventsforWeekCalander([
      mockEvent(2, {
        location: {
          id: 1,
          lat: 12321.1,
          lng: 12321.2,
          title: "The square"
        }
      }),
      mockEvent(2, {
        location: {
          id: 2,
          lat: 12321.1,
          lng: 12321.2,
          title: "The square"
        }
      }),
      mockEvent(2, {
        end_time: '1857-07-03T13:00:00.000Z',
        start_time: '1857-07-03T12:00:00.000Z',
        location: {
          id: 2,
          lat: 12321.1,
          lng: 12321.2,
          title: "The square"
        }
      }),
    ])
    expect(result.length).toBe(2);
  })

  it('should cluster related events on different locations but split unrelated events based on activity', () => {
    const result = clusterEventsforWeekCalander([
      mockEvent(112, {
        location: {
          id: 112,
          lat: 12321.1,
          lng: 12321.2,
          title: "The square"
        }
      }),
      mockEvent(321, {
        activity: {
          id: 5,
          title: "Splits hopefully"
        },
        location: {
          id: 2,
          lat: 12321.1,
          lng: 12321.2,
          title: "The square"
        }
      }),
      mockEvent(123, {
        location: {
          id: 2,
          lat: 12321.1,
          lng: 12321.2,
          title: "The square"
        }
      }),
    ])
    expect(result.length).toBe(2);
  })

  it('should cluster not cluster unrelated events in the same locations', () => {
    const result = clusterEventsforWeekCalander([
      mockEvent(112, {
        location: {
          id: 112,
          lat: 12321.1,
          lng: 12321.2,
          title: "The square"
        }
      }),
      mockEvent(321, {
        activity: {
          id: 5,
          title: "Splits hopefully"
        },
        location: {
          id: 112,
          lat: 12321.1,
          lng: 12321.2,
          title: "The square"
        }
      }),
    ])
    expect(result.length).toBe(2);
  })
})