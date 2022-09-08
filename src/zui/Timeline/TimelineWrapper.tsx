import { useContext } from 'react';
import { useQuery } from 'react-query';

import { createUseMutation } from 'api/utils/resourceHookFactories';
import { defaultFetch } from 'utils/fetching';
import handleResponseData from 'api/utils/handleResponseData';
import SnackbarContext from '../SnackbarContext';
import Timeline from '../Timeline';
import { ZetkinNoteBody } from '../../utils/types/zetkin';
import ZetkinQuery from './ZetkinQuery';
import { ZetkinUpdate } from 'zui/Timeline/updates/types';

interface TimelineWrapperProps {
  queryKey: string[];
  itemApiPath: string;
}

const TimelineWrapper: React.FC<TimelineWrapperProps> = ({
  queryKey,
  itemApiPath,
}) => {
  const { showSnackbar } = useContext(SnackbarContext);

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
          disabled={notesMutation.isLoading}
          onAddNote={handleAddNote}
          updates={queries.updatesQuery.data}
        />
      )}
    </ZetkinQuery>
  );

  function handleAddNote(note: ZetkinNoteBody) {
    notesMutation.mutate(note, {
      onError: () => showSnackbar('error'),
    });
  }
};

export default TimelineWrapper;
