import { FormattedMessage } from 'react-intl';
import { Add, Launch, RemoveCircleOutline } from '@material-ui/icons';
import { Box, Button, Slide } from '@material-ui/core';


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
            <Slide direction="left" in={ !!selection.length } timeout={ 150 }>
                <Button
                    data-testid="ViewDataTableToolbar-createFromSelection"
                    onClick={ onViewCreate }
                    startIcon={ <Launch/> }>
                    <FormattedMessage id="misc.views.createFromSelection" />
                </Button>
            </Slide>
            <Slide direction="left" in={ !!selection.length } timeout={ 100 }>
                <Button
                    data-testid="ViewDataTableToolbar-removeFromSelection"
                    onClick={ onViewCreate }
                    startIcon={ <RemoveCircleOutline /> }>
                    <FormattedMessage id="misc.views.removeFromSelection" values={{ numSelected: selection.length }} />
                </Button>
            </Slide>
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
