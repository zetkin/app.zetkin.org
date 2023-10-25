import { JourneyInstancesData } from 'pages/api/organize/[orgId]/journeys/[journeyId]';
import {
  createUseMutation,
  createUseMutationPatch,
  createUseQuery,
} from '../../../utils/api/resourceHookFactories';
import { ZetkinNote, ZetkinNoteBody } from 'utils/types/zetkin';

export const journeyInstancesResource = (orgId: string, journeyId: string) => {
  const key = ['journeyInstances', orgId, journeyId];
  const url = `/organize/${orgId}/journeys/${journeyId}`;

  return {
    useQuery: createUseQuery<JourneyInstancesData>(key, url),
  };
};

export const journeyInstanceTimelineResource = (
  orgId: string,
  instanceId: string
) => {
  const key = ['journeyInstance', orgId, instanceId, 'timeline'];
  const url = `/orgs/${orgId}/journey_instances/${instanceId}`;

  return {
    useAddNote: createUseMutation<ZetkinNoteBody, unknown>(key, `${url}/notes`),
    useEditNote: createUseMutationPatch<
      Pick<ZetkinNote, 'id' | 'text'>,
      unknown
    >({
      key,
      url: `${url}/notes`,
    }),
  };
};
