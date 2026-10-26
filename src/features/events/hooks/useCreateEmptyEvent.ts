import { useContext, useRef, useState } from 'react';

import useCreateEvent from './useCreateEvent';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

type EmptyEventDates = {
  campaign_id?: number;
  end_time: string;
  start_time: string;
};

export default function useCreateEmptyEvent(orgId: number) {
  const createEvent = useCreateEvent(orgId);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const [creating, setCreating] = useState(false);
  const creatingRef = useRef(false);

  const createEmptyEvent = async (dates: EmptyEventDates) => {
    if (creatingRef.current) {
      return null;
    }

    creatingRef.current = true;
    setCreating(true);
    try {
      return await createEvent({
        activity_id: null,
        ...dates,
        location_id: null,
        title: null,
      });
    } catch {
      showSnackbar('error');
      return null;
    } finally {
      creatingRef.current = false;
      setCreating(false);
    }
  };

  return { createEmptyEvent, creating };
}
