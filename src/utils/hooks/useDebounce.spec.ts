import { act, renderHook } from '@testing-library/react';

import useDebounce from './useDebounce';

describe('useDebounce()', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls the callback after the delay', () => {
    const callback = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useDebounce(callback, 400));

    act(() => {
      result.current('hello');
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(callback).toHaveBeenCalledWith('hello');
  });

  it('uses the latest callback after re-render', () => {
    const firstCallback = jest.fn().mockResolvedValue('first');
    const secondCallback = jest.fn().mockResolvedValue('second');

    const { result, rerender } = renderHook(
      ({ callback }) => useDebounce(callback, 400),
      { initialProps: { callback: firstCallback } }
    );

    // Re-render with a new callback (simulates parent passing a new prop)
    rerender({ callback: secondCallback });

    act(() => {
      result.current('hello');
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(secondCallback).toHaveBeenCalledWith('hello');
    expect(firstCallback).not.toHaveBeenCalled();
  });

  it('uses the latest closure values from props', () => {
    // Simulates the real component pattern:
    //
    //   const EmailEditor = ({ onSave }) => {
    //     const debounced = useDebounce(async (value) => {
    //       onSave({ subject: value });
    //     }, 400);
    //
    // Each render creates a new arrow function closing over that
    // render's `onSave` prop. useDebounce should use the latest one.
    const saveFn = jest.fn().mockResolvedValue(undefined);

    const { result, rerender } = renderHook(
      ({ emailId }) =>
        useDebounce(async (value: string) => {
          saveFn(emailId, value);
        }, 400),
      { initialProps: { emailId: 'email-1' } }
    );

    // Parent re-renders with different props (e.g. navigated to another email)
    rerender({ emailId: 'email-2' });

    act(() => {
      result.current('new subject');
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(saveFn).toHaveBeenCalledWith('email-2', 'new subject');
    expect(saveFn).not.toHaveBeenCalledWith('email-1', 'new subject');
  });

  it('uses the new delay after re-render', () => {
    const callback = jest.fn().mockResolvedValue(undefined);

    const { result, rerender } = renderHook(
      ({ delay }) => useDebounce(callback, delay),
      { initialProps: { delay: 400 } }
    );

    // Change delay to 800ms
    rerender({ delay: 800 });

    act(() => {
      result.current('hello');
    });

    // Old delay (400ms) should not trigger the callback
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(callback).not.toHaveBeenCalled();

    // New delay (800ms) should trigger
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(callback).toHaveBeenCalledWith('hello');
  });
});
