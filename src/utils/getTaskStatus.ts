import dayjs from 'dayjs';
import { ZetkinTask } from 'types/zetkin';

export enum TASK_STATUS {
  ACTIVE = 'active',
  CLOSED = 'closed',
  DRAFT = 'draft',
  EXPIRED = 'expired',
  PASSED = 'passed',
  SCHEDULED = 'scheduled',
}

const getTaskStatus = (task: ZetkinTask): TASK_STATUS => {
  const { published, deadline, expires } = task;
  const now = dayjs();

  const expiresDate = dayjs(expires);
  const isExpiresPassed = expiresDate.isBefore(now);

  if (isExpiresPassed) {
    return TASK_STATUS.EXPIRED;
  }

  const deadlineDate = dayjs(deadline);
  const isDeadlinePassed = deadlineDate.isBefore(now);

  if (isDeadlinePassed) {
    return TASK_STATUS.PASSED;
  }

  const publishedDate = dayjs(published);
  const isPublishedPassed = publishedDate.isBefore(now);

  if (isPublishedPassed) {
    return TASK_STATUS.ACTIVE;
  }

  if (published && !isPublishedPassed) {
    return TASK_STATUS.SCHEDULED;
  }

  return TASK_STATUS.DRAFT;
};

export default getTaskStatus;
