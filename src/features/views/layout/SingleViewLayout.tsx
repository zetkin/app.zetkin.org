import makeStyles from '@mui/styles/makeStyles';
import { useRouter } from 'next/router';
import { Box, Button, Theme } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { FunctionComponent, useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import defaultFetch from 'utils/fetching/defaultFetch';
import NProgress from 'nprogress';
import ShareViewDialog from '../components/ShareViewDialog';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import ViewDataModel from '../models/ViewDataModel';
import ViewJumpMenu from 'features/views/components/ViewJumpMenu';
import ViewSharingModel from '../models/ViewSharingModel';
import ViewSmartSearchDialog from 'features/views/components/ViewSmartSearchDialog';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import { ZUIEllipsisMenuProps } from 'zui/ZUIEllipsisMenu';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIFutures from 'zui/ZUIFutures';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { Group, Share, ViewColumnOutlined } from '@mui/icons-material';

const useStyles = makeStyles<Theme, { deactivated: boolean }>(() => ({
  deactivateWrapper: {
    filter: (props) =>
      props.deactivated ? 'grayscale(1) opacity(0.5)' : 'none',
    pointerEvents: (props) => (props.deactivated ? 'none' : 'all'),
    transition: 'filter 0.3s ease',
  },
}));

interface SingleViewLayoutProps {
  children: React.ReactNode;
}

const SingleViewLayout: FunctionComponent<SingleViewLayoutProps> = ({
  children,
}) => {
  const router = useRouter();
  const { orgId, viewId } = router.query;

  const shareModel = useModel(
    (env) =>
      new ViewSharingModel(
        env,
        parseInt(orgId as string),
        parseInt(viewId as string)
      )
  );

  const dataModel = useModel(
    (env) =>
      new ViewDataModel(
        env,
        parseInt(orgId as string),
        parseInt(viewId as string)
      )
  );

  const [deactivated, setDeactivated] = useState(false);
  const classes = useStyles({ deactivated });
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  // TODO: Create mutation using new factory pattern
  const deleteQueryMutation = useMutation(
    async () => {
      await defaultFetch(
        `/orgs/${orgId}/people/views/${view?.id}/content_query`,
        {
          method: 'DELETE',
        }
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(['view', view?.id.toString(), 'rows']);
        queryClient.invalidateQueries(['view', view?.id.toString()]);
      },
    }
  );

  // TODO: Remove once SSR is supported for models
  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  const title = (
    <>
      <ZUIFuture future={dataModel.getView()}>
        {(view) => {
          return (
            <Box>
              <ZUIEditTextinPlace
                key={view.id}
                onChange={(newTitle) => {
                  try {
                    dataModel.setTitle(newTitle);
                    showSnackbar(
                      'success',
                      intl.formatMessage({
                        id: `misc.views.editViewTitleAlert.success`,
                      })
                    );
                  } catch (err) {
                    showSnackbar(
                      'error',
                      intl.formatMessage({
                        id: `misc.views.editViewTitleAlert.error`,
                      })
                    );
                  }
                }}
                value={view?.title}
              />
              <ViewJumpMenu />
            </Box>
          );
        }}
      </ZUIFuture>
    </>
  );

  const ellipsisMenu: ZUIEllipsisMenuProps['items'] = [];

  const view = dataModel.getView().data;

  if (view?.content_query) {
    ellipsisMenu.push({
      label: intl.formatMessage({
        id: 'pages.people.views.layout.ellipsisMenu.editQuery',
      }),
      onSelect: () => setQueryDialogOpen(true),
    });
    ellipsisMenu.push({
      label: intl.formatMessage({
        id: 'pages.people.views.layout.ellipsisMenu.makeStatic',
      }),
      onSelect: () => deleteQueryMutation.mutate(),
    });
  } else {
    ellipsisMenu.push({
      label: intl.formatMessage({
        id: 'pages.people.views.layout.ellipsisMenu.makeDynamic',
      }),
      onSelect: () => setQueryDialogOpen(true),
    });
  }

  const deleteView = async () => {
    if (view) {
      setDeactivated(true);
      NProgress.start();
      try {
        await dataModel.delete();
      } catch (err) {
        setDeactivated(false);
        showSnackbar(
          'error',
          intl.formatMessage({
            id: 'pages.people.views.layout.deleteDialog.error',
          })
        );
      } finally {
        router.push(`/organize/${orgId}/people/views`);
      }
    }
  };

  ellipsisMenu.push({
    id: 'delete-view',
    label: intl.formatMessage({
      id: 'pages.people.views.layout.ellipsisMenu.delete',
    }),
    onSelect: () => {
      showConfirmDialog({
        onSubmit: deleteView,
        title: intl.formatMessage({
          id: 'pages.people.views.layout.deleteDialog.title',
        }),
        warningText: intl.formatMessage({
          id: 'pages.people.views.layout.deleteDialog.warningText',
        }),
      });
    },
  });

  return (
    <Box key={viewId as string} className={classes.deactivateWrapper}>
      <TabbedLayout
        actionButtons={
          <Button
            endIcon={<Share />}
            onClick={() => setShareDialogOpen(true)}
            variant="contained"
          >
            <FormattedMessage id="pages.people.views.layout.actions.share" />
          </Button>
        }
        baseHref={`/organize/${orgId}/people/views/${viewId}`}
        defaultTab="/"
        ellipsisMenuItems={ellipsisMenu}
        fixedHeight={true}
        subtitle={
          // TODO: Replace with model eventually
          <ZUIFutures
            futures={{
              cols: dataModel.getColumns(),
              rows: dataModel.getRows(),
            }}
          >
            {({ data: { cols, rows } }) => {
              const labels = [
                {
                  icon: <Group />,
                  label: (
                    <FormattedMessage
                      id="pages.people.views.layout.subtitle.people"
                      values={{ count: rows.length }}
                    />
                  ),
                },
                {
                  icon: <ViewColumnOutlined />,
                  label: (
                    <FormattedMessage
                      id="pages.people.views.layout.subtitle.columns"
                      values={{ count: cols.length }}
                    />
                  ),
                },
              ];

              const accessListFuture = shareModel.getAccessList();
              if (accessListFuture.data?.length) {
                labels.push({
                  icon: <Share />,
                  label: (
                    <FormattedMessage
                      id="pages.people.views.layout.subtitle.collaborators"
                      values={{ count: accessListFuture.data.length }}
                    />
                  ),
                });
              }

              return <ZUIIconLabelRow iconLabels={labels} />;
            }}
          </ZUIFutures>
        }
        tabs={[{ href: `/`, messageId: 'layout.organize.view.tabs.view' }]}
        title={title}
      >
        {children}
      </TabbedLayout>
      {queryDialogOpen && view && (
        <ViewSmartSearchDialog
          onDialogClose={() => setQueryDialogOpen(false)}
          orgId={orgId as string}
          view={view}
        />
      )}
      {view && shareDialogOpen && (
        <ShareViewDialog
          model={shareModel}
          onClose={() => setShareDialogOpen(false)}
          view={view}
        />
      )}
    </Box>
  );
};

export default SingleViewLayout;
