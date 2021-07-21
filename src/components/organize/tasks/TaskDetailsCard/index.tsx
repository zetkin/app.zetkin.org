import { Box, Button, Card, CardContent, Typography } from '@material-ui/core';

import { ZetkinTask } from 'types/zetkin';

interface TaskDetailsSectionProps {
    title: string;
    value: string;
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
    return (
        <Card>
            <CardContent>
                { /* Title and Edit Row */ }
                <Box alignItems="center" display="flex" justifyContent="space-between">
                    <Typography variant="h6">Task Details</Typography>
                    <Button color="primary" variant="contained">Edit</Button>
                </Box>
                <TaskDetailsSection title="Title" value={ task.title } />
                <TaskDetailsSection title="Instructions" value={ task.instructions } />
                <TaskDetailsSection title="Type" value={ task.type }/>
            </CardContent>
        </Card>
    );
};

export default TaskDetailsCard;
