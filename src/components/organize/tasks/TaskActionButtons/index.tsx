/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { Box, Button, Menu, MenuItem } from '@material-ui/core';
import { Delete, Settings } from '@material-ui/icons';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import deleteTask from 'fetching/tasks/deleteTask';
import patchTask from 'fetching/tasks/patchTask';
import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinTask, ZetkinTaskReqBody } from 'types/zetkin';

import DeleteTaskForm from '../forms/DeleteTaskForm';
import PublishButton from './PublishButton';
import TaskDetailsForm from '../forms/TaskDetailsForm';

enum TASK_MENU_ITEMS {
    EDIT_TASK = 'editTask',
    DELETE_TASK = 'deleteTask'
}

interface TaskActionButtonsProps {
    task: ZetkinTask;
}

const TaskActionButtons: React.FunctionComponent<TaskActionButtonsProps> = ({ task }) => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const router = useRouter();
    // Menu
    const [menuActivator, setMenuActivator] = React.useState<null | HTMLElement>(null);
    // Dialogs
    const [currentOpenDialog, setCurrentOpenDialog] = useState<TASK_MENU_ITEMS>();
    const closeDialog = () => setCurrentOpenDialog(undefined);

    // Mutations
    const patchTaskMutation = useMutation(patchTask(task.organization.id, task.id), {
        onSettled: () => queryClient.invalidateQueries('task'),
    });
    const deleteTaskMutation = useMutation(deleteTask(task.organization.id, task.id));

    // Event Handlers
    const handleEditTask = (task: ZetkinTaskReqBody) => {
        patchTaskMutation.mutate(task);
        closeDialog();
    };
    const handleDeleteTask = () => {
        deleteTaskMutation.mutate();
        closeDialog();
        // Navigate back to campaign page
        router.push(`/organize/${task.organization.id}/campaigns/${task.campaign.id}`);
    };

    return (
        <Box display="flex">
            <Box mr={ 1 }>
                <PublishButton task={ task }/>
            </Box>
            <Box>
                <Button color="secondary" disableElevation onClick={ (e) => setMenuActivator(e.currentTarget) } variant="contained">
                    <Settings />
                </Button>
            </Box>
            <Menu
                anchorEl={ menuActivator }
                keepMounted
                onClose={ () => setMenuActivator(null) }
                open={ Boolean(menuActivator) }>
                { /* Edit Task */ }
                <MenuItem
                    key={ TASK_MENU_ITEMS.EDIT_TASK }
                    onClick={ () => {
                        setMenuActivator(null);
                        setCurrentOpenDialog(TASK_MENU_ITEMS.EDIT_TASK);
                    } }>
                    <Box mr={ 1 }><Settings /></Box>
                    <Msg id="misc.tasks.forms.editTask.title" />
                </MenuItem>
                { /* Delete Task */ }
                <MenuItem
                    key={ TASK_MENU_ITEMS.DELETE_TASK }
                    onClick={ () => {
                        setMenuActivator(null);
                        setCurrentOpenDialog(TASK_MENU_ITEMS.DELETE_TASK);
                    } }>
                    <Box mr={ 1 }><Delete /></Box>
                    <Msg id="misc.tasks.forms.deleteTask.title" />
                </MenuItem>
            </Menu>
            { /* Dialogs */ }
            <ZetkinDialog
                onClose={ closeDialog }
                open={ currentOpenDialog === TASK_MENU_ITEMS.EDIT_TASK }
                title={ intl.formatMessage({ id: 'misc.tasks.forms.editTask.title' }) }>
                <TaskDetailsForm
                    onCancel={ closeDialog }
                    onSubmit={ (task)=>{
                        handleEditTask(task);
                    } }
                    task={ task }
                />
            </ZetkinDialog>
            <ZetkinDialog
                onClose={ closeDialog }
                open={ currentOpenDialog === TASK_MENU_ITEMS.DELETE_TASK }
                title={ intl.formatMessage({ id: 'misc.tasks.forms.deleteTask.title' }) }>
                <DeleteTaskForm
                    onCancel={ closeDialog }
                    onSubmit={ handleDeleteTask }
                />
            </ZetkinDialog>
        </Box>

    );
};

export default TaskActionButtons;
