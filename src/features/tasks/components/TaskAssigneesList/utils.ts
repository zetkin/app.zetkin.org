import dayjs from 'dayjs';
import {
  ASSIGNED_STATUS,
  ZetkinAssignedTask,
} from 'features/tasks/components/types';

/**
 * Callback function for Array `.sort()` method which sorts assigned tasks by
 * completion state and time relative to other assigned tasks of the same state.
 */
export const sortAssignedTasks = (
  first: ZetkinAssignedTask,
  second: ZetkinAssignedTask
): number => {
  if (
    first.status === ASSIGNED_STATUS.COMPLETED &&
    second.status !== ASSIGNED_STATUS.COMPLETED
  ) {
    return -1;
  }
  if (
    first.status !== ASSIGNED_STATUS.COMPLETED &&
    second.status === ASSIGNED_STATUS.COMPLETED
  ) {
    return 1;
  }
  if (
    first.status === ASSIGNED_STATUS.ASSIGNED &&
    second.status === ASSIGNED_STATUS.IGNORED
  ) {
    return 1;
  }
  if (
    first.status === ASSIGNED_STATUS.IGNORED &&
    second.status === ASSIGNED_STATUS.ASSIGNED
  ) {
    return -1;
  }

  let firstDate;
  if (first.completed) {
    firstDate = dayjs(first.completed);
  } else if (first.ignored) {
    firstDate = dayjs(first.ignored);
  } else {
    firstDate = dayjs(first.assigned);
  }

  let secondDate;
  if (first.completed) {
    secondDate = dayjs(second.completed);
  } else if (first.ignored) {
    secondDate = dayjs(second.ignored);
  } else {
    secondDate = dayjs(second.assigned);
  }

  return secondDate.diff(firstDate);
};
