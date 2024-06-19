import { act, renderHook } from '@testing-library/react';

import createStore from 'core/store';
import { makeWrapper } from 'utils/testing';
import mockEvent from 'utils/testing/mocks/mockEvent';
import mockEventParticipant from 'utils/testing/mocks/mockEventParticipant';
import mockState from 'utils/testing/mocks/mockState';
import { participantOpsExecuted } from '../store';
import useEventParticipantsWithChanges from '../hooks/useEventParticipantsWithChanges';
import useParticipantPool from '../hooks/useParticipantPool';
import { remoteItem, remoteList } from 'utils/storeUtils';

describe('Moving event participants', () => {
  it('returns participant untouched when there are no changes', () => {
    const participant = mockEventParticipant({ id: 1001 });
    const initialState = mockState();
    initialState.events.eventList.items.push(
      remoteItem(11, {
        data: mockEvent({ id: 11 }),
        loaded: new Date().toISOString(),
      })
    );
    initialState.events.participantsByEventId[11] = remoteList([participant]);

    initialState.events.participantsByEventId[11].loaded =
      new Date().toISOString();

    const store = createStore(initialState);

    const { result } = renderHook(
      () => useEventParticipantsWithChanges(1, 11),
      {
        wrapper: makeWrapper(store),
      }
    );

    expect(result.current.numParticipantsAvailable).toEqual(1);
    expect(result.current.bookedParticipants).toEqual([
      {
        person: participant,
        status: 'booked',
      },
    ]);
  });

  it('returns participant as moved away after moving them', () => {
    const participant = mockEventParticipant({ id: 1001 });
    const initialState = mockState();
    initialState.events.eventList.items.push(
      remoteItem(11, {
        data: mockEvent({ id: 11 }),
        loaded: new Date().toISOString(),
      })
    );
    initialState.events.participantsByEventId[11] = remoteList([participant]);

    initialState.events.participantsByEventId[11].loaded =
      new Date().toISOString();

    const store = createStore(initialState);

    const poolHook = renderHook(() => useParticipantPool(), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      poolHook.result.current.moveFrom(11, 1001);
    });

    const { result } = renderHook(
      () => useEventParticipantsWithChanges(1, 11),
      {
        wrapper: makeWrapper(store),
      }
    );

    expect(result.current.numParticipantsAvailable).toEqual(0);
    expect(result.current.bookedParticipants).toEqual([]);
    expect(result.current.pendingParticipants).toEqual([
      {
        person: participant,
        status: 'removed',
      },
    ]);
  });

  it('returns pending participants that have been moved from other events', () => {
    const participant = mockEventParticipant({ id: 1001 });
    const initialState = mockState();
    initialState.events.eventList.items = [
      remoteItem(11, {
        data: mockEvent({ id: 11 }),
        loaded: new Date().toISOString(),
      }),
      remoteItem(12, {
        data: mockEvent({ id: 12 }),
        loaded: new Date().toISOString(),
      }),
    ];

    initialState.events.participantsByEventId[11] = remoteList([participant]);
    initialState.events.participantsByEventId[11].loaded =
      new Date().toISOString();

    initialState.events.participantsByEventId[12] = remoteList([]);
    initialState.events.participantsByEventId[12].loaded =
      new Date().toISOString();

    const store = createStore(initialState);

    const poolHook = renderHook(() => useParticipantPool(), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      poolHook.result.current.moveFrom(11, 1001);
    });

    const { result } = renderHook(
      () => useEventParticipantsWithChanges(1, 12),
      {
        wrapper: makeWrapper(store),
      }
    );

    expect(result.current.numParticipantsAvailable).toEqual(0);
    expect(result.current.pendingParticipants).toEqual([
      {
        person: participant,
        status: 'pending',
      },
    ]);
  });

  it('returns participant as added and not pending when added to this event', () => {
    const participant = mockEventParticipant({ id: 1001 });
    const initialState = mockState();
    initialState.events.eventList.items = [
      remoteItem(11, {
        data: mockEvent({ id: 11 }),
        loaded: new Date().toISOString(),
      }),
      remoteItem(12, {
        data: mockEvent({ id: 12 }),
        loaded: new Date().toISOString(),
      }),
    ];

    initialState.events.participantsByEventId[11] = remoteList([participant]);
    initialState.events.participantsByEventId[11].loaded =
      new Date().toISOString();

    initialState.events.participantsByEventId[12] = remoteList([]);
    initialState.events.participantsByEventId[12].loaded =
      new Date().toISOString();

    const store = createStore(initialState);

    const poolHook = renderHook(() => useParticipantPool(), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      poolHook.result.current.moveFrom(11, 1001);
      poolHook.result.current.moveTo(12, 1001);
    });

    const { result } = renderHook(
      () => useEventParticipantsWithChanges(1, 12),
      {
        wrapper: makeWrapper(store),
      }
    );

    expect(result.current.numParticipantsAvailable).toEqual(1);
    expect(result.current.bookedParticipants).toEqual([
      {
        person: participant,
        status: 'added',
      },
    ]);

    expect(result.current.pendingParticipants).toEqual([]);
  });

  it('counts booked and added as participants, but not removed or pending', () => {
    const initialState = mockState();
    initialState.events.eventList.items = [
      remoteItem(11, {
        data: mockEvent({ id: 11 }),
        loaded: new Date().toISOString(),
      }),
      remoteItem(12, {
        data: mockEvent({ id: 12 }),
        loaded: new Date().toISOString(),
      }),
    ];

    initialState.events.participantsByEventId[11] = remoteList([
      mockEventParticipant({ id: 1101 }),
      mockEventParticipant({ id: 1102 }),
    ]);
    initialState.events.participantsByEventId[11].loaded =
      new Date().toISOString();

    initialState.events.participantsByEventId[12] = remoteList([
      mockEventParticipant({ id: 1201 }),
      mockEventParticipant({ id: 1202 }),
    ]);
    initialState.events.participantsByEventId[12].loaded =
      new Date().toISOString();

    const store = createStore(initialState);

    const poolHook = renderHook(() => useParticipantPool(), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      // "Move" one participant from 11 to 12
      poolHook.result.current.moveFrom(11, 1101);
      poolHook.result.current.moveTo(12, 1101);

      // Remove one original participant from 12
      poolHook.result.current.moveFrom(12, 1202);
    });

    const { result } = renderHook(
      () => useEventParticipantsWithChanges(1, 12),
      {
        wrapper: makeWrapper(store),
      }
    );

    expect(result.current.numParticipantsAvailable).toEqual(2);
  });

  it('updates store when after executing', () => {
    const initialState = mockState();
    initialState.events.eventList.items = [
      remoteItem(11, {
        data: mockEvent({ id: 11 }),
        loaded: new Date().toISOString(),
      }),
      remoteItem(12, {
        data: mockEvent({ id: 12 }),
        loaded: new Date().toISOString(),
      }),
    ];

    initialState.events.participantsByEventId[11] = remoteList([
      mockEventParticipant({ id: 1101 }),
      mockEventParticipant({ id: 1102 }),
    ]);
    initialState.events.participantsByEventId[11].loaded =
      new Date().toISOString();

    initialState.events.participantsByEventId[12] = remoteList([
      mockEventParticipant({ id: 1201 }),
      mockEventParticipant({ id: 1202 }),
    ]);
    initialState.events.participantsByEventId[12].loaded =
      new Date().toISOString();

    const store = createStore(initialState);

    const poolHook = renderHook(() => useParticipantPool(), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      // "Move" one participant from 11 to 12
      poolHook.result.current.moveFrom(11, 1101);
      poolHook.result.current.moveTo(12, 1101);

      // Simulate "executing" the pending ops
      store.dispatch(participantOpsExecuted());
    });

    const output = store.getState();

    expect(output.events.participantsByEventId[11].isStale).toBeTruthy();
    expect(output.events.participantsByEventId[12].isStale).toBeTruthy();
    expect(output.events.pendingParticipantOps).toEqual([]);
  });
});
