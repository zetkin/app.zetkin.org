import dayjs, { Dayjs } from 'dayjs';

import { useAppSelector } from 'core/hooks';
import useUpcomingEvents from './useUpcomingEvents';
import useSurveysWithElements from 'features/surveys/hooks/useSurveysWithElements';
import { getUTCDateWithoutTime } from 'utils/dateUtils';
import useCurrentCall from './useCurrentCall';
import { ZetkinEvent, ZetkinSurveyExtended } from 'utils/types/zetkin';

type ActivityBase = {
  visibleFrom: Date | null;
  visibleUntil: Date | null;
};

type EventActivity = ActivityBase & {
  data: ZetkinEvent;
  kind: 'event';
};

type SurveyActivity = ActivityBase & {
  data: ZetkinSurveyExtended;
  kind: 'survey';
};

export type Activity = EventActivity | SurveyActivity;

export default function useFilteredActivities(orgId: number) {
  const events = useUpcomingEvents(orgId);
  const surveys = useSurveysWithElements(orgId).data || [];
  const {
    filterState,
    customDatesToFilterEventsBy,
    eventDateFilterState,
    orgIdsToFilterEventsBy,
    projectIdsToFilterActivitiesBy,
  } = useAppSelector((state) => state.call.filters);
  const idsOfEventsRespondedTo = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].respondedEventIds
  );
  const surveySubmissionBySubmissionId = useAppSelector(
    (state) =>
      state.call.lanes[state.call.activeLaneIndex].submissionDataBySurveyId
  );
  const target = useCurrentCall()?.target ?? null;

  const today = new Date();
  const activeSurveys = surveys.filter(
    ({ published, expires }) =>
      published && (!expires || new Date(expires) >= today)
  );

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

  const filteredEvents: EventActivity[] = events
    .filter((event) => {
      if (orgIdsToFilterEventsBy.length == 0) {
        return true;
      }
      return orgIdsToFilterEventsBy.includes(event.organization.id);
    })
    .filter((event) => {
      if (!filterState.alreadyIn) {
        return true;
      }

      if (!target) {
        return false;
      }
      const isBooked = target.future_actions.some(
        (futureEvent) => futureEvent.id == event.id
      );

      const isSignedUp = idsOfEventsRespondedTo.includes(event.id);

      return isSignedUp || isBooked;
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
    })
    .map((event) => ({
      data: event,
      kind: 'event',
      visibleFrom: getUTCDateWithoutTime(event.published || null),
      visibleUntil: getUTCDateWithoutTime(event.end_time || null),
    }));

  const filteredSurveys: SurveyActivity[] = activeSurveys.map((survey) => ({
    data: survey,
    kind: 'survey',
    visibleFrom: getUTCDateWithoutTime(survey.published || null),
    visibleUntil: getUTCDateWithoutTime(survey.expires || null),
  }));

  const filteredActivities: Activity[] = [...filteredEvents, ...filteredSurveys]
    .filter((activity) => {
      if (filterState.alreadyIn && activity.kind == 'survey') {
        return false;
      }

      if (filterState.events && activity.kind == 'survey') {
        return false;
      }

      if (filterState.surveys && activity.kind == 'event') {
        return false;
      }

      return true;
    })
    .filter((activity) => {
      if (projectIdsToFilterActivitiesBy.length == 0) {
        return true;
      }

      if (
        !activity.data.campaign &&
        projectIdsToFilterActivitiesBy.includes('noProject')
      ) {
        return true;
      }

      return (
        activity.data.campaign &&
        projectIdsToFilterActivitiesBy.includes(activity.data.campaign.id)
      );
    })
    .filter((activity) => {
      if (!filterState.thisCall) {
        return true;
      }

      if (activity.kind == 'event') {
        return idsOfEventsRespondedTo.includes(activity.data.id);
      }

      if (activity.kind == 'survey') {
        return Object.keys(surveySubmissionBySubmissionId).includes(
          activity.data.id.toString()
        );
      }
    })
    .sort((a, b) => {
      const aStart = a.visibleFrom;
      const bStart = b.visibleFrom;

      if (!aStart && !bStart) {
        return 0;
      } else if (!aStart) {
        return -1;
      } else if (!bStart) {
        return 1;
      }

      return bStart.getTime() - aStart.getTime();
    });

  return {
    events,
    filteredActivities,
    filteredEvents,
    filteredSurveys,
    getDateRange,
    surveys: activeSurveys,
  };
}
