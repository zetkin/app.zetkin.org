import { useEffect } from 'react';

import { TimeScale } from '../components';
import useLocalStorage from 'zui/hooks/useLocalStorage';

function getTimeScale(timeScaleQueryParam: string | string[] | undefined) {
  if (
    typeof timeScaleQueryParam === 'string' &&
    Object.values(TimeScale).includes(timeScaleQueryParam as TimeScale)
  ) {
    return timeScaleQueryParam as TimeScale;
  }
  return TimeScale.MONTH;
}

export default function useTimeScale(
  timeScaleQueryParam: string | string[] | undefined
) {
  const [localStorageTimeScale, setLocalStorageTimeScale] =
    useLocalStorage<TimeScale>(
      'calendarTimeScale',
      getTimeScale(timeScaleQueryParam)
    );

  useEffect(() => {
    // If the time scale changes in the URL, update it in local storage
    if (timeScaleQueryParam) {
      const newTimeScale = getTimeScale(timeScaleQueryParam);
      if (newTimeScale !== localStorageTimeScale) {
        setLocalStorageTimeScale(newTimeScale);
      }
    }
  }, [timeScaleQueryParam]);

  return {
    setPersistentTimeScale: setLocalStorageTimeScale,
    timeScale: localStorageTimeScale,
  };
}
