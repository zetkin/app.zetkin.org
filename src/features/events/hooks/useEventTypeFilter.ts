import { useMemo, useCallback } from 'react';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';

interface EventWithActivity {
  activity: { title: string } | null;
}

const getLabelFromEventType = (eventType: string | null) => {
  return eventType === null ? 'Uncategorized' : eventType;
};

const getEventTypeFromEvent = (event: EventWithActivity) =>
  event.activity?.title ?? null;

/**
 * @param events - Array of events with activity titles to extract types from
 * @param state - External state management object containing the current filter selection and setter function (can be useState or Redux store)
 */
export const useEventTypeFilter = (
  events: EventWithActivity[],
  state: {
    eventTypesToFilterBy: (string | null)[];
    setEventTypesToFilterBy: (eventTypes: (string | null)[]) => void;
  }
) => {
  const messages = useMessages(messageIds.filterButtonLabels);
  const eventTypes = useMemo(() => {
    const uniqueTypes = new Set(events.map(getEventTypeFromEvent));
    return Array.from(uniqueTypes).sort((a, b) => {
      if (a === null) {
        return 1;
      }
      if (b === null) {
        return -1;
      }
      return a.localeCompare(b);
    });
  }, [events, getEventTypeFromEvent]);

  const filterButtonLabel = messages.eventTypes({
    numEventTypes: state.eventTypesToFilterBy.length,
    singleEventType:
      state.eventTypesToFilterBy.length === 1
        ? getLabelFromEventType(state.eventTypesToFilterBy[0])
        : '',
  });

  const toggleEventType = useCallback(
    (eventType: string | null) => {
      const newArray = state.eventTypesToFilterBy.includes(eventType)
        ? state.eventTypesToFilterBy.filter((t) => t !== eventType)
        : [...state.eventTypesToFilterBy, eventType];
      state.setEventTypesToFilterBy(newArray);
    },
    [state]
  );

  const clearEventTypes = useCallback(() => {
    state.setEventTypesToFilterBy([]);
  }, [state.setEventTypesToFilterBy]);

  return {
    clearEventTypes,
    eventTypes,
    filterButtonLabel,
    getLabelFromEventType,
    isFiltered: state.eventTypesToFilterBy.length > 0,
    shouldShowFilter: eventTypes.length > 1,
    toggleEventType,
  };
};

/*  
  Filter logic for a single event.
  We need to export this for reuse in the redux stores
  where the return of the hook is not available 
*/
export const getShouldShowEvent = (
  event: EventWithActivity,
  eventTypesToFilterBy: (string | null)[]
) => {
  if (eventTypesToFilterBy.length === 0) {
    return true;
  }
  return eventTypesToFilterBy.includes(getEventTypeFromEvent(event));
};
