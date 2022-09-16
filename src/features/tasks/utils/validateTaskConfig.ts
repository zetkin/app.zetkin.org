import { TASK_TYPE, ZetkinTask } from 'features/tasks/components/types';

const validateTaskConfig = (task: ZetkinTask): boolean => {
  if (typeof task.config !== 'object') {
    return false;
  }

  const configLength = Object.values(task.config).length;

  if (task.type === TASK_TYPE.OFFLINE) {
    return configLength === 0;
  }

  if (task.type === TASK_TYPE.VISIT_LINK) {
    return configLength === 1 && 'url' in task.config;
  }

  if (task.type === TASK_TYPE.SHARE_LINK) {
    return (
      configLength === 2 &&
      'url' in task.config &&
      'default_message' in task.config
    );
  }

  if (task.type === TASK_TYPE.COLLECT_DEMOGRAPHICS) {
    // Checks has "fields" property, and that fields has > 0 items
    return (
      configLength === 1 &&
      'fields' in task.config &&
      typeof task.config.fields === 'object' &&
      task.config.fields.length > 0
    );
  }

  return false;
};

export default validateTaskConfig;
