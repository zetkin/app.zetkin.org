import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Typography } from '@material-ui/core';

interface PublishTaskFormProps {
    onSubmit: () => void;
    onCancel: () => void;
}

const PublishTaskForm: React.FunctionComponent<PublishTaskFormProps> = ({ onCancel, onSubmit }) => {
    return (
        <>
            <Typography variant="body1">
                <Msg id="misc.tasks.forms.publishTask.warning" />
            </Typography>
            <Box mt={ 4 }>
                <Button color="secondary" fullWidth onClick={ onCancel } variant="contained">
                    <Msg id="misc.tasks.forms.publishTask.cancel" />
                </Button>
            </Box>
            <Box mt={ 2 }>
                <Button color="primary" fullWidth onClick={ onSubmit } variant="contained">
                    <Msg id="misc.tasks.forms.publishTask.submitButton" />
                </Button>
            </Box>
        </>
    );
};

export default PublishTaskForm;
