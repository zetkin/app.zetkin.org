/* eslint-disable react-hooks/exhaustive-deps */
import { Alert } from '@material-ui/lab';
import { Box } from '@material-ui/core';
import { useRouter } from 'next/router';
import { Delete, Settings } from '@material-ui/icons';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import React, { useContext, useState } from 'react';

import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinTask } from 'types/zetkin';

import { ConfirmDialogContext } from 'hooks/ConfirmDialogProvider';
import PublishButton from './PublishButton';
import SnackbarContext from 'hooks/SnackbarContext';
import TaskDetailsForm from 'components/forms/TaskDetailsForm';
import ZetkinEllipsisMenu from 'components/ZetkinEllipsisMenu';
import { taskResource, tasksResource } from 'api/tasks';

enum TASK_MENU_ITEMS {
    EDIT_TASK = 'editTask',
    DELETE_TASK = 'deleteTask'
}

interface TaskActionButtonsProps {
    task: ZetkinTask;
}

const TaskActionButtons: React.FunctionComponent<TaskActionButtonsProps> = ({ task }) => {
    const intl = useIntl();
    const router = useRouter();
    // Dialogs
    const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
    const { showConfirmDialog } = useContext(ConfirmDialogContext);
    const { showSnackbar } = useContext(SnackbarContext);

    // Mutations
    const taskHooks = taskResource(
        task.organization.id.toString(),
        task.id.toString(),
    );
    const patchTaskMutation = taskHooks.useUpdate();
    const deleteTaskMutation = tasksResource(task.organization.id.toString()).useDelete();

    // Event Handlers
    const handleEditTask = (task: Partial<ZetkinTask>) => {
        patchTaskMutation.mutateAsync(task, {
            onSuccess: () => setEditTaskDialogOpen(false),
        });
    };
    const handleDeleteTask = () => {
        deleteTaskMutation.mutate(task.id, {
            onError: () => showSnackbar('error', intl.formatMessage({ id: 'misc.tasks.forms.deleteTask.error' })),
            onSuccess: () => {
                // Navigate back to campaign page
                router.push(`/organize/${task.organization.id}/campaigns/${task.campaign.id}`);
            },
        });

    };

    return (
        <Box display="flex">
            <Box mr={ 1 }>
                <PublishButton task={ task }/>
            </Box>
            <Box>
                <ZetkinEllipsisMenu items={ [
                    {
                        id: TASK_MENU_ITEMS.EDIT_TASK,
                        label: (
                            <>
                                <Box mr={ 1 }><Settings /></Box>
                                <Msg id="misc.tasks.forms.editTask.title" />
                            </>
                        ),
                        onSelect: () => setEditTaskDialogOpen(true),
                    },
                    {
                        id: TASK_MENU_ITEMS.DELETE_TASK,
                        label: (
                            <>
                                <Box mr={ 1 }><Delete /></Box>
                                <Msg id="misc.tasks.forms.deleteTask.title" />
                            </>
                        ),
                        onSelect: () => {
                            showConfirmDialog({
                                onSubmit: handleDeleteTask,
                                title: intl.formatMessage({ id: 'misc.tasks.forms.deleteTask.title' }),
                                warningText: intl.formatMessage({ id: 'misc.tasks.forms.deleteTask.warning' }),
                            });
                        },
                    },
                ] }
                />
            </Box>
            <ZetkinDialog
                onClose={ () => setEditTaskDialogOpen(false) }
                open={ editTaskDialogOpen }
                title={ intl.formatMessage({ id: 'misc.tasks.forms.editTask.title' }) }>
                {
                    patchTaskMutation.isError &&
                    <Alert color="error" data-testid="error-alert">
                        <Msg id="misc.formDialog.requestError" />
                    </Alert>
                }
                <TaskDetailsForm
                    onCancel={ () => setEditTaskDialogOpen(false) }
                    onSubmit={ (task)=>{
                        handleEditTask(task);
                    } }
                    task={ task }
                />
            </ZetkinDialog>
        </Box>

    );
};

export default TaskActionButtons;
