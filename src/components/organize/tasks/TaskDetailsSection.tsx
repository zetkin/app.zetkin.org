import { useIntl } from 'react-intl';

import getTaskStatus from 'utils/getTaskStatus';
import ZetkinDateTime from 'components/ZetkinDateTime';
import { ZetkinTask } from 'types/zetkin';

import TaskProperty from './TaskProperty';
import TaskTypeDetailsSection from './TaskTypeDetailsSection';

interface TaskDetailsCardProps {
  task: ZetkinTask;
}

const TaskDetailsCard: React.FunctionComponent<TaskDetailsCardProps> = ({
  task,
}) => {
  const intl = useIntl();
  const status = getTaskStatus(task);
  return (
    <>
      <TaskProperty
        title={intl.formatMessage({
          id: 'misc.tasks.taskDetails.statusLabel',
        })}
        value={intl.formatMessage({
          id: `misc.tasks.statuses.${status}`,
        })}
      />
      <TaskProperty
        title={intl.formatMessage({
          id: 'misc.tasks.taskDetails.typeLabel',
        })}
        value={intl.formatMessage({
          id: `misc.tasks.types.${task.type}`,
        })}
      />
      <TaskProperty
        title={intl.formatMessage({
          id: 'misc.tasks.taskDetails.instructionsLabel',
        })}
        value={task.instructions}
      />

      <TaskProperty
        title={intl.formatMessage({
          id: 'misc.tasks.taskDetails.timeEstimateLabel',
        })}
        value={
          task.time_estimate
            ? intl.formatMessage(
                {
                  id: 'misc.tasks.forms.createTask.fields.time_estimate_options.hoursAndMinutes',
                },
                {
                  hours: Math.floor(task.time_estimate / 60),
                  minutes: task.time_estimate % 60,
                }
              )
            : intl.formatMessage({
                id: 'misc.tasks.forms.createTask.fields.time_estimate_options.noEstimate',
              })
        }
      />

      <TaskTypeDetailsSection task={task} />

      <TaskProperty
        title={intl.formatMessage({
          id: 'misc.tasks.taskDetails.publishedTime',
        })}
        value={task.published && <ZetkinDateTime datetime={task.published} />}
      />
      <TaskProperty
        title={intl.formatMessage({
          id: 'misc.tasks.taskDetails.deadlineTime',
        })}
        value={task.deadline && <ZetkinDateTime datetime={task.deadline} />}
      />
      <TaskProperty
        title={intl.formatMessage({
          id: 'misc.tasks.taskDetails.expiresTime',
        })}
        value={task.expires && <ZetkinDateTime datetime={task.expires} />}
      />
      <TaskProperty
        title={intl.formatMessage({
          id: 'misc.tasks.taskDetails.reassignInterval.label',
        })}
        value={
          task.reassign_interval &&
          intl.formatMessage(
            { id: 'misc.tasks.taskDetails.reassignInterval.value' },
            { value: task.reassign_interval }
          )
        }
      />
      <TaskProperty
        title={intl.formatMessage({
          id: 'misc.tasks.taskDetails.reassignLimit.label',
        })}
        value={
          task.reassign_limit &&
          intl.formatMessage(
            {
              id: 'misc.tasks.taskDetails.reassignLimit.value',
            },
            {
              value: task.reassign_limit,
            }
          )
        }
      />
    </>
  );
};

export default TaskDetailsCard;
