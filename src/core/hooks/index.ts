import { AppDispatch, RootState } from 'core/store';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export { default as useApiClient } from './useApiClient';
export { default as useEnv } from './useEnv';
export { default as useNumericRouteParams } from './useNumericRouteParams';

// Use throughout instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
