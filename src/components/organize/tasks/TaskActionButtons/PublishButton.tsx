import { Button } from '@material-ui/core';
import dayjs from 'dayjs';
// import { FormattedMessage as Msg } from 'react-intl';
import { useMutation } from 'react-query';

import patchTask from 'fetching/tasks/patchTask';
import { ZetkinTask } from 'types/zetkin';

interface PublishButtonProps {
    task: ZetkinTask;
}

const PublishButton: React.FunctionComponent<PublishButtonProps> = ({ task }) => {
    const eventMutation = useMutation(patchTask(task.organization.id, task.id));

    // const isPublished = task.published;

    const publishTask = () => {
        eventMutation.mutate({
            published: dayjs().toISOString(),
        });
    };

    return (
        <Button color="primary" disabled={ true } onClick={ publishTask } variant="contained">Publish</Button>
    );
};

export default PublishButton;
