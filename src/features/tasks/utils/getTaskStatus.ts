import dayjs from 'dayjs';

import { ZetkinTask } from 'utils/types/zetkin';

export enum TASK_STATUS {
  ACTIVE = 'active',
  CLOSED = 'closed',
  DRAFT = 'draft',
  EXPIRED = 'expired',
  SCHEDULED = 'scheduled',
}

const getTaskStatus = (task: ZetkinTask): TASK_STATUS => {
  const { published, expires } = task;
  const now = dayjs();

  const isExpiresPassed = expires && dayjs(expires + '.000Z').isBefore(now);

  if (isExpiresPassed) {
    return TASK_STATUS.EXPIRED;
  }

  const isPublishedPassed =
    published &&
    dayjs(
      published?.replace(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}).+/, '$1') +
        '.000Z'
    ).isBefore(now);

  if (isPublishedPassed) {
    return TASK_STATUS.ACTIVE;
  }

  if (published && !isPublishedPassed) {
    return TASK_STATUS.SCHEDULED;
  }

  return TASK_STATUS.DRAFT;
};

export default getTaskStatus;
