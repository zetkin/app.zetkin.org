import { Button } from '@material-ui/core';
import dayjs from 'dayjs';
// import { FormattedMessage as Msg } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';

import patchTask from 'fetching/tasks/patchTask';
import { ZetkinTask } from 'types/zetkin';

interface PublishButtonProps {
    task: ZetkinTask;
}

const PublishButton: React.FunctionComponent<PublishButtonProps> = ({ task }) => {
    const queryClient = useQueryClient();

    const { published, deadline, expires } = task;
    const now = dayjs();
    const publishedDate = dayjs(published);
    const deadlineDate = dayjs(deadline);
    const expiryDate = dayjs(expires);

    const patchTaskMutation = useMutation(patchTask(task.organization.id, task.id), {
        onSettled: () => queryClient.invalidateQueries('task'),
    });

    // Publish Button is active if published doesn't exist or has not passed, and the deadline or expiry haven't been passed
    const canBePublished = now.isBefore(deadlineDate) && now.isBefore(expiryDate) && (!published || now.isBefore(publishedDate));

    const publishTask = () => {
        patchTaskMutation.mutate({
            published: dayjs().toISOString(),
        });
    };

    return (
        <Button color="primary" disabled={ !canBePublished } onClick={ publishTask } variant="contained">Publish</Button>
    );
};

export default PublishButton;
