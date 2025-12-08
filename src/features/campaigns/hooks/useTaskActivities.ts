import { getUTCDateWithoutTime } from 'utils/dateUtils';
import { ZetkinTask } from 'utils/types/zetkin';
import { ACTIVITIES, CampaignActivity } from '../types';
import {
  campaignTaskIdsLoad,
  campaignTaskIdsLoaded,
  tasksLoad,
  tasksLoaded,
} from 'features/tasks/store';
import { useApiClient, useAppSelector } from 'core/hooks';
import { TASKS } from 'utils/featureFlags';
import useFeature from 'utils/featureFlags/useFeature';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useTaskActivities(
  orgId: number,
  campId?: number
): CampaignActivity[] {
  const apiClient = useApiClient();
  const tasksSlice = useAppSelector((state) => state.tasks);

  const hasTasks = useFeature(TASKS);

  // Call all hooks unconditionally, use isNecessary to control loading
  const taskIdsByCampaignId = campId
    ? tasksSlice.taskIdsByCampaignId[campId]
    : undefined;
  const taskIds = useRemoteList(taskIdsByCampaignId, {
    actionOnLoad: () => campaignTaskIdsLoad(campId || 0),
    actionOnSuccess: (data) => campaignTaskIdsLoaded([campId || 0, data]),
    cacheKey: `task-ids-campaign-${orgId}-${campId}`,
    isNecessary: () => !!campId,
    loader: () =>
      apiClient
        .get<ZetkinTask[]>(`/api/orgs/${orgId}/campaigns/${campId}/tasks`)
        .then((tasks) => tasks.map((task) => ({ id: task.id }))),
  });

  const tasksList = tasksSlice.tasksList;
  const campaignTasks = useRemoteList<ZetkinTask>(tasksList, {
    actionOnLoad: () => tasksLoad(),
    actionOnSuccess: (data) => tasksLoaded(data),
    cacheKey: `tasks-campaign-${orgId}-${campId}`,
    isNecessary: () => !!campId,
    loader: () =>
      apiClient.get<ZetkinTask[]>(
        `/api/orgs/${orgId}/campaigns/${campId}/tasks`
      ),
  });

  const allTasks = useRemoteList<ZetkinTask>(tasksList, {
    actionOnLoad: () => tasksLoad(),
    actionOnSuccess: (data) => tasksLoaded(data),
    cacheKey: `tasks-org-${orgId}`,
    isNecessary: () => !campId,
    loader: () => apiClient.get<ZetkinTask[]>(`/api/orgs/${orgId}/tasks`),
  });

  if (!hasTasks) {
    return [];
  }

  const activities: CampaignActivity[] = [];

  if (campId) {
    taskIds.forEach(({ id: taskId }) => {
      const task = campaignTasks.find((item) => item.id === taskId);

      if (task) {
        activities.push({
          data: task,
          kind: ACTIVITIES.TASK,
          visibleFrom: getUTCDateWithoutTime(task.published || null),
          visibleUntil: getUTCDateWithoutTime(task.expires || null),
        });
      }
    });
  } else {
    allTasks.forEach((task) => {
      activities.push({
        data: task,
        kind: ACTIVITIES.TASK,
        visibleFrom: getUTCDateWithoutTime(task.published || null),
        visibleUntil: getUTCDateWithoutTime(task.expires || null),
      });
    });
  }

  return activities;
}
