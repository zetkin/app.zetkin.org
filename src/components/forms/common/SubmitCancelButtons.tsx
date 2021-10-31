import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button } from '@mui/material';

const SubmitCancelButtons: React.FunctionComponent<{
    onCancel: () => unknown;
    submitDisabled: boolean;
}> = ({ onCancel, submitDisabled }) => {
    return (
        <Box display="flex" justifyContent="flex-end" mt={ 2 } width={ 1 }>
            <Box m={ 1 }>
                <Button color="primary" onClick={ onCancel }>
                    <Msg id="misc.formDialog.cancel" />
                </Button>
            </Box>
            <Box m={ 1 }>
                <Button color="primary" disabled={ submitDisabled } type="submit" variant="contained">
                    <Msg id="misc.formDialog.submit" />
                </Button>
            </Box>
        </Box>
    );
};

export default SubmitCancelButtons;
