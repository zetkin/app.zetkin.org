import { FC } from 'react';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useTask from 'features/tasks/hooks/useTask';

const localMessageIds = messageIds.filters.task;
interface UnderlinedTaskTitleProps {
  orgId: number;
  taskId: number;
}
const UnderlinedTaskTitle: FC<UnderlinedTaskTitleProps> = ({
  orgId,
  taskId,
}) => {
  const task = useTask(orgId, taskId);
  if (!task) {
    return null;
  }

  return (
    <UnderlinedMsg
      id={localMessageIds.taskSelect.task}
      values={{
        task: <UnderlinedText text={task.title} />,
      }}
    />
  );
};

export default UnderlinedTaskTitle;
