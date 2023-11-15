import { ConfiguringData } from '../utils/types';
import { setCurrentlyConfiguring } from '../store';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export default function useConfigSomething() {
  const dispatch = useAppDispatch();

  const pendingFile = useAppSelector((state) => state.import.pendingFile);
  const currentlyConfiguring =
    pendingFile.sheets[pendingFile.selectedSheetIndex].currentlyConfiguring;

  const updateCurrentlyConfiguring = (configuring: ConfiguringData) => {
    dispatch(setCurrentlyConfiguring(configuring));
  };

  return { currentlyConfiguring, updateCurrentlyConfiguring };
}
