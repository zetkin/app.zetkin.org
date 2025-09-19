import dayjs, { Dayjs } from 'dayjs';

import { useAppSelector } from 'core/hooks';
import useUpcomingEvents from './useUpcomingEvents';
import useSurveysWithElements from 'features/surveys/hooks/useSurveysWithElements';

export default function useFilteredActivities(orgId: number) {
  const events = useUpcomingEvents(orgId);
  const surveys = useSurveysWithElements(orgId).data || [];

  const today = new Date();

  const activeSurveys = surveys.filter(
    ({ published, expires }) =>
      published && (!expires || new Date(expires) >= today)
  );

  const {
    customDatesToFilterEventsBy,
    eventDateFilterState,
    orgIdsToFilterEventsBy,
    projectIdsToFilterSurveysBy,
  } = useAppSelector((state) => state.call.filters);

  const getDateRange = (): [Dayjs | null, Dayjs | null] => {
    const today = dayjs();
    if (!eventDateFilterState || eventDateFilterState == 'custom') {
      return customDatesToFilterEventsBy;
    } else if (eventDateFilterState == 'today') {
      return [today, null];
    } else if (eventDateFilterState == 'tomorrow') {
      return [today.add(1, 'day'), null];
    } else {
      //dateFilterState is 'thisWeek'
      return [today.startOf('week'), today.endOf('week')];
    }
  };

  const filteredEvents = events
    .filter((event) => {
      if (orgIdsToFilterEventsBy.length == 0) {
        return true;
      }
      return orgIdsToFilterEventsBy.includes(event.organization.id);
    })
    .filter((event) => {
      if (
        !eventDateFilterState ||
        (eventDateFilterState == 'custom' && !customDatesToFilterEventsBy[0])
      ) {
        return true;
      }

      const [start, end] = getDateRange();
      const eventStart = dayjs(event.start_time);
      const eventEnd = dayjs(event.end_time);

      if (!end) {
        const isOngoing = eventStart.isBefore(start) && eventEnd.isAfter(start);
        const startsOnSelectedDay = eventStart.isSame(start, 'day');
        const endsOnSelectedDay = eventEnd.isSame(start, 'day');
        return isOngoing || startsOnSelectedDay || endsOnSelectedDay;
      } else {
        const isOngoing =
          eventStart.isBefore(start, 'day') && eventEnd.isAfter(end, 'day');
        const startsInPeriod =
          (eventStart.isSame(start, 'day') ||
            eventStart.isAfter(start, 'day')) &&
          (eventStart.isSame(end, 'day') || eventStart.isBefore(end, 'day'));
        const endsInPeriod =
          (eventEnd.isSame(start, 'day') || eventEnd.isAfter(start, 'day')) &&
          (eventEnd.isBefore(end, 'day') || eventEnd.isSame(end, 'day'));
        return isOngoing || startsInPeriod || endsInPeriod;
      }
    });

  const filteredSurveys = activeSurveys.filter((survey) => {
    if (projectIdsToFilterSurveysBy.length == 0) {
      return true;
    }
    return (
      survey.campaign &&
      projectIdsToFilterSurveysBy.includes(survey.campaign.id)
    );
  });

  return {
    events,
    filteredEvents,
    filteredSurveys,
    getDateRange,
    surveys: activeSurveys,
  };
}
