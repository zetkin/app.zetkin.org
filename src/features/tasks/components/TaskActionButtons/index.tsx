import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { ArrowForward, Delete, Settings } from '@mui/icons-material';
import React, { useContext, useState } from 'react';

import PublishButton from './PublishButton';
import TaskDetailsForm from 'features/tasks/components/TaskDetailsForm';
import useTaskMutations from 'features/tasks/hooks/useTaskMutations';
import { ZetkinTask } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { useMessages } from 'core/i18n';
import messageIds from 'features/tasks/l10n/messageIds';
import { ZetkinTaskRequestBody } from '../types';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ChangeCampaignDialog from '../../../campaigns/components/ChangeCampaignDialog';

enum TASK_MENU_ITEMS {
  EDIT_TASK = 'editTask',
  DELETE_TASK = 'deleteTask',
  MOVE_TASK = 'moveTask',
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
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const { showSnackbar } = useContext(ZUISnackbarContext);
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

  const handleOnCampaignSelected = async (campaignId: number) => {
    const updatedTask = await updateTask({ campaign_id: campaignId });
    await router.push(
      `/organize/${task.organization.id}/projects/${campaignId}/tasks/${task.id}`
    );
    showSnackbar(
      'success',
      messages.taskChangeCampaignDialog.success({
        campaignTitle: updatedTask.campaign.title,
        taskTitle: task.title,
      })
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
              id: TASK_MENU_ITEMS.MOVE_TASK,
              label: messages.actions.move(),
              onSelect: () => setIsMoveDialogOpen(true),
              startIcon: <ArrowForward />,
            },
            {
              id: TASK_MENU_ITEMS.EDIT_TASK,
              label: messages.editTask.title(),
              onSelect: () => setEditTaskDialogOpen(true),
              startIcon: <Settings />,
            },
            {
              id: TASK_MENU_ITEMS.DELETE_TASK,
              label: messages.deleteTask.title(),
              onSelect: () => {
                showConfirmDialog({
                  onSubmit: handleDeleteTask,
                  title: messages.deleteTask.title(),
                  warningText: messages.deleteTask.warning(),
                });
              },
              startIcon: <Delete />,
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
      <ChangeCampaignDialog
        errorMessage={messages.taskChangeCampaignDialog.error()}
        onCampaignSelected={handleOnCampaignSelected}
        onClose={() => setIsMoveDialogOpen(false)}
        open={isMoveDialogOpen}
        title={messages.taskChangeCampaignDialog.title()}
      />
    </Box>
  );
};

export default TaskActionButtons;
