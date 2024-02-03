import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { z } from 'zod';
import { ASSIGNED_STATUS, ZetkinAssignedTask } from '../components/types';

const paramsSchema = z.object({
  orgId: z.number(),
  taskId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
export type TaskStats = {
  assigned: number;
  completed: number;
  id: number;
  ignored: number;
  individuals: number;
};

export const getTaskStatsRouteDef = {
  handler: handle,
  name: 'getTaskStats',
  schema: paramsSchema,
};

export default makeRPCDef<Params, TaskStats>('getTaskStats');

async function handle(
  params: Params,
  apiClient: IApiClient
): Promise<TaskStats> {
  const { orgId, taskId } = params;

  const assignedTasks = await apiClient.get<ZetkinAssignedTask[]>(
    `/api/orgs/${orgId}/tasks/${taskId}/assigned`
  );

  const filteredTasks = assignedTasks.filter(
    (task) =>
      task.status != ASSIGNED_STATUS.EXPIRED &&
      task.status != ASSIGNED_STATUS.OVERDUE
  );

  const stats: TaskStats = {
    assigned: 0,
    completed: 0,
    id: taskId,
    ignored: 0,
    individuals: 0,
  };

  filteredTasks.map((task) => {
    if (task.status === ASSIGNED_STATUS.ASSIGNED) {
      ++stats.assigned;
    }
    if (task.status === ASSIGNED_STATUS.COMPLETED) {
      ++stats.completed;
    }
    if (task.status === ASSIGNED_STATUS.IGNORED) {
      ++stats.ignored;
    }
  });

  const assigneeIds = filteredTasks.map((task) => task.assignee.id);
  stats.individuals = [...new Set(assigneeIds)].length;

  return stats;
}
