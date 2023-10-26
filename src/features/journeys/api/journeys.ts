import { createUseQuery } from '../../../utils/api/resourceHookFactories';
import { JourneyInstancesData } from 'pages/api/organize/[orgId]/journeys/[journeyId]';

export const journeyInstancesResource = (orgId: string, journeyId: string) => {
  const key = ['journeyInstances', orgId, journeyId];
  const url = `/organize/${orgId}/journeys/${journeyId}`;

  return {
    useQuery: createUseQuery<JourneyInstancesData>(key, url),
  };
};
