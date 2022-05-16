import { useQuery } from 'react-query';
import { useContext, useState } from 'react';

import { createUseMutation } from 'api/utils/resourceHookFactories';
import { defaultFetch } from 'fetching';
import handleResponseData from 'api/utils/handleResponseData';
import SnackbarContext from '../hooks/SnackbarContext';
import Timeline from './Timeline';
import { ZetkinNote } from '../types/zetkin';
import ZetkinQuery from './ZetkinQuery';
import { ZetkinUpdate } from 'types/updates';

interface TimelineWrapperProps {
  queryKey: string[];
  itemApiPath: string;
}

const TimelineWrapper: React.FC<TimelineWrapperProps> = ({
  queryKey,
  itemApiPath,
}) => {
  const { showSnackbar } = useContext(SnackbarContext);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const updatesQuery = useQuery(queryKey, async () => {
    const res = await defaultFetch(itemApiPath + '/timeline/updates');
    return handleResponseData<ZetkinUpdate[]>(res, 'GET');
  });

  const notesMutation = createUseMutation(queryKey, itemApiPath + '/notes', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })();

  return (
    <ZetkinQuery queries={{ updatesQuery }}>
      {({ queries }) => (
        <Timeline
          disabled={submitting}
          onAddNote={handleAddNote}
          updates={queries.updatesQuery.data}
        />
      )}
    </ZetkinQuery>
  );

  function handleAddNote(note: Partial<ZetkinNote>) {
    setSubmitting(true);
    notesMutation.mutate(note, {
      onError: () => showSnackbar('error'),
      onSettled: () => setSubmitting(false),
    });
  }
};

export default TimelineWrapper;
