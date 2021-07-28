import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Typography } from '@material-ui/core';

interface DeleteTaskFormProps {
    onSubmit: () => void;
    onCancel: () => void;
}

const DeleteTaskForm: React.FunctionComponent<DeleteTaskFormProps> = ({ onCancel, onSubmit }) => {
    return (
        <>
            <Typography variant="body1">
                <Msg id="misc.tasks.forms.deleteTask.warning" />
            </Typography>
            <Box mt={ 4 }>
                <Button color="secondary" fullWidth onClick={ onCancel } variant="contained">
                    <Msg id="misc.tasks.forms.deleteTask.cancel" />
                </Button>
            </Box>
            <Box mt={ 2 }>
                <Button color="primary" fullWidth onClick={ onSubmit } variant="contained">
                    <Msg id="misc.tasks.forms.deleteTask.submitButton" />
                </Button>
            </Box>
        </>
    );
};

export default DeleteTaskForm;
