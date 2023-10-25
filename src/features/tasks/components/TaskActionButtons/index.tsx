import { Alert } from '@mui/material';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { Delete, Settings } from '@mui/icons-material';
import React, { useContext, useState } from 'react';

import PublishButton from './PublishButton';
import TaskDetailsForm from 'features/tasks/components/TaskDetailsForm';
import { taskResource } from 'features/tasks/api/tasks';
import { useNumericRouteParams } from 'core/hooks';
import useTask from 'features/tasks/hooks/useTask';
import { ZetkinTask } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { Msg, useMessages } from 'core/i18n';

import messageIds from 'features/tasks/l10n/messageIds';

enum TASK_MENU_ITEMS {
  EDIT_TASK = 'editTask',
  DELETE_TASK = 'deleteTask',
}

interface TaskActionButtonsProps {
  task: ZetkinTask;
}

const TaskActionButtons: React.FunctionComponent<TaskActionButtonsProps> = ({
  task,
}) => {
  const messages = useMessages(messageIds);
  const router = useRouter();
  const { orgId } = useNumericRouteParams();
  // Dialogs
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  // Mutations
  const taskHooks = taskResource(
    task.organization.id.toString(),
    task.id.toString()
  );
  const patchTaskMutation = taskHooks.useUpdate();

  const { deleteTask } = useTask(orgId, task.id);
  // Event Handlers
  const handleEditTask = (task: Partial<ZetkinTask>) => {
    patchTaskMutation.mutateAsync(task, {
      onSuccess: () => setEditTaskDialogOpen(false),
    });
  };
  const handleDeleteTask = () => {
    deleteTask();
    router.push(
      `/organize/${task.organization.id}/projects/${task.campaign.id}`
    );
  };

  return (
    <Box display="flex">
      <Box mr={1}>
        <PublishButton task={task} />
      </Box>
      <Box>
        <ZUIEllipsisMenu
          items={[
            {
              id: TASK_MENU_ITEMS.EDIT_TASK,
              label: (
                <>
                  <Box mr={1}>
                    <Settings />
                  </Box>
                  <Msg id={messageIds.editTask.title} />
                </>
              ),
              onSelect: () => setEditTaskDialogOpen(true),
            },
            {
              id: TASK_MENU_ITEMS.DELETE_TASK,
              label: (
                <>
                  <Box mr={1}>
                    <Delete />
                  </Box>
                  <Msg id={messageIds.deleteTask.title} />
                </>
              ),
              onSelect: () => {
                showConfirmDialog({
                  onSubmit: handleDeleteTask,
                  title: messages.deleteTask.title(),
                  warningText: messages.deleteTask.warning(),
                });
              },
            },
          ]}
        />
      </Box>
      <ZUIDialog
        onClose={() => setEditTaskDialogOpen(false)}
        open={editTaskDialogOpen}
        title={messages.editTask.title()}
      >
        {patchTaskMutation.isError && (
          <Alert color="error" data-testid="error-alert">
            <Msg id={messageIds.form.requestError} />
          </Alert>
        )}
        <TaskDetailsForm
          onCancel={() => setEditTaskDialogOpen(false)}
          onSubmit={(task) => {
            handleEditTask(task);
          }}
          task={task}
        />
      </ZUIDialog>
    </Box>
  );
};

export default TaskActionButtons;
