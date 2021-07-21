import { useIntl } from 'react-intl';
import { Box, Button, Card, CardContent, Typography } from '@material-ui/core';

import { ZetkinTask } from 'types/zetkin';

interface TaskDetailsSectionProps {
    title: string;
    value: string | React.ReactNode;
}

const TaskDetailsSection: React.FunctionComponent<TaskDetailsSectionProps> = ({ title, value }) => {
    return (
        <Box mt={ 2 }>
            <Typography variant="body2">{ title }</Typography>
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
        <Card>
            <CardContent>
                { /* Title and Edit Row */ }
                <Box alignItems="center" display="flex" justifyContent="space-between">
                    <Typography variant="h6">Task Details</Typography>
                    <Button color="primary" variant="contained">Edit</Button>
                </Box>
                <TaskDetailsSection
                    title={ intl.formatMessage({ id: 'misc.tasks.taskDetailsCard.titleLabel' }) }
                    value={ task.title }
                />
                <TaskDetailsSection
                    title={ intl.formatMessage({ id: 'misc.tasks.taskDetailsCard.instructionsLabel' }) }
                    value={ task.instructions }
                />
                <TaskDetailsSection
                    title={ intl.formatMessage({ id: 'misc.tasks.taskDetailsCard.typeLabel' }) }
                    value={ intl.formatMessage({ id: `misc.tasks.types.${task.type}` }) }
                />
            </CardContent>
        </Card>
    );
};

export default TaskDetailsCard;
