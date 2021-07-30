import { Box, Typography } from '@material-ui/core';

interface TaskPropertyProps {
    title: string;
    value: string | React.ReactNode;
}

const TaskProperty: React.FunctionComponent<TaskPropertyProps> = ({ title, value }) => {
    return (
        <Box mt={ 2 }>
            <Typography variant="subtitle2">{ title }</Typography>
            <Typography variant="body1">{ value }</Typography>
        </Box>
    );
};

export default TaskProperty;
