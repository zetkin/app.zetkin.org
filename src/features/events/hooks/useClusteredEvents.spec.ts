import { renderHook } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';

import { ZetkinEvent } from 'utils/types/zetkin';
import useClusteredEvents, { CLUSTER_TYPE } from './useClusteredEvents';

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

const mockEvent = (id: number, data: Partial<ZetkinEvent>) => ({
  ...mockEventData,
  ...data,
  id,
});

describe('userClusteredEvents()', () => {
  it('does nothing with unrelated events on different days', () => {
    const { result } = renderHook(() =>
      useClusteredEvents([
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
    expect(result.current[0].type).toBe(CLUSTER_TYPE.SINGLE);
    expect(result.current[0].events[0].id).toBe(1);
    expect(result.current[1].type).toBe(CLUSTER_TYPE.SINGLE);
    expect(result.current[1].events[0].id).toBe(2);
    expect(result.current[2].type).toBe(CLUSTER_TYPE.SINGLE);
    expect(result.current[2].events[0].id).toBe(3);
  });
});
