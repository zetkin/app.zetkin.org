import { Button } from '@material-ui/core';
import dayjs from 'dayjs';
import { FormattedMessage as Msg } from 'react-intl';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import patchTask from 'fetching/tasks/patchTask';
import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinTask } from 'types/zetkin';
import getTaskStatus, { TASK_STATUS } from 'utils/getTaskStatus';

import PublishTaskForm from '../forms/PublishTaskForm';

interface PublishButtonProps {
    task: ZetkinTask;
}

const PublishButton: React.FunctionComponent<PublishButtonProps> = ({ task }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const taskStatus = getTaskStatus(task);

    const patchTaskMutation = useMutation(patchTask(task.organization.id, task.id), {
        onSettled: () => queryClient.invalidateQueries('task'),
    });

    const publishTask = () => {
        patchTaskMutation.mutate({
            published: dayjs().toISOString(),
        });
        setDialogOpen(false);
    };

    return (
        <>
            <Button
                color="primary"
                disabled={ taskStatus !== TASK_STATUS.DRAFT && taskStatus !== TASK_STATUS.SCHEDULED }
                onClick={ () => setDialogOpen(true) }
                variant="contained">
                { taskStatus === TASK_STATUS.DRAFT || taskStatus === TASK_STATUS.SCHEDULED ? (
                // If draft or scheduled
                    <Msg id="misc.tasks.publishButton.publish" />
                ) : (
                // If other status
                    <Msg id={ `misc.tasks.publishButton.${taskStatus}` } />
                ) }
            </Button>
            <ZetkinDialog
                onClose={ () => {
                    setDialogOpen(false);
                } }
                open={ dialogOpen }
                title="Publish task">
                <PublishTaskForm
                    onCancel={ () => {
                        setDialogOpen(false);
                    } }
                    onSubmit={ publishTask }
                />
            </ZetkinDialog>
        </>
    );
};

export default PublishButton;
