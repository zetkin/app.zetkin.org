import { useCallback, useRef, useEffect } from "react";
import debounce from "lodash.debounce";

type DefaultCallbackArgs = Array<any>;
type CallbackFn<Args extends DefaultCallbackArgs> = (
    ...args: Args
) => Promise<void>;

/**
 * Runs the callback function only if the delay time has passed.
 */
export default function useDebounce<Args extends DefaultCallbackArgs>(
    callback: CallbackFn<Args>,
    delay: number
) {
    // Memoizing the callback because if it's an arrow function
    // it would be different on each render
    const memoizedCallback = useCallback(callback, []);
    const debouncedFn = useRef(debounce(memoizedCallback, delay));

    useEffect(() => {
        debouncedFn.current = debounce(memoizedCallback, delay);
    }, [memoizedCallback, debouncedFn, delay]);

    return debouncedFn.current;
}
