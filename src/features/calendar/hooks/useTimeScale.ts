import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useLocalStorage from 'zui/hooks/useLocalStorage';
import { TimeScale } from '../types';
import { setTimeScale } from '../store';

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
  const dispatch = useDispatch();
  const [localStorageTimeScale, setLocalStorageTimeScale] =
    useLocalStorage<TimeScale>(
      'calendarTimeScale',
      getTimeScale(timeScaleQueryParam)
    );

  useEffect(() => {
    // If the time scale changes in the URL, update it in local storage
    if (timeScaleQueryParam) {
      const newTimeScale = getTimeScale(timeScaleQueryParam);
      dispatch(setTimeScale(newTimeScale));
      if (newTimeScale !== localStorageTimeScale) {
        setLocalStorageTimeScale(newTimeScale);
      }
    }
  }, [timeScaleQueryParam]);

  function setPersistentTimeScale(timescale: TimeScale) {
    setLocalStorageTimeScale(timescale);
    dispatch(setTimeScale(timescale));
  }
  return {
    setTimeScale: setPersistentTimeScale,
    timeScale: localStorageTimeScale,
  };
}
