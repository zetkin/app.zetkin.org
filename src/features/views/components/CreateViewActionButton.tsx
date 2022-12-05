import { Add } from '@mui/icons-material';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Fab, Tooltip, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { FormattedMessage, useIntl } from 'react-intl';

import { viewsResource } from 'features/views/api/views';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';

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

  const { orgId } = router.query;

  const createNewViewMutation = viewsResource(orgId as string).useCreate();

  const createNewView = () =>
    createNewViewMutation.mutate(
      { rows: [] },
      {
        onError: () => setErrorDialogOpen(true),
        onSuccess: (newView) =>
          router.push(`/organize/${orgId}/people/views/${newView.id}`),
      }
    );

  return (
    <>
      <Tooltip
        placement="left"
        title={intl.formatMessage({
          id: 'pages.people.views.createViewButton.tooltip',
        })}
      >
        <Fab
          className={classes.fab}
          color="primary"
          data-testid="create-view-action-button"
          onClick={() => {
            NProgress.start();
            createNewView();
          }}
        >
          <Add />
        </Fab>
      </Tooltip>
      <ZUIDialog
        onClose={() => setErrorDialogOpen(false)}
        open={errorDialogOpen}
      >
        <div data-testid="create-view-error-dialog">
          <Typography variant="body1">
            <FormattedMessage id="pages.people.views.createViewButton.errorDialog.content" />
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              NProgress.start();
              setErrorDialogOpen(false);
              createNewView();
            }}
          >
            <ZUISubmitCancelButtons
              onCancel={() => setErrorDialogOpen(false)}
              submitText={intl.formatMessage({
                id: 'pages.people.views.createViewButton.errorDialog.tryAgain',
              })}
            />
          </form>
        </div>
      </ZUIDialog>
    </>
  );
};

export default CreateViewActionButton;
