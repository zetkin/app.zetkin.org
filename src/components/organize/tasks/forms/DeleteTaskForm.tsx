import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Typography } from '@material-ui/core';

interface DeleteTaskFormProps {
    onSubmit: () => void;
}

const DeleteTaskForm: React.FunctionComponent<DeleteTaskFormProps> = ({ onSubmit }) => {
    return (
        <>
            <Typography variant="body1">
                <Msg id="misc.tasks.forms.deleteTask.warning" />
            </Typography>

            <Box mt={ 4 }>
                <Button color="primary" fullWidth onClick={ onSubmit } variant="contained">
                    <Msg id="misc.tasks.forms.deleteTask.submitButton" />
                </Button>
            </Box>
        </>
    );
};

export default DeleteTaskForm;
