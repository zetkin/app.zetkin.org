import { renderHook } from '@testing-library/react';

import createStore from 'core/store';
import { eventDeleted } from '../store';
import mockEvent from 'utils/testing/mocks/mockEvent';
import mockState from 'utils/testing/mocks/mockState';
import { remoteItem } from 'utils/storeUtils';
import useCampaignEvents from 'features/campaigns/hooks/useCampaignEvents';
import useEvent from '../hooks/useEvent';
import useEventsFromDateRange from '../hooks/useEventsFromDateRange';
import { makeWrapper, remoteListWithEventItems } from '../utils/testUtils';

describe('Deleting an event', () => {
  it('does not return the event when trying to get it', () => {
    const event = mockEvent();
    const emptyState = mockState();

    const anHourAgo = new Date();
    anHourAgo.setHours(anHourAgo.getHours() - 1);

    const remoteListWithEventItem = remoteListWithEventItems(
      [
        remoteItem(event.id, {
          data: event,
          loaded: anHourAgo.toISOString(),
        }),
      ],
      anHourAgo.toISOString()
    );

    const initialState = mockState({
      ...emptyState,
      events: {
        ...emptyState.events,
        eventList: remoteListWithEventItem,
        eventsByCampaignId: {
          1: remoteListWithEventItem,
        },
        eventsByDate: {
          [event.start_time.slice(0, 10)]: remoteListWithEventItem,
        },
      },
    });

    const store = createStore(initialState);
    store.dispatch(eventDeleted(event.id));

    const { result } = renderHook(() => useEvent(event.organization.id, 1), {
      wrapper: makeWrapper(store),
    });

    expect(result.current).toBe(null);
  });

  it('does not return deleted events when getting events by campaign date', () => {
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 1);
    const firstEvent = mockEvent();
    const secondEvent = mockEvent({ end_time: endTime.toISOString(), id: 2 });
    const emptyState = mockState();

    const eventItemsList = remoteListWithEventItems(
      [
        remoteItem(firstEvent.id, {
          data: firstEvent,
          loaded: new Date().toISOString(),
        }),
        remoteItem(secondEvent.id, {
          data: secondEvent,
          loaded: new Date().toISOString(),
        }),
      ],
      new Date().toISOString()
    );

    const initialState = mockState({
      ...emptyState,
      events: {
        ...emptyState.events,
        eventList: eventItemsList,
        eventsByCampaignId: {
          1: eventItemsList,
        },
        eventsByDate: {
          [firstEvent.start_time.slice(0, 10)]: eventItemsList,
        },
      },
    });

    const store = createStore(initialState);
    store.dispatch(eventDeleted(firstEvent.id));

    const { result } = renderHook(
      () => useCampaignEvents(firstEvent.organization.id, 1),
      { wrapper: makeWrapper(store) }
    );

    expect(result.current.numberOfUpcomingEvents).toBe(1);
  });

  it('does not return deleted events when getting events from a date range', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const today = new Date();

    const firstEvent = mockEvent({
      end_time: tomorrow.toISOString(),
      start_time: yesterday.toISOString(),
    });
    const secondEvent = mockEvent({
      end_time: tomorrow.toISOString(),
      id: 2,
      start_time: yesterday.toISOString(),
    });
    const emptyState = mockState();

    const eventItemsList = remoteListWithEventItems(
      [
        remoteItem(firstEvent.id, {
          data: firstEvent,
          loaded: new Date().toISOString(),
        }),
        remoteItem(secondEvent.id, {
          data: secondEvent,
          loaded: new Date().toISOString(),
        }),
      ],
      new Date().toISOString()
    );

    const initialState = mockState({
      ...emptyState,
      events: {
        ...emptyState.events,
        eventList: eventItemsList,
        eventsByCampaignId: {
          1: eventItemsList,
        },
        eventsByDate: {
          [yesterday.toISOString().slice(0, 10)]: eventItemsList,
          [today.toISOString().slice(0, 10)]: eventItemsList,
          [tomorrow.toISOString().slice(0, 10)]: eventItemsList,
        },
      },
    });

    const store = createStore(initialState);
    store.dispatch(eventDeleted(firstEvent.id));

    const { result } = renderHook(
      () => useEventsFromDateRange(today, tomorrow, 1, 1),
      {
        wrapper: makeWrapper(store),
      }
    );

    expect(result.current).toHaveLength(2);
    expect(result.current[0].data.id).toBe(2);
    expect(result.current[1].data.id).toBe(2);
  });
});
