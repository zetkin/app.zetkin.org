import Fuse from 'fuse.js';

import { EventActivity } from 'features/campaigns/types';
import { EventState } from './useEventState';
import getEventState from '../utils/getEventState';
import { useAppSelector } from 'core/hooks';
import { ACTION_FILTER_OPTIONS, STATE_FILTER_OPTIONS } from '../store';

export default function useFilteredEventActivities(
  input: EventActivity[]
): EventActivity[] {
  const filterState = useAppSelector((state) => state.events.filters);
  const statsByEventId = useAppSelector((state) => state.events.statsByEventId);

  const filtered = input.filter((activity) => {
    const event = activity.data;

    if (filterState.selectedTypes.length) {
      if (
        !event.activity ||
        !filterState.selectedTypes.includes(event.activity.id.toString())
      ) {
        return false;
      }
    }

    if (filterState.selectedStates.length) {
      const state = getEventState(event);

      if (
        state == EventState.CANCELLED &&
        !filterState.selectedStates.includes(STATE_FILTER_OPTIONS.CANCELLED)
      ) {
        return false;
      }

      if (
        state == EventState.DRAFT &&
        !filterState.selectedStates.includes(STATE_FILTER_OPTIONS.DRAFT)
      ) {
        return false;
      }

      if (
        (state == EventState.OPEN || state == EventState.ENDED) &&
        !filterState.selectedStates.includes(STATE_FILTER_OPTIONS.PUBLISHED)
      ) {
        return false;
      }

      if (
        state == EventState.SCHEDULED &&
        !filterState.selectedStates.includes(STATE_FILTER_OPTIONS.SCHEDULED)
      ) {
        return false;
      }
    }

    if (filterState.selectedActions.length) {
      if (
        filterState.selectedActions.includes(
          ACTION_FILTER_OPTIONS.CONTACT_MISSING
        ) &&
        !!event.contact
      ) {
        return false;
      }

      if (
        filterState.selectedActions.includes(
          ACTION_FILTER_OPTIONS.OVERBOOKED
        ) &&
        event.num_participants_available < event.num_participants_required * 2
      ) {
        return false;
      }

      const stats = statsByEventId[event.id]?.data;
      if (
        filterState.selectedActions.includes(
          ACTION_FILTER_OPTIONS.SIGNUPS_PENDING
        ) &&
        !stats?.numPending
      ) {
        return false;
      }

      if (
        !stats ||
        (filterState.selectedActions.includes(
          ACTION_FILTER_OPTIONS.UNDERBOOKED
        ) &&
          stats.numBooked >= event.num_participants_required)
      ) {
        return false;
      }

      if (
        !stats ||
        (filterState.selectedActions.includes(
          ACTION_FILTER_OPTIONS.UNSENT_NOTIFICATIONS
        ) &&
          stats.numReminded != stats.numBooked)
      ) {
        return false;
      }
    }

    return true;
  });

  // If there's a free text filter, fuzzy search the remaining matches
  const searchText = filterState.text.trim();
  if (searchText.length > 2) {
    const fuse = new Fuse(filtered, {
      keys: [
        'data.title',
        'data.activity.title',
        'data.location.title',
        'data.campaign.title',
      ],
      threshold: 0.2,
    });
    const tokens = filterState.text.split(/\s/);
    return fuse
      .search({
        $and: tokens.map((token) => ({
          $or: [
            { $path: ['data', 'title'], $val: token },
            { $path: ['data', 'activity', 'title'], $val: token },
            { $path: ['data', 'location', 'title'], $val: token },
            { $path: ['data', 'campaign', 'title'], $val: token },
          ],
        })),
      })
      .map((result) => result.item);
  }

  return filtered;
}
