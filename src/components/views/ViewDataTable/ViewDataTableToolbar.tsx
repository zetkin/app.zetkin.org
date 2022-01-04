import { FormattedMessage } from 'react-intl';
import { Add, Launch } from '@material-ui/icons';
import { Box, Button } from '@material-ui/core';


export interface ViewDataTableToolbarProps {
    onColumnCreate: () => void;
    onViewCreate: () => void;
    selection: number[];
}

const ViewDataTableToolbar: React.FunctionComponent<ViewDataTableToolbarProps> = ({
    onColumnCreate,
    onViewCreate,
    selection,
}) => {
    return (
        <Box display="flex" justifyContent="flex-end">
            { !!selection.length && (
                <Button
                    data-testid="ViewDataTableToolbar-createFromSelection"
                    onClick={ onViewCreate }
                    startIcon={ <Launch/> }>
                    <FormattedMessage id="misc.views.createFromSelection" />
                </Button>
            ) }
            <Button
                data-testid="ViewDataTableToolbar-createColumn"
                onClick={ onColumnCreate }
                startIcon={ <Add /> }>
                <FormattedMessage id="misc.views.createColumn" />
            </Button>
        </Box>
    );
};

export default ViewDataTableToolbar;
