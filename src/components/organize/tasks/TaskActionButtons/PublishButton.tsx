import dayjs from 'dayjs';
import { useState } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import TaskPublishForm from 'components/forms/TaskPublishForm';
import { taskResource } from 'api/tasks';
import validateTaskConfig from 'utils/validateTaskConfig';
import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinTask } from 'types/zetkin';
import getTaskStatus, { TASK_STATUS } from 'utils/getTaskStatus';

const getTooltipContents = (taskStatus: TASK_STATUS, isTaskConfigValid: boolean, hasAssignees: boolean): string | null => {
    if (taskStatus === TASK_STATUS.ACTIVE ||
        taskStatus === TASK_STATUS.CLOSED ||
        taskStatus === TASK_STATUS.EXPIRED) {
        return  'misc.tasks.publishButton.tooltip.alreadyPublished';
    }

    if (!isTaskConfigValid && !hasAssignees) {
        return 'misc.tasks.publishButton.tooltip.missingFieldsAndAssignees';
    }

    if (!isTaskConfigValid) {
        return 'misc.tasks.publishButton.tooltip.missingFields';
    }

    if (!hasAssignees) {
        return 'misc.tasks.publishButton.tooltip.missingAssignees';
    }

    return null;
};

interface PublishButtonProps {
    task: ZetkinTask;
}

const PublishButton: React.FunctionComponent<PublishButtonProps> = ({ task }) => {
    const intl = useIntl();
    const [dialogOpen, setDialogOpen] = useState(false);

    const patchTaskMutation = taskResource(
        task.organization.id.toString(),
        task.campaign.id.toString(),
        task.id.toString(),
    ).useUpdate();

    const publishTask = () => {
        patchTaskMutation.mutate({
            published: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        });
        setDialogOpen(false);
    };

    const taskStatus = getTaskStatus(task);
    const isTaskConfigValid = validateTaskConfig(task);
    const hasAssignees = task.target.filter_spec.length > 0;

    const isEnabled = isTaskConfigValid && hasAssignees &&
        (
            taskStatus === TASK_STATUS.DRAFT ||
            taskStatus === TASK_STATUS.SCHEDULED
        );

    const tooltipContents = getTooltipContents(taskStatus, isTaskConfigValid, hasAssignees);

    return (
        <>
            <Tooltip
                arrow
                title={ tooltipContents ? intl.formatMessage({ id: tooltipContents }) : '' }>
                <span>
                    <Button
                        color="primary"
                        disabled={ !isEnabled }
                        onClick={ () => setDialogOpen(true) }
                        variant="contained">
                        <Msg id="misc.tasks.publishButton.publish" />
                    </Button>
                </span>
            </Tooltip>
            <ZetkinDialog
                onClose={ () => {
                    setDialogOpen(false);
                } }
                open={ dialogOpen }
                title="Publish task">
                <TaskPublishForm
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
