import { FormattedMessage } from 'react-intl';
import { GridToolbarFilterButton } from '@mui/x-data-grid-pro';
import { Add, Launch } from '@material-ui/icons';
import { Box, Button, makeStyles } from '@material-ui/core';


export interface ViewDataTableToolbarProps {
    onColumnCreate: () => void;
    onViewCreate: () => void;
    selection: number[];
}

const useStyles = makeStyles({
    main: {
        '& > *': {
            margin: '0 4px',
        },
    },
});

const ViewDataTableToolbar: React.FunctionComponent<ViewDataTableToolbarProps> = ({
    onColumnCreate,
    onViewCreate,
    selection,
}) => {
    const classes = useStyles();

    return (
        <Box className={ classes.main } display="flex" justifyContent="flex-end">
            { !!selection.length && (
                <Button
                    data-testid="ViewDataTableToolbar-createFromSelection"
                    onClick={ onViewCreate }
                    startIcon={ <Launch/> }>
                    <FormattedMessage id="misc.views.createFromSelection" />
                </Button>
            ) }
            <GridToolbarFilterButton componentsProps={{ button: { color: 'default', size: 'medium'  } }} />
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
