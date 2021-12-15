import { Add } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { Box, Button } from '@material-ui/core';

export interface ViewDataTableToolbarProps {
    onColumnCreate: () => void;
}

const ViewDataTableToolbar: React.FunctionComponent<ViewDataTableToolbarProps> = ({ onColumnCreate }) => {
    return (
        <Box display="flex" justifyContent="flex-end">
            <Button data-testid="create-column-button" onClick={ onColumnCreate }>
                <Add /><FormattedMessage id="misc.views.createColumn" />
            </Button>
        </Box>
    );
};

export default ViewDataTableToolbar;
