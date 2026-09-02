import { useMemo } from 'react';

import useResource from 'core/resources/useResource';
import myEventsResource from '../resources/myEventsResource';

export default function useMyEvents() {
  const today = new Date().toISOString().slice(0, 10);
  const context = useMemo(() => ({ today }), [today]);
  return useResource(myEventsResource, context);
}
