import { debounce } from 'lodash';
import { useRef } from 'react';

type DefaultCallbackArgs = Array<unknown>;
type CallbackFn<Args extends DefaultCallbackArgs, ReturnType> = (
  ...args: Args
) => Promise<ReturnType>;

/**
 * Runs the callback function only if the delay time has passed.
 */
export default function useDebounce<
  Args extends DefaultCallbackArgs,
  ReturnType
>(
  callback: CallbackFn<Args, ReturnType>,
  delay: number
): (...args: Args) => Promise<ReturnType> | undefined {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const delayRef = useRef(delay);
  const debouncedFn = useRef(
    debounce((...args: Args) => callbackRef.current(...args), delay)
  );

  if (delay !== delayRef.current) {
    delayRef.current = delay;
    debouncedFn.current.cancel();
    debouncedFn.current = debounce(
      (...args: Args) => callbackRef.current(...args),
      delay
    );
  }

  return debouncedFn.current;
}
