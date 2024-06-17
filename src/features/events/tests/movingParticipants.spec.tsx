import { act, renderHook } from '@testing-library/react';

import createStore from 'core/store';
import { makeWrapper } from 'utils/testing';
import mockEvent from 'utils/testing/mocks/mockEvent';
import mockEventParticipant from 'utils/testing/mocks/mockEventParticipant';
import mockState from 'utils/testing/mocks/mockState';
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

    expect(result.current.bookedParticipants).toEqual([
      {
        person: participant,
        status: 'removed',
      },
    ]);
  });
});
