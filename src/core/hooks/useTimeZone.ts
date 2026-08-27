import { useEffect, useState } from 'react';

const DEFAULT_TIME_ZONE = 'Europe/Stockholm';

export default function useTimeZone() {
  const [timeZone, setTimeZone] = useState(DEFAULT_TIME_ZONE);

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return timeZone;
}
