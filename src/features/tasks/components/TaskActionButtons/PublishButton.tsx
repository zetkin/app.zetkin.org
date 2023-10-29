import dayjs from 'dayjs';
import { useContext } from 'react';
import { Button, Tooltip } from '@mui/material';

import useTaskMutations from 'features/tasks/hooks/useTaskMutations';
import validateTaskConfig from 'features/tasks/utils/validateTaskConfig';
import { ZetkinTask } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import getTaskStatus, { TASK_STATUS } from 'features/tasks/utils/getTaskStatus';
import { Msg, useMessages, UseMessagesMap } from 'core/i18n';

import messageIds from 'features/tasks/l10n/messageIds';

const getTooltipContents = (
  messages: UseMessagesMap<typeof messageIds>,
  taskStatus: TASK_STATUS,
  isTaskConfigValid: boolean,
  hasAssignees: boolean
): string | null => {
  if (
    taskStatus === TASK_STATUS.ACTIVE ||
    taskStatus === TASK_STATUS.CLOSED ||
    taskStatus === TASK_STATUS.EXPIRED
  ) {
    return messages.publishButton.tooltip.alreadyPublished();
  }

  if (!isTaskConfigValid && !hasAssignees) {
    return messages.publishButton.tooltip.missingFieldsAndAssignees();
  }

  if (!isTaskConfigValid) {
    return messages.publishButton.tooltip.missingFields();
  }

  if (!hasAssignees) {
    return messages.publishButton.tooltip.missingAssignees();
  }

  return null;
};

interface PublishButtonProps {
  task: ZetkinTask;
}

const PublishButton: React.FunctionComponent<PublishButtonProps> = ({
  task,
}) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const { updateTask } = useTaskMutations(task.organization.id, task.id);
  const publishTask = () => {
    updateTask({ published: dayjs().format('YYYY-MM-DDTHH:mm:ss') });
  };

  const taskStatus = getTaskStatus(task);
  const isTaskConfigValid = validateTaskConfig(task);
  const hasAssignees = task.target.filter_spec.length > 0;

  const isEnabled =
    isTaskConfigValid &&
    hasAssignees &&
    (taskStatus === TASK_STATUS.DRAFT || taskStatus === TASK_STATUS.SCHEDULED);

  const tooltipContents = getTooltipContents(
    messages,
    taskStatus,
    isTaskConfigValid,
    hasAssignees
  );

  return (
    <Tooltip arrow title={tooltipContents || ''}>
      <span>
        <Button
          color="primary"
          disabled={!isEnabled}
          onClick={() =>
            showConfirmDialog({
              onSubmit: publishTask,
              title: messages.publishTask.title(),
              warningText: messages.publishTask.warning(),
            })
          }
          variant="contained"
        >
          <Msg id={messageIds.publishButton.publish} />
        </Button>
      </span>
    </Tooltip>
  );
};

export default PublishButton;
