import { TimeScale } from '../components';
import useLocalStorage from 'zui/hooks/useLocalStorage';

function getTimeScale(timeScaleQueryParam: string | string[] | undefined) {
  if (
    typeof timeScaleQueryParam === 'string' &&
    Object.values(TimeScale).includes(timeScaleQueryParam as TimeScale)
  ) {
    return timeScaleQueryParam as TimeScale;
  }
  return undefined;
}

export default function useTimeScale(
  timeScaleQueryParam: string | string[] | undefined
) {
  const [localStorageTimeScale, setLocalStorageTimeScale] =
    useLocalStorage<TimeScale>(
      'calendarTimeScale',
      TimeScale.MONTH,
      getTimeScale(timeScaleQueryParam)
    );

  return {
    setPersistentTimeScale: setLocalStorageTimeScale,
    timeScale: localStorageTimeScale,
  };
}
