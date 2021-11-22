import { Add } from '@material-ui/icons';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Fab, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';

import createNewView from 'fetching/views/createNewView';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import ZetkinDialog from 'components/ZetkinDialog';

const useStyles = makeStyles((theme) => ({
    fab: {
        bottom: theme.spacing(4),
        position: 'fixed',
        right: theme.spacing(4),
    },
}));

const CreateViewActionButton: React.FunctionComponent = () => {
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const intl = useIntl();
    const classes = useStyles();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { orgId } = router.query;

    const createNewViewMutation = useMutation(createNewView(orgId as string), {
        onError: () => {
            NProgress.done();
            setErrorDialogOpen(true);
        },
        onSettled: () => queryClient.invalidateQueries(['views', orgId]),
        onSuccess: (newView) => router.push(`/organize/${orgId}/people/views/${newView.id}`),
    });

    const localizedViewFields = {
        first_name_column_title: intl.formatMessage({
            id: 'pages.people.views.createViewButton.newViewFields.columns.first_name',
        }),
        last_name_column_title: intl.formatMessage({
            id: 'pages.people.views.createViewButton.newViewFields.columns.last_name',
        }),
        new_view_title: intl.formatMessage({
            id: 'pages.people.views.createViewButton.newViewFields.title',
        }),
    };

    return (
        <>
            <Tooltip placement="left" title={ intl.formatMessage({ id: 'pages.people.views.createViewButton.tooltip' }) }>
                <Fab
                    className={ classes.fab }
                    color="primary"
                    data-testid="create-view-action-button"
                    onClick={ () => {
                        NProgress.start();
                        createNewViewMutation.mutate(localizedViewFields);
                    } }>
                    <Add />
                </Fab>
            </Tooltip>
            <ZetkinDialog
                onClose={ () => setErrorDialogOpen(false) }
                open={ errorDialogOpen }>
                <Typography variant="body1">
                    <FormattedMessage id="pages.people.views.createViewButton.errorDialog.content" />
                </Typography>
                <form onSubmit={ (e) => {
                    e.preventDefault();
                    NProgress.start();
                    setErrorDialogOpen(false);
                    createNewViewMutation.mutate(localizedViewFields);
                } }>
                    <SubmitCancelButtons
                        onCancel={ () => setErrorDialogOpen(false) }
                        submitText={ intl.formatMessage({ id: 'pages.people.views.createViewButton.errorDialog.tryAgain' }) }
                    />
                </form>
            </ZetkinDialog>
        </>
    );
};

export default CreateViewActionButton;
