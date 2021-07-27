/* eslint-disable react-hooks/exhaustive-deps */
import { Settings } from '@material-ui/icons';
import { Box, Button, Menu, MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import React, { useState } from 'react';

import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinTask, ZetkinTaskReqBody } from 'types/zetkin';

import TaskDetailsForm from '../forms/TaskDetailsForm';

enum TASK_MENU_ITEMS {
    EDIT_TASK = 'editTask'
}

interface TaskActionButtonsProps {
    task: ZetkinTask;
}

const TaskActionButtons: React.FunctionComponent<TaskActionButtonsProps> = ({ task }) => {
    const intl = useIntl();
    // Menu
    const [menuActivator, setMenuActivator] = React.useState<null | HTMLElement>(null);
    // Dialogs
    const [currentOpenDialog, setCurrentOpenDialog] = useState<TASK_MENU_ITEMS>();
    const closeDialog = () => setCurrentOpenDialog(undefined);

    const handleEditTask = (task: ZetkinTaskReqBody) => {
        return task;
    };

    return (
        <>
            <Button color="secondary" disableElevation onClick={ (e) => setMenuActivator(e.currentTarget) } variant="contained">
                <Settings />
            </Button>
            <Menu
                anchorEl={ menuActivator }
                keepMounted
                onClose={ () => setMenuActivator(null) }
                open={ Boolean(menuActivator) }>
                <MenuItem
                    key={ TASK_MENU_ITEMS.EDIT_TASK }
                    onClick={ () => {
                        setMenuActivator(null);
                        setCurrentOpenDialog(TASK_MENU_ITEMS.EDIT_TASK);
                    } }>
                    <Box mr={ 1 }><Settings /></Box>
                    <Msg id="misc.tasks.forms.editTask.title" />
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
        </>

    );
};

export default TaskActionButtons;
