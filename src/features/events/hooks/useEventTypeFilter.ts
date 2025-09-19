import { useMemo, useCallback } from 'react';

import messageIds from '../l10n/messageIds';
import { toSentenceCase } from 'utils/stringUtils';
import { useMessages } from 'core/i18n';

interface EventWithActivity {
  activity: { title: string } | null;
}

const getLabelFromEventType = (eventType: string | null) => {
  return eventType === null ? 'Uncategorized' : eventType;
};

const getEventTypeFromEvent = (event: EventWithActivity) => {
  const title = event.activity?.title ?? null;
  return title ? toSentenceCase(title) : null;
};

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

  const messages = useMessages(messageIds.filterButtonLabels);
  const filterButtonLabel = messages.eventTypes({
    numEventTypes: state.eventTypesToFilterBy.length,
    singleEventType:
      state.eventTypesToFilterBy.length === 1
        ? getLabelFromEventType(state.eventTypesToFilterBy[0])
        : '',
  });

  const getShouldShowEvent = useCallback(
    (event: EventWithActivity) => {
      if (state.eventTypesToFilterBy.length === 0) {
        return true;
      }
      return state.eventTypesToFilterBy.includes(getEventTypeFromEvent(event));
    },
    [state.eventTypesToFilterBy]
  );

  const getIsCheckedEventType = useCallback(
    (eventType: string | null) =>
      state.eventTypesToFilterBy.includes(eventType),
    [state.eventTypesToFilterBy]
  );

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
    getIsCheckedEventType,
    getLabelFromEventType,
    getShouldShowEvent,
    isFiltered: state.eventTypesToFilterBy.length > 0,
    shouldShowFilter: eventTypes.length > 1,
    toggleEventType,
  };
};
