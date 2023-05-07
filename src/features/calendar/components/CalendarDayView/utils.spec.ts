import { getPreviousDayWithActivities } from './utils';
import mockEvent from 'utils/testing/mocks/mockEvent';
import {
  ACTIVITIES,
  CampaignActivity,
} from 'features/campaigns/models/CampaignActivitiesModel';

const CURRENT_DATE = '2023-05-01T12:00:00';
const DATE_AFTER_CURRENT_DATE = '2023-05-02T12:00:00';
const DATE_BEFORE_CURRENT_DATE = '2023-04-30T12:00:00';
jest.useFakeTimers('modern');
jest.setSystemTime(new Date(CURRENT_DATE));

describe('getPreviousDayWithActivities()', () => {
  it('returns null when there is no event before the provided date', () => {
    const activities: CampaignActivity[] = [
      {
        // Do we need to access the dates internally ever? I think YES for events
        data: mockEvent(),
        endDate: new Date(DATE_AFTER_CURRENT_DATE),
        kind: ACTIVITIES.EVENT,
        startDate: new Date(DATE_AFTER_CURRENT_DATE),
      },
    ];
    const previous = getPreviousDayWithActivities(activities, new Date());
    expect(previous).toBe(null);
  });

  describe('returns the previous day, releative to the provided date, when there is an activity', () => {
    it('when the start date is nearest to the provided date', () => {
      const activities: CampaignActivity[] = [
        // Event before current date
        {
          data: mockEvent(),
          endDate: new Date(DATE_BEFORE_CURRENT_DATE),
          kind: ACTIVITIES.EVENT,
          startDate: new Date(DATE_BEFORE_CURRENT_DATE),
        },
        // Event after current date
        {
          data: mockEvent(),
          endDate: new Date(DATE_AFTER_CURRENT_DATE),
          kind: ACTIVITIES.EVENT,
          startDate: new Date(DATE_AFTER_CURRENT_DATE),
        },
        // Event even earlier than the first
        {
          data: mockEvent(),
          endDate: new Date('2023-01-01'),
          kind: ACTIVITIES.EVENT,
          startDate: new Date('2023-01-01'),
        },
      ];
      const previous = getPreviousDayWithActivities(activities, new Date());
      expect(previous?.toDateString()).toEqual(
        new Date(DATE_BEFORE_CURRENT_DATE).toDateString()
      );
    });

    it('when the end date is nearest to the provided date', () => {
      // This test also includes overlapping dates trying to find the nearest one
      const activities: CampaignActivity[] = [
        // Event after current date
        {
          data: mockEvent(),
          endDate: new Date(DATE_AFTER_CURRENT_DATE),
          kind: ACTIVITIES.EVENT,
          startDate: new Date(DATE_AFTER_CURRENT_DATE),
        },
        // Event that starts long ago but ends right before the current date
        {
          data: mockEvent(),
          endDate: new Date(DATE_BEFORE_CURRENT_DATE),
          kind: ACTIVITIES.EVENT,
          startDate: new Date('2023-01-01'),
        },
        // Event that starts and ends before the current date
        {
          data: mockEvent(),
          endDate: new Date('2023-07-01'),
          kind: ACTIVITIES.EVENT,
          startDate: new Date('2023-02-01'),
        },
      ];
      const previous = getPreviousDayWithActivities(
        activities,
        new Date(CURRENT_DATE)
      );
      expect(previous?.toDateString()).toEqual(
        new Date(DATE_BEFORE_CURRENT_DATE).toDateString()
      );
    });
    it('when the there are events on the current day, before the current time', () => {
      const activities: CampaignActivity[] = [
        // Event before current date on same date
        {
          data: mockEvent(),
          endDate: new Date('2023-05-01T11:00'),
          kind: ACTIVITIES.EVENT,
          startDate: new Date('2023-05-01T10:00'),
        },
        // Event before current date but starting on previous day and ending on current date
        {
          data: mockEvent(),
          endDate: new Date('2023-01-01T10:00:00'),
          kind: ACTIVITIES.EVENT,
          startDate: new Date('2023-04-28T10:00:00'),
        },
      ];
      const previous = getPreviousDayWithActivities(activities, new Date());
      expect(previous?.toDateString()).toEqual(
        new Date('2023-04-28T10:00:00').toDateString()
      );
    });
  });
});
