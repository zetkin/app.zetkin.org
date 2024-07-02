import { useEffect, useState } from 'react';

import { TimeScale } from '../components';

function getTimeScale(timeScaleQueryParam: string | string[] | undefined) {
  let timeScale = TimeScale.MONTH;
  if (
    timeScaleQueryParam !== undefined &&
    typeof timeScaleQueryParam === 'string' &&
    Object.values(TimeScale).includes(timeScaleQueryParam as TimeScale)
  ) {
    timeScale = timeScaleQueryParam as TimeScale;
  }
  return timeScale;
}

export default function useTimeScale(
  timeScaleQueryParam: string | string[] | undefined
) {
  const [timeScale, setTimeScale] = useState<TimeScale>(
    getTimeScale(timeScaleQueryParam)
  );

  // When the time scale query param changes, update the time scale
  useEffect(() => {
    setTimeScale(getTimeScale(timeScaleQueryParam));
  }, [timeScaleQueryParam]);

  const setPersistentTimeScale = (newTimeScale: TimeScale) => {
    setTimeScale(newTimeScale);
  };

  return {
    setPersistentTimeScale,
    timeScale,
  };
}
