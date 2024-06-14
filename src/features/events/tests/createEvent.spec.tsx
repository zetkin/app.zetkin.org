import { renderHook } from '@testing-library/react';

import createStore from 'core/store';
import { makeWrapper } from 'utils/testing';
import mockEvent from 'utils/testing/mocks/mockEvent';
import mockState from 'utils/testing/mocks/mockState';
import useEvent from '../hooks/useEvent';
import useEventsFromDateRange from '../hooks/useEventsFromDateRange';
import { eventCreate, eventCreated } from '../store';

describe('When creating an event', () => {
  it('the event is created and retrieved from cache', () => {
    const event = mockEvent();

    const initialState = mockState();

    const store = createStore(initialState);
    store.dispatch(eventCreate());
    store.dispatch(eventCreated(event));

    const { result } = renderHook(
      () => useEvent(event.organization.id, event.id),
      { wrapper: makeWrapper(store) }
    );

    expect(result.current?.data).toEqual(event);
    expect(result.current?.isLoading).toEqual(false);
  });

  it('the created event is saved on the right date', () => {
    const startTime = new Date();
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 2);

    const event = mockEvent({
      end_time: endTime.toISOString(),
      id: 1,
      start_time: startTime.toISOString(),
    });

    const emptyState = mockState();
    const store = createStore(emptyState);

    store.dispatch(eventCreate());
    store.dispatch(eventCreated(event));

    const today = new Date();
    const { result } = renderHook(
      () => useEventsFromDateRange(today, today, 1, 1),
      {
        wrapper: makeWrapper(store),
      }
    );

    expect(result.current[0].data.id).toEqual(1);
  });
});
