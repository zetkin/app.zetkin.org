import { JourneyInstancesData } from 'pages/api/organize/[orgId]/journeys/[journeyId]';
import { ZetkinUpdate } from 'zui/ZUITimeline/types';
import {
  createPrefetch,
  createUseMutation,
  createUseMutationDelete,
  createUseMutationPatch,
  createUseMutationPut,
  createUseMutationPutWithBody,
  createUseQuery,
} from '../../../utils/api/resourceHookFactories';
import {
  ZetkinJourneyInstance,
  ZetkinJourneyMilestoneStatus,
  ZetkinNote,
  ZetkinNoteBody,
  ZetkinPerson,
  ZetkinTag,
} from 'utils/types/zetkin';

export const journeyInstancesResource = (orgId: string, journeyId: string) => {
  const key = ['journeyInstances', orgId, journeyId];
  const url = `/organize/${orgId}/journeys/${journeyId}`;

  return {
    useCreate: createUseMutation<
      {
        assignees: ZetkinPerson[];
        note: string;
        subjects: ZetkinPerson[];
        tags: ZetkinTag[];
        title: string;
      },
      ZetkinJourneyInstance
    >(key, `/journeyInstances/createNew?orgId=${orgId}&journeyId=${journeyId}`),
    useQuery: createUseQuery<JourneyInstancesData>(key, url),
  };
};

export const journeyInstanceResource = (orgId: string, instanceId: string) => {
  const key = ['journeyInstance', orgId, instanceId];
  const url = `/orgs/${orgId}/journey_instances/${instanceId}`;

  return {
    key,
    prefetch: createPrefetch<ZetkinJourneyInstance>(key, url),
    useAddAssignee: createUseMutationPut({ key, url: `${url}/assignees` }),
    useAddSubject: createUseMutationPut({ key, url: `${url}/subjects` }),
    useAssignTag: createUseMutationPutWithBody<Pick<ZetkinTag, 'id' | 'value'>>(
      { key, url: `${url}/tags` }
    ),
    useClose: createUseMutation<
      { closed: string; outcome?: string; tags?: ZetkinTag[] },
      ZetkinJourneyInstance
    >(key, `/journeyInstances/close?orgId=${orgId}&instanceId=${instanceId}`),
    useRemoveAssignee: createUseMutationDelete({
      key,
      url: `${url}/assignees`,
    }),
    useRemoveSubject: createUseMutationDelete({ key, url: `${url}/subjects` }),
    useUnassignTag: createUseMutationDelete({ key, url: `${url}/tags` }),
    useUpdate: createUseMutation<
      Partial<
        Pick<
          ZetkinJourneyInstance,
          'title' | 'summary' | 'opening_note' | 'outcome' | 'closed'
        > & { journey_id: number }
      >,
      ZetkinJourneyInstance
    >(key, url, {
      method: 'PATCH',
    }),
  };
};

export const journeyMilestoneStatusResource = (
  orgId: string,
  instanceId: string,
  milestoneId: string
) => {
  const key = ['journeyMilestone', orgId, instanceId, milestoneId];
  const url = `/orgs/${orgId}/journey_instances/${instanceId}/milestones/${milestoneId}`;

  return {
    useUpdate: createUseMutation<
      Partial<ZetkinJourneyMilestoneStatus>,
      ZetkinJourneyMilestoneStatus
    >(key, url, { method: 'PATCH' }),
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
    useQueryUpdates: createUseQuery<ZetkinUpdate[]>(
      key,
      `${url}/timeline/updates`
    ),
  };
};
