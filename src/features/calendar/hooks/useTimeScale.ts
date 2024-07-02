import { useState } from 'react';

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
  const [localStorageTimeScale, setLocalStorageTimeScale] = useLocalStorage<
    TimeScale | undefined
  >('calendarTimeScale', undefined);

  const [timeScale, setTimeScale] = useState<TimeScale>(
    localStorageTimeScale || getTimeScale(timeScaleQueryParam)
  );

  const setPersistentTimeScale = (newTimeScale: TimeScale) => {
    setLocalStorageTimeScale(newTimeScale);
    setTimeScale(newTimeScale);
  };

  return {
    setPersistentTimeScale,
    timeScale,
  };
}
