import { getUTCDateWithoutTime } from 'utils/dateUtils';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinTask } from 'utils/types/zetkin';
import { ACTIVITIES, CampaignActivity } from '../types';
import {
  campaignTaskIdsLoad,
  campaignTaskIdsLoaded,
  tasksLoad,
  tasksLoaded,
} from 'features/tasks/store';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useTaskActivities(
  orgId: number,
  campId?: number
): IFuture<CampaignActivity[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const tasksSlice = useAppSelector((state) => state.tasks);

  const activities: CampaignActivity[] = [];

  if (campId) {
    const taskIdsByCampaignId = tasksSlice.taskIdsByCampaignId[campId];
    const taskIdsFuture = loadListIfNecessary(taskIdsByCampaignId, dispatch, {
      actionOnLoad: () => campaignTaskIdsLoad(campId),
      actionOnSuccess: (data) => campaignTaskIdsLoaded([campId, data]),
      loader: async () => {
        const tasks = await apiClient.get<ZetkinTask[]>(
          `/api/orgs/${orgId}/campaigns/${campId}/tasks`
        );
        return tasks.map((task) => ({ id: task.id }));
      },
    });

    if (taskIdsFuture.isLoading) {
      return new LoadingFuture();
    } else if (taskIdsFuture.error) {
      return new ErrorFuture(taskIdsFuture.error);
    }

    const tasksList = tasksSlice.tasksList;
    const tasksFuture = loadListIfNecessary(tasksList, dispatch, {
      actionOnLoad: () => tasksLoad(),
      actionOnSuccess: (data) => tasksLoaded(data),
      loader: () =>
        apiClient.get<ZetkinTask[]>(
          `/api/orgs/${orgId}/campaigns/${campId}/tasks`
        ),
    });

    if (tasksFuture.isLoading) {
      return new LoadingFuture();
    } else if (tasksFuture.error) {
      return new ErrorFuture(tasksFuture.error);
    }

    if (taskIdsFuture.data && tasksFuture.data) {
      const tasks = tasksFuture.data;
      const taskIds = taskIdsFuture.data;

      taskIds.forEach(({ id: taskId }) => {
        const task = tasks.find((item) => item.id === taskId);

        if (task) {
          activities.push({
            data: task,
            kind: ACTIVITIES.TASK,
            visibleFrom: getUTCDateWithoutTime(task.published || null),
            visibleUntil: getUTCDateWithoutTime(task.expires || null),
          });
        }
      });
    }
  } else {
    const tasksList = tasksSlice.tasksList;
    const allTasksFuture = loadListIfNecessary(tasksList, dispatch, {
      actionOnLoad: () => tasksLoad(),
      actionOnSuccess: (data) => tasksLoaded(data),
      loader: () => apiClient.get<ZetkinTask[]>(`/api/orgs/${orgId}/tasks`),
    });

    if (allTasksFuture.data) {
      const allTasks = allTasksFuture.data;
      allTasks.forEach((task) => {
        activities.push({
          data: task,
          kind: ACTIVITIES.TASK,
          visibleFrom: getUTCDateWithoutTime(task.published || null),
          visibleUntil: getUTCDateWithoutTime(task.expires || null),
        });
      });
    }
  }

  return new ResolvedFuture(activities);
}
