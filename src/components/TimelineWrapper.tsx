import { useQuery } from 'react-query';

import { defaultFetch } from 'fetching';
import handleResponseData from 'api/utils/handleResponseData';
import Timeline from './Timeline';
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
  const updatesQuery = useQuery(queryKey, async () => {
    const res = await defaultFetch(itemApiPath + '/timeline/updates');
    return handleResponseData<ZetkinUpdate[]>(res, 'GET');
  });

  return (
    <ZetkinQuery queries={{ updatesQuery }}>
      {({ queries }) => <Timeline updates={queries.updatesQuery.data} />}
    </ZetkinQuery>
  );
};

export default TimelineWrapper;
