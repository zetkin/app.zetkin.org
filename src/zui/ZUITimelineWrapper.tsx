import { useContext } from 'react';
import { useQuery } from 'react-query';

import { createUseMutation } from 'utils/api/resourceHookFactories';
import defaultFetch from 'utils/fetching/defaultFetch';
import handleResponseData from 'utils/api/handleResponseData';
import { ZetkinNoteBody } from '../utils/types/zetkin';
import { ZetkinUpdate } from 'zui/ZUITimeline/types';
import ZUIQuery from './ZUIQuery';
import ZUISnackbarContext from './ZUISnackbarContext';
import ZUITimeline from 'zui/ZUITimeline';

interface ZUITimelineWrapperProps {
  queryKey: string[];
  itemApiPath: string;
}

const ZUITimelineWrapper: React.FC<ZUITimelineWrapperProps> = ({
  queryKey,
  itemApiPath,
}) => {
  const { showSnackbar } = useContext(ZUISnackbarContext);

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
    <ZUIQuery queries={{ updatesQuery }}>
      {({ queries }) => (
        <ZUITimeline
          disabled={notesMutation.isLoading}
          onAddNote={handleAddNote}
          updates={queries.updatesQuery.data}
        />
      )}
    </ZUIQuery>
  );

  function handleAddNote(note: ZetkinNoteBody) {
    notesMutation.mutate(note, {
      onError: () => showSnackbar('error'),
    });
  }
};

export default ZUITimelineWrapper;
