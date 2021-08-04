import { useIntl } from 'react-intl';
import { Box, Typography } from '@material-ui/core';

import ZetkinSection from 'components/ZetkinSection';
import { ZetkinTask } from 'types/zetkin';

interface TaskDetailsSectionProps {
    title: string;
    value: string | React.ReactNode;
}

const TaskDetailsSection: React.FunctionComponent<TaskDetailsSectionProps> = ({ title, value }) => {
    return (
        <Box mt={ 2 }>
            <Typography variant="subtitle2">{ title }</Typography>
            <Typography variant="body1">{ value }</Typography>
        </Box>
    );
};

interface TaskDetailsCardProps {
    task: ZetkinTask;
}

const TaskDetailsCard: React.FunctionComponent<TaskDetailsCardProps> = ({ task }) => {
    const intl = useIntl();
    return (
        <ZetkinSection title={ intl.formatMessage({ id: 'misc.tasks.taskDetails.title' }) }>
            <TaskDetailsSection
                title={ intl.formatMessage({ id: 'misc.tasks.taskDetails.titleLabel' }) }
                value={ task.title }
            />
            <TaskDetailsSection
                title={ intl.formatMessage({ id: 'misc.tasks.taskDetails.instructionsLabel' }) }
                value={ task.instructions }
            />
            <TaskDetailsSection
                title={ intl.formatMessage({ id: 'misc.tasks.taskDetails.typeLabel' }) }
                value={ intl.formatMessage({ id: `misc.tasks.types.${task.type}` }) }
            />
        </ZetkinSection>
    );
};

export default TaskDetailsCard;
