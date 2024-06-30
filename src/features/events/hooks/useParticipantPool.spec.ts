import { act, renderHook } from '@testing-library/react';

import createStore from 'core/store';
import { makeWrapper } from 'utils/testing';
import mockState from 'utils/testing/mocks/mockState';
import useParticipantPool from './useParticipantPool';

describe('useParticipantPool()', () => {
  describe('affectedParticipantIds', () => {
    it('returns empty when there are no pending ops', () => {
      const initialState = mockState();
      const store = createStore(initialState);

      const { result } = renderHook(() => useParticipantPool(), {
        wrapper: makeWrapper(store),
      });

      expect(result.current.affectedParticipantIds).toEqual([]);
    });

    it('returns both added and removed participants', () => {
      const initialState = mockState();
      const store = createStore(initialState);

      const { result, rerender } = renderHook(() => useParticipantPool(), {
        wrapper: makeWrapper(store),
      });

      act(() => {
        result.current.moveFrom(1, 11);
        result.current.moveTo(1, 12);
      });

      rerender();

      expect(result.current.affectedParticipantIds).toEqual([11, 12]);
    });

    it('returns unique participants even if same participant is moved multiple times', () => {
      const initialState = mockState();
      const store = createStore(initialState);

      const { result, rerender } = renderHook(() => useParticipantPool(), {
        wrapper: makeWrapper(store),
      });

      act(() => {
        result.current.moveFrom(1, 11);
        result.current.moveTo(2, 11);
      });

      rerender();

      expect(result.current.affectedParticipantIds).toEqual([11]);
    });

    it('returns empty list if a participant is removed and then added back', () => {
      const initialState = mockState();
      const store = createStore(initialState);

      const { result, rerender } = renderHook(() => useParticipantPool(), {
        wrapper: makeWrapper(store),
      });

      act(() => {
        result.current.moveFrom(1, 11);
        result.current.moveTo(1, 11);
      });

      rerender();

      expect(result.current.affectedParticipantIds).toEqual([]);
    });
  });
});
