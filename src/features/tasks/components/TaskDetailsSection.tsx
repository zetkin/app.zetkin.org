import { Card, List } from '@mui/material';

import { ZetkinTask } from 'utils/types/zetkin';
import ZUIDateTime from 'zui/ZUIDateTime';
import TaskProperty from './TaskProperty';
import TaskTypeDetailsSection from 'features/tasks/components/TaskTypeDetailsSection';
import { useMessages } from 'core/i18n';
import ZUISection from 'zui/ZUISection';
import messageIds from '../l10n/messageIds';

interface TaskDetailsCardProps {
  task: ZetkinTask;
}

const TaskDetailsCard: React.FunctionComponent<TaskDetailsCardProps> = ({
  task,
}) => {
  const messages = useMessages(messageIds);

  return (
    <ZUISection title={messages.taskDetails.title()}>
      <Card>
        <List disablePadding>
          <TaskProperty
            title={messages.taskDetails.instructionsLabel()}
            value={task.instructions}
          />

          <TaskProperty
            title={messages.taskDetails.timeEstimateLabel()}
            value={
              task.time_estimate
                ? messages.form.fields.timeEstimateOptions.hoursAndMinutes({
                    hours: Math.floor(task.time_estimate / 60),
                    minutes: task.time_estimate % 60,
                  })
                : messages.form.fields.timeEstimateOptions.noEstimate()
            }
          />

          <TaskProperty
            title={messages.taskDetails.typeLabel()}
            value={messages.types[task.type]()}
          />

          <TaskTypeDetailsSection task={task} />

          <TaskProperty
            title={messages.taskDetails.publishedTime()}
            value={
              task.published && (
                <ZUIDateTime datetime={task.published + '.000Z'} />
              )
            }
          />
          <TaskProperty
            title={messages.taskDetails.deadlineTime()}
            value={
              task.deadline && (
                <ZUIDateTime datetime={task.deadline + '.000Z'} />
              )
            }
          />
          <TaskProperty
            title={messages.taskDetails.expiresTime()}
            value={
              task.expires && <ZUIDateTime datetime={task.expires + '.000Z'} />
            }
          />
          <TaskProperty
            title={messages.taskDetails.reassignInterval.label()}
            value={
              task.reassign_interval &&
              messages.taskDetails.reassignInterval.value({
                value: task.reassign_interval,
              })
            }
          />
          <TaskProperty
            title={messages.taskDetails.reassignLimit.label()}
            value={
              task.reassign_limit &&
              messages.taskDetails.reassignLimit.value({
                value: task.reassign_limit,
              })
            }
          />
        </List>
      </Card>
    </ZUISection>
  );
};

export default TaskDetailsCard;
