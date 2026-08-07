import { describe, it, expect } from '@jest/globals';

import { ProjectActivity } from 'features/projects/types';
import { mockEvent } from 'features/projects/hooks/useClusteredActivities.spec';
import { getActivitiesByDay } from './utils';

describe('getActivitiesByDay', () => {
  it('returns an empty object when given no activities', () => {
    expect(getActivitiesByDay([])).toEqual({});
  });

  it('groups a single-day event correctly', () => {
    const event: ProjectActivity = mockEvent(1, {
      end_time: '2026-05-10T12:00:00',
      start_time: '2026-05-10T10:00:00',
      title: 'Single Day Event',
    });
    const result = getActivitiesByDay([event]);
    expect(result).toMatchObject({
      '2026-05-10': [
        {
          data: {
            end_time: '2026-05-10T12:00:00',
            start_time: '2026-05-10T10:00:00',
            title: 'Single Day Event',
          },
        },
      ],
    });
  });

  it('splits a multi-day event across days', () => {
    const event = mockEvent(2, {
      end_time: '2026-05-12T12:00:00',
      start_time: '2026-05-10T10:00:00',
      title: 'Multi Day Event',
    });
    const result = getActivitiesByDay([event]);
    expect(result).toMatchObject({
      '2026-05-10': [
        {
          data: {
            end_time: '2026-05-10T23:59:59',
            start_time: '2026-05-10T10:00:00',
          },
        },
      ],
      '2026-05-11': [
        {
          data: {
            end_time: '2026-05-11T23:59:59',
            start_time: '2026-05-11T00:00:00',
          },
        },
      ],
      '2026-05-12': [
        {
          data: {
            end_time: '2026-05-12T12:00:00',
            start_time: '2026-05-12T00:00:00',
          },
        },
      ],
    });
  });

  it('handles overlapping events on the same day', () => {
    const event1 = mockEvent(3, {
      end_time: '2026-05-10T10:00:00',
      start_time: '2026-05-10T08:00:00',
      title: 'Event 1',
    });
    const event2 = mockEvent(4, {
      end_time: '2026-05-10T11:00:00',
      start_time: '2026-05-10T09:00:00',
      title: 'Event 2',
    });
    const result = getActivitiesByDay([event1, event2]);
    expect(result).toMatchObject({
      '2026-05-10': [
        {
          data: {
            end_time: '2026-05-10T10:00:00',
            start_time: '2026-05-10T08:00:00',
            title: 'Event 1',
          },
        },
        {
          data: {
            end_time: '2026-05-10T11:00:00',
            start_time: '2026-05-10T09:00:00',
            title: 'Event 2',
          },
        },
      ],
    });
  });
});
