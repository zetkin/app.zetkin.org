import { useIntl } from 'react-intl';

import { ZetkinTask } from 'utils/types/zetkin';
import ZUIDateTime from 'zui/ZUIDateTime';

import TaskProperty from './TaskProperty';
import TaskTypeDetailsSection from 'features/tasks/components/TaskTypeDetailsSection';
import ZUISection from 'zui/ZUISection';
import { Card, List } from '@material-ui/core';

interface TaskDetailsCardProps {
  task: ZetkinTask;
}

const TaskDetailsCard: React.FunctionComponent<TaskDetailsCardProps> = ({
  task,
}) => {
  const intl = useIntl();
  return (
    <ZUISection
      title={intl.formatMessage({
        id: 'misc.tasks.taskDetails.title',
      })}
    >
      <Card>
        <List disablePadding>
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

          <TaskProperty
            title={intl.formatMessage({
              id: 'misc.tasks.taskDetails.typeLabel',
            })}
            value={intl.formatMessage({
              id: `misc.tasks.types.${task.type}`,
            })}
          />

          <TaskTypeDetailsSection task={task} />

          <TaskProperty
            title={intl.formatMessage({
              id: 'misc.tasks.taskDetails.publishedTime',
            })}
            value={task.published && <ZUIDateTime datetime={task.published} />}
          />
          <TaskProperty
            title={intl.formatMessage({
              id: 'misc.tasks.taskDetails.deadlineTime',
            })}
            value={task.deadline && <ZUIDateTime datetime={task.deadline} />}
          />
          <TaskProperty
            title={intl.formatMessage({
              id: 'misc.tasks.taskDetails.expiresTime',
            })}
            value={task.expires && <ZUIDateTime datetime={task.expires} />}
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
        </List>
      </Card>
    </ZUISection>
  );
};

export default TaskDetailsCard;
