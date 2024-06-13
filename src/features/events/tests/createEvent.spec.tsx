import { renderHook } from '@testing-library/react';

import createStore from 'core/store';
import { makeWrapper } from '../utils/testUtils';
import mockEvent from 'utils/testing/mocks/mockEvent';
import mockState from 'utils/testing/mocks/mockState';
import useEvent from '../hooks/useEvent';
import useEventsFromDateRange from '../hooks/useEventsFromDateRange';
import { eventCreate, eventCreated } from '../store';

describe('The event feature', () => {
  it('creates an event', () => {
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

  it('puts a created event on the right day', () => {
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
