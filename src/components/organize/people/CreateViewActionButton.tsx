import { Add } from '@material-ui/icons';
import { useIntl } from 'react-intl';
import { Fab, makeStyles, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    fab: {
        bottom: theme.spacing(4),
        position: 'fixed',
        right: theme.spacing(4),
    },
}));

const CreateViewActionButton: React.FunctionComponent = () => {
    const intl = useIntl();
    const classes = useStyles();

    return (
        <Tooltip placement="left" title={ intl.formatMessage({ id: 'pages.people.views.createViewButton' }) }>
            <Fab className={ classes.fab } color="primary" data-testid="create-view-action-button">
                <Add />
            </Fab>
        </Tooltip>
    );
};

export default CreateViewActionButton;
