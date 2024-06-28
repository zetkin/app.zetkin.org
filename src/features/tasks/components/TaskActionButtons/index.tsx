import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { Delete, Settings } from '@mui/icons-material';
import React, { useContext, useState } from 'react';

import PublishButton from './PublishButton';
import TaskDetailsForm from 'features/tasks/components/TaskDetailsForm';
import useTaskMutations from 'features/tasks/hooks/useTaskMutations';
import { ZetkinTask } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/tasks/l10n/messageIds';
import { ZetkinTaskRequestBody } from '../types';

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
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const { deleteTask, updateTask } = useTaskMutations(
    task.organization.id,
    task.id
  );

  // Event Handlers
  const handleEditTask = (task: ZetkinTaskRequestBody) => {
    updateTask(task);
    setEditTaskDialogOpen(false);
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
