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
  // Intentionally captures callback once. Including [callback] would recreate
  // the memoized function every render, defeating the debounce mechanism.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, []);
  const debouncedFn = useRef(debounce(memoizedCallback, delay));

  useEffect(() => {
    debouncedFn.current = debounce(memoizedCallback, delay);
  }, [memoizedCallback, debouncedFn, delay]);

  return debouncedFn.current;
}
