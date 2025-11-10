import { useMemo, useCallback } from 'react';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';

interface EventWithActivity {
  activity: { title: string } | null;
}

const NULL_EVENT_TYPE = 'Uncategorized';

// Get the hook's internal eventType representation from the event
const getEventTypeFromEvent = (event: EventWithActivity) => {
  const title = event.activity?.title ?? NULL_EVENT_TYPE;
  return title.trim();
};

// Lowercase strings are considered equal: "My Type", "My type" and "MY TYPE" will be deduplicated.
const normalizeEventType = (eventType: string) => eventType.toLowerCase();

/**
 * @param events - Array of events with activity titles to extract types from
 * @param state - External state management object containing the current filter selection and setter function (can be useState or Redux store)
 */
export const useEventTypeFilter = (
  events: EventWithActivity[],
  state: {
    eventTypeLabelsToFilterBy: string[];
    setEventTypeLabelsToFilterBy: (eventTypes: string[]) => void;
  }
) => {
  // Map that translates the hook's internal eventType to the deduplicated eventTypeLabel.
  // First occurrence wins!
  const eventTypeToLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    const normalizedLookup = new Map<string, string>();

    for (const event of events) {
      const eventType = getEventTypeFromEvent(event);

      if (!map.has(eventType)) {
        const normalizedKey = normalizeEventType(eventType);
        const existingLabel = normalizedLookup.get(normalizedKey);

        if (!existingLabel) {
          normalizedLookup.set(normalizedKey, eventType);
          map.set(eventType, eventType);
        } else {
          map.set(eventType, existingLabel);
        }
      }
    }

    return map;
  }, [events]);

  const eventTypeLabels = useMemo(() => {
    const uniqueLabels = new Set(eventTypeToLabelMap.values());
    return Array.from(uniqueLabels).sort((a, b) => a.localeCompare(b));
  }, [eventTypeToLabelMap]);

  const messages = useMessages(messageIds.filterButtonLabels);
  const filterButtonLabel = messages.eventTypes({
    numEventTypes: state.eventTypeLabelsToFilterBy.length,
    singleEventType:
      state.eventTypeLabelsToFilterBy.length === 1
        ? state.eventTypeLabelsToFilterBy[0]
        : '',
  });

  const getShouldShowEvent = useCallback(
    (event: EventWithActivity) => {
      if (state.eventTypeLabelsToFilterBy.length === 0) {
        return true;
      }

      const label = eventTypeToLabelMap.get(getEventTypeFromEvent(event))!;
      return state.eventTypeLabelsToFilterBy.includes(label);
    },
    [eventTypeToLabelMap, state.eventTypeLabelsToFilterBy]
  );

  const getIsCheckedEventTypeLabel = useCallback(
    (eventTypeLabel: string) =>
      state.eventTypeLabelsToFilterBy.includes(eventTypeLabel),
    [state.eventTypeLabelsToFilterBy]
  );

  const toggleEventTypeLabel = useCallback(
    (eventTypeLabel: string) => {
      const newArray = state.eventTypeLabelsToFilterBy.includes(eventTypeLabel)
        ? state.eventTypeLabelsToFilterBy.filter((t) => t !== eventTypeLabel)
        : [...state.eventTypeLabelsToFilterBy, eventTypeLabel];
      state.setEventTypeLabelsToFilterBy(newArray);
    },
    [state]
  );

  const clearEventTypeFilter = useCallback(() => {
    state.setEventTypeLabelsToFilterBy([]);
  }, [state.setEventTypeLabelsToFilterBy]);

  return {
    clearEventTypeFilter,
    eventTypeLabels,
    filterButtonLabel,
    getIsCheckedEventTypeLabel,
    getShouldShowEvent,
    isFiltered: state.eventTypeLabelsToFilterBy.length > 0,
    shouldShowFilter: eventTypeLabels.length > 1,
    toggleEventTypeLabel,
  };
};
