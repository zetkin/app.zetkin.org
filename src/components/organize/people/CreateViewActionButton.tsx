import { Add } from '@material-ui/icons';
import { useIntl } from 'react-intl';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { Fab, makeStyles, Tooltip } from '@material-ui/core';

import createNewView from 'fetching/views/createNew';

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
    const { orgId } = useRouter().query;

    const createNewViewMutation = useMutation(createNewView(orgId as string));

    return (
        <Tooltip placement="left" title={ intl.formatMessage({ id: 'pages.people.views.createViewButton' }) }>
            <Fab
                className={ classes.fab }
                color="primary"
                data-testid="create-view-action-button"
                onClick={ () => {
                    createNewViewMutation.mutate();
                } }>
                <Add />
            </Fab>
        </Tooltip>
    );
};

export default CreateViewActionButton;
