/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TagMetadata } from '../utils/getTagMetadata';
import {
  createPrefetch,
  createUseMutation,
  createUseMutationDelete,
  createUseMutationPut,
  createUseQuery,
} from './utils/resourceHookFactories';
import {
  ZetkinJourney,
  ZetkinJourneyInstance,
  ZetkinJourneyMilestoneStatus,
  ZetkinPerson,
  ZetkinTag,
} from 'types/zetkin';

export const journeysResource = (orgId: string) => {
  const key = ['journeys', orgId];
  const url = `/orgs/${orgId}/journeys`;

  return {
    prefetch: createPrefetch<ZetkinJourney[]>(key, url),
    useQuery: createUseQuery<ZetkinJourney[]>(key, url),
  };
};

export const journeyResource = (orgId: string, journeyId: string) => {
  const key = ['journey', orgId, journeyId];
  const url = `/orgs/${orgId}/journeys/${journeyId}`;

  return {
    prefetch: createPrefetch<ZetkinJourney>(key, url),
    useQuery: createUseQuery<ZetkinJourney>(key, url),
  };
};

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
    useQuery: createUseQuery<{
      journeyInstances: ZetkinJourneyInstance[];
      tagMetadata: TagMetadata;
    }>(key, url),
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
    useAssignTag: createUseMutationPut({ key, url: `${url}/tags` }),
    useClose: createUseMutation<
      { closed: string; outcome?: string; tags?: ZetkinTag[] },
      ZetkinJourneyInstance
    >(key, `/journeyInstances/close?orgId=${orgId}&instanceId=${instanceId}`),
    useQuery: createUseQuery<ZetkinJourneyInstance>(key, url),
    useRemoveAssignee: createUseMutationDelete({
      key,
      url: `${url}/assignees`,
    }),
    useRemoveSubject: createUseMutationDelete({ key, url: `${url}/subjects` }),
    useUnassignTag: createUseMutationDelete({ key, url: `${url}/tags` }),
    useUpdate: createUseMutation<
      Partial<ZetkinJourneyInstance>,
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
