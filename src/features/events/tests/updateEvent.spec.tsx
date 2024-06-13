import { renderHook } from '@testing-library/react';

import createStore from 'core/store';
import mockEvent from 'utils/testing/mocks/mockEvent';
import mockState from 'utils/testing/mocks/mockState';
import { remoteItem } from 'utils/storeUtils';
import useEvent from '../hooks/useEvent';
import { eventUpdate, eventUpdated } from '../store';
import { makeWrapper, remoteListWithEventItems } from '../utils/testUtils';

describe('Updating an event', () => {
  it('updates the title of an event', () => {
    const emptyState = mockState();
    const event = mockEvent();

    const now = new Date();

    const eventItemsList = remoteListWithEventItems(
      [
        remoteItem(event.id, {
          data: event,
          loaded: now.toISOString(),
        }),
      ],
      now.toISOString()
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
          [now.toISOString().slice(0, 10)]: eventItemsList,
        },
      },
    });

    const updatedEvent = mockEvent({ title: 'Coolest dance party ever' });

    const store = createStore(initialState);
    store.dispatch(eventUpdate([updatedEvent.id, ['title']]));
    store.dispatch(eventUpdated(updatedEvent));

    const { result } = renderHook(
      () => useEvent(event.organization.id, event.id),
      { wrapper: makeWrapper(store) }
    );

    expect(result.current?.data).toEqual(updatedEvent);
    expect(result.current?.isLoading).toEqual(false);
  });

  it('updates the date of an event', () => {
    const emptyState = mockState();
    const event = mockEvent();

    const now = new Date();

    const eventItemsList = remoteListWithEventItems(
      [
        remoteItem(event.id, {
          data: event,
          loaded: now.toISOString(),
        }),
      ],
      now.toISOString()
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
          [event.start_time.slice(0, 10)]: eventItemsList,
        },
      },
    });

    const updatedEvent = mockEvent({
      end_time: '2024-06-16T09:00:00+00:00',
      start_time: '2024-06-16T07:00:00+00:00',
    });

    const store = createStore(initialState);
    store.dispatch(eventUpdate([updatedEvent.id, ['start_time', 'end_time']]));
    store.dispatch(eventUpdated(updatedEvent));

    const { result } = renderHook(
      () => useEvent(event.organization.id, event.id),
      { wrapper: makeWrapper(store) }
    );

    expect(result.current?.data).toEqual(updatedEvent);
    expect(result.current?.isLoading).toEqual(false);
  });
});
