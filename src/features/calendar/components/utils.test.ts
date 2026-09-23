import { describe, it, expect } from '@jest/globals';

import { ProjectActivity } from 'features/projects/types';
import { mockEvent } from 'features/projects/hooks/useClusteredActivities.spec';
import { getActivitiesByDay, isAllDay } from './utils';

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

describe('isAllDay', () => {
  it('returns true for a single-day all-day event (starts at midnight and ends at midnight next day)', () => {
    expect(isAllDay('2026-05-10T00:00:00', '2026-05-11T00:00:00')).toBe(true);
  });

  it('returns true for a multi-day all-day event', () => {
    expect(isAllDay('2026-05-10T00:00:00', '2026-05-13T00:00:00')).toBe(true);
  });

  it('returns true for all-day events with timezone offset', () => {
    expect(
      isAllDay('2026-05-10T00:00:00+02:00', '2026-05-11T00:00:00+02:00')
    ).toBe(true);
  });

  it('returns false when start date and end date are on the same day', () => {
    expect(isAllDay('2026-05-10T10:00:00', '2026-05-10T12:00:00')).toBe(false);
  });

  it('returns false for zero-duration event starting and ending at midnight on the same day', () => {
    expect(isAllDay('2026-05-10T00:00:00', '2026-05-10T00:00:00')).toBe(false);
  });

  it('returns false when event starts at midnight but ends at a non-midnight time', () => {
    expect(isAllDay('2026-05-10T00:00:00', '2026-05-11T12:00:00')).toBe(false);
  });

  it('returns false when event starts at a non-midnight time and ends at midnight', () => {
    expect(isAllDay('2026-05-10T10:00:00', '2026-05-11T00:00:00')).toBe(false);
  });

  it('returns false for multi-day events that do not start and end at midnight', () => {
    expect(isAllDay('2026-05-10T10:00:00', '2026-05-12T15:00:00')).toBe(false);
  });
});
