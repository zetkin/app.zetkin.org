import { act, renderHook, waitFor } from '@testing-library/react';

import { usePreventKeyboardPropagation } from './usePreventKeyboardPropagation';

describe('usePreventKeyboardPropagation', () => {
  let mockElement: HTMLDivElement;
  let addEventListenerSpy: jest.SpyInstance;
  let removeEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    mockElement = document.createElement('div');
    addEventListenerSpy = jest.spyOn(mockElement, 'addEventListener');
    removeEventListenerSpy = jest.spyOn(mockElement, 'removeEventListener');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a callback ref', () => {
    const { result } = renderHook(() =>
      usePreventKeyboardPropagation(true, false)
    );
    expect(typeof result.current).toBe('function');
  });

  it('attaches keyboard event listeners when modal is open and element is set', async () => {
    const { result } = renderHook(() =>
      usePreventKeyboardPropagation(true, false)
    );

    // Call the callback ref with the element
    act(() => {
      result.current(mockElement);
    });

    await waitFor(() => {
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
        { capture: true }
      );
    });

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keyup',
      expect.any(Function),
      { capture: true }
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keypress',
      expect.any(Function),
      { capture: true }
    );
  });

  it('does not attach listeners when modal is closed', () => {
    const { result } = renderHook(() =>
      usePreventKeyboardPropagation(false, false)
    );

    act(() => {
      result.current(mockElement);
    });

    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it('does not attach listeners when allowPropagation is true', () => {
    const { result } = renderHook(() =>
      usePreventKeyboardPropagation(true, true)
    );

    act(() => {
      result.current(mockElement);
    });

    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it('removes event listeners on cleanup', async () => {
    const { result, unmount } = renderHook(() =>
      usePreventKeyboardPropagation(true, false)
    );

    act(() => {
      result.current(mockElement);
    });

    await waitFor(() => {
      expect(addEventListenerSpy).toHaveBeenCalled();
    });

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
      { capture: true }
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keyup',
      expect.any(Function),
      { capture: true }
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keypress',
      expect.any(Function),
      { capture: true }
    );
  });

  it('removes and re-attaches listeners when modal closes and reopens', async () => {
    const { result, rerender } = renderHook(
      ({ open }) => usePreventKeyboardPropagation(open, false),
      { initialProps: { open: true } }
    );

    act(() => {
      result.current(mockElement);
    });

    await waitFor(() => {
      expect(addEventListenerSpy).toHaveBeenCalled();
    });

    addEventListenerSpy.mockClear();

    // Close modal
    rerender({ open: false });

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(3);

    removeEventListenerSpy.mockClear();

    // Reopen modal
    rerender({ open: true });

    await waitFor(() => {
      expect(addEventListenerSpy).toHaveBeenCalledTimes(3);
    });
  });

  it('stops propagation of keyboard events', async () => {
    const { result } = renderHook(() =>
      usePreventKeyboardPropagation(true, false)
    );

    act(() => {
      result.current(mockElement);
    });

    await waitFor(() => {
      expect(addEventListenerSpy).toHaveBeenCalled();
    });

    // Get the handler that was registered
    const keydownHandler = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === 'keydown'
    )?.[1] as EventListener;

    expect(keydownHandler).toBeDefined();

    // Create a mock keyboard event
    const event = new KeyboardEvent('keydown', { bubbles: true, key: '1' });
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
    const stopImmediatePropagationSpy = jest.spyOn(
      event,
      'stopImmediatePropagation'
    );

    // Call the handler
    keydownHandler(event);

    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(stopImmediatePropagationSpy).toHaveBeenCalled();
  });

  it('uses capture phase for event listening', async () => {
    const { result } = renderHook(() =>
      usePreventKeyboardPropagation(true, false)
    );

    act(() => {
      result.current(mockElement);
    });

    await waitFor(() => {
      expect(addEventListenerSpy).toHaveBeenCalled();
    });

    // Verify all listeners use capture: true
    addEventListenerSpy.mock.calls.forEach((call) => {
      expect(call[2]).toEqual({ capture: true });
    });
  });

  it('handles null element gracefully', () => {
    const { result } = renderHook(() =>
      usePreventKeyboardPropagation(true, false)
    );

    // Should not throw
    expect(() => result.current(null)).not.toThrow();
  });

  it('updates listeners when allowPropagation changes from false to true', async () => {
    const { result, rerender } = renderHook(
      ({ allowPropagation }) =>
        usePreventKeyboardPropagation(true, allowPropagation),
      { initialProps: { allowPropagation: false } }
    );

    act(() => {
      result.current(mockElement);
    });

    await waitFor(() => {
      expect(addEventListenerSpy).toHaveBeenCalledTimes(3);
    });

    addEventListenerSpy.mockClear();
    removeEventListenerSpy.mockClear();

    // Change to allow propagation
    rerender({ allowPropagation: true });

    // Should remove listeners
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(3);
    // Should not add them back
    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });
});
