import { debounce } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';

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
  // Memoizing the callback because if it's an arrow function
  // it would be different on each render
  const memoizedCallback = useCallback(callback, []);
  const debouncedFn = useRef(debounce(memoizedCallback, delay));

  useEffect(() => {
    debouncedFn.current = debounce(memoizedCallback, delay);
  }, [memoizedCallback, debouncedFn, delay]);

  return debouncedFn.current;
}
