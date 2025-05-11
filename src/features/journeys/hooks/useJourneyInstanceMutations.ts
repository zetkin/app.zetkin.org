import { JourneyInstanceCloseBody } from 'pages/api/journeyInstances/close';
import {
  invalidateJourneyInstance,
  journeyInstanceUpdate,
  journeyInstanceUpdated,
  journeyInstanceDeleted,
} from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinAppliedTag,
  ZetkinJourneyInstance,
  ZetkinPerson,
} from 'utils/types/zetkin';

type ZetkinJourneyInstancePatchBody = Partial<
  Pick<
    ZetkinJourneyInstance,
    'title' | 'summary' | 'opening_note' | 'outcome' | 'closed'
  > & { journey_id: number }
>;

interface UseJourneyInstanceMutationsReturn {
  addAssignee: (assignee: ZetkinPerson) => Promise<void>;
  addSubject: (subject: ZetkinPerson) => Promise<void>;
  assignTag: (tag: Pick<ZetkinAppliedTag, 'id' | 'value'>) => Promise<void>;
  closeJourneyInstance: (closeBody: JourneyInstanceCloseBody) => Promise<void>;
  deleteJourneyInstance: () => Promise<void>;
  removeAssignee: (assignee: ZetkinPerson) => Promise<void>;
  removeSubject: (subject: ZetkinPerson) => Promise<void>;
  unassignTag: (tagId: number) => Promise<void>;
  updateJourneyInstance: (
    patchBody: ZetkinJourneyInstancePatchBody
  ) => Promise<ZetkinJourneyInstance>;
}

export default function useJourneyInstanceMutations(
  orgId: number,
  instanceId: number
): UseJourneyInstanceMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  async function updateJourneyInstance(
    patchBody: ZetkinJourneyInstancePatchBody
  ) {
    const mutatingAttributes = Object.keys(patchBody);
    dispatch(journeyInstanceUpdate([instanceId, mutatingAttributes]));
    const updatedInstance = await apiClient.patch<ZetkinJourneyInstance>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}`,
      patchBody
    );
    dispatch(journeyInstanceUpdated(updatedInstance));
    return updatedInstance;
  }

  async function deleteJourneyInstance() {
    await apiClient.delete(
      `/api/orgs/${orgId}/journey_instances/${instanceId}`
    );
    dispatch(journeyInstanceDeleted(instanceId));
  }

  async function closeJourneyInstance(closeBody: JourneyInstanceCloseBody) {
    const mutatingAttributes = Object.keys(closeBody);
    dispatch(journeyInstanceUpdate([instanceId, mutatingAttributes]));

    const closedInstance = await apiClient.post<ZetkinJourneyInstance>(
      `/api/journeyInstances/close?orgId=${orgId}&instanceId=${instanceId}`,
      closeBody
    );
    dispatch(journeyInstanceUpdated(closedInstance));
  }

  async function addAssignee(assignee: ZetkinPerson) {
    await apiClient.put<ZetkinJourneyInstance>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}/assignees/${assignee.id}`,
      { assignees: [assignee] }
    );
    dispatch(invalidateJourneyInstance(instanceId));
  }

  async function removeAssignee(assignee: ZetkinPerson) {
    await apiClient.delete(
      `/api/orgs/${orgId}/journey_instances/${instanceId}/assignees/${assignee.id}`
    );
    dispatch(invalidateJourneyInstance(instanceId));
  }

  async function addSubject(subject: ZetkinPerson) {
    await apiClient.put(
      `/api/orgs/${orgId}/journey_instances/${instanceId}/subjects/${subject.id}`
    );
    dispatch(invalidateJourneyInstance(instanceId));
  }

  async function removeSubject(subject: ZetkinPerson) {
    await apiClient.delete(
      `/api/orgs/${orgId}/journey_instances/${instanceId}/subjects/${subject.id}`
    );
    dispatch(invalidateJourneyInstance(instanceId));
  }

  async function assignTag(tag: Pick<ZetkinAppliedTag, 'id' | 'value'>) {
    await apiClient.put<ZetkinAppliedTag>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}/tags/${tag.id}`,
      tag.value ? { value: tag.value } : undefined
    );
    dispatch(invalidateJourneyInstance(instanceId));
  }

  async function unassignTag(tagId: number) {
    await apiClient.delete(
      `/api/orgs/${orgId}/journey_instances/${instanceId}/tags/${tagId}`
    );
    dispatch(invalidateJourneyInstance(instanceId));
  }

  return {
    addAssignee,
    addSubject,
    assignTag,
    closeJourneyInstance,
    deleteJourneyInstance,
    removeAssignee,
    removeSubject,
    unassignTag,
    updateJourneyInstance,
  };
}
