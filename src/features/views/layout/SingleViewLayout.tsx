import makeStyles from '@mui/styles/makeStyles';
import { useRouter } from 'next/router';
import { Box, Button, Theme } from '@mui/material';
import { FunctionComponent, useContext, useState } from 'react';

import NProgress from 'nprogress';
import ShareViewDialog from '../components/ShareViewDialog';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import useView from '../hooks/useView';
import useViewDataTableMutation from '../hooks/useViewDataTableMutation';
import useViewGrid from '../hooks/useViewGrid';
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
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';
import SimpleLayout from 'utils/layout/SimpleLayout';

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
  const parsedOrgId = parseInt(orgId as string);
  const parsedViewId = parseInt(viewId as string);

  const shareModel = useModel(
    (env) =>
      new ViewSharingModel(
        env,
        parseInt(orgId as string),
        parseInt(viewId as string)
      )
  );

  const [deactivated, setDeactivated] = useState(false);
  const classes = useStyles({ deactivated });
  const messages = useMessages(messageIds);
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { deleteView: deleteList, getView, setTitle } = useView(parsedOrgId);

  const { deleteContentQuery } = useViewDataTableMutation(
    parsedOrgId,
    parsedViewId
  );
  const { columnsFuture, rowsFuture } = useViewGrid(parsedOrgId, parsedViewId);

  // TODO: Remove once SSR is supported for models
  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  const title = (
    <>
      <ZUIFuture future={getView(parsedViewId)}>
        {(view) => {
          return (
            <Box>
              <ZUIEditTextinPlace
                key={view.id}
                onChange={(newTitle) => {
                  try {
                    setTitle(parsedViewId, newTitle);
                    showSnackbar(
                      'success',
                      messages.editViewTitleAlert.success()
                    );
                  } catch (err) {
                    showSnackbar('error', messages.editViewTitleAlert.error());
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

  const view = getView(parsedViewId).data;

  if (view?.content_query) {
    ellipsisMenu.push({
      label: messages.viewLayout.ellipsisMenu.editQuery(),
      onSelect: () => setQueryDialogOpen(true),
    });
    ellipsisMenu.push({
      label: messages.viewLayout.ellipsisMenu.makeStatic(),
      onSelect: () => {
        deleteContentQuery();
      },
    });
  } else {
    ellipsisMenu.push({
      label: messages.viewLayout.ellipsisMenu.makeDynamic(),
      onSelect: () => setQueryDialogOpen(true),
    });
  }

  const deleteView = async () => {
    if (view) {
      setDeactivated(true);
      NProgress.start();
      try {
        await deleteList(view.id);
      } catch (err) {
        setDeactivated(false);
        showSnackbar('error', messages.deleteDialog.error());
      } finally {
        router.push(`/organize/${orgId}/people`);
      }
    }
  };

  ellipsisMenu.push({
    id: 'delete-view',
    label: messages.viewLayout.ellipsisMenu.delete(),
    onSelect: () => {
      showConfirmDialog({
        onSubmit: deleteView,
        title: messages.deleteDialog.title(),
        warningText: messages.deleteDialog.warningText(),
      });
    },
  });

  return (
    <Box key={viewId as string} className={classes.deactivateWrapper}>
      <SimpleLayout
        actionButtons={
          <Button
            endIcon={<Share />}
            onClick={() => setShareDialogOpen(true)}
            variant="contained"
          >
            <Msg id={messageIds.viewLayout.actions.share} />
          </Button>
        }
        ellipsisMenuItems={ellipsisMenu}
        fixedHeight={true}
        subtitle={
          // TODO: Replace with model eventually
          <ZUIFutures
            futures={{
              cols: columnsFuture,
              rows: rowsFuture,
            }}
          >
            {({ data: { cols, rows } }) => {
              const labels = [
                {
                  icon: <Group />,
                  label: (
                    <Msg
                      id={messageIds.viewLayout.subtitle.people}
                      values={{ count: rows.length }}
                    />
                  ),
                },
                {
                  icon: <ViewColumnOutlined />,
                  label: (
                    <Msg
                      id={messageIds.viewLayout.subtitle.columns}
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
                    <Msg
                      id={messageIds.viewLayout.subtitle.collaborators}
                      values={{ count: accessListFuture.data.length }}
                    />
                  ),
                });
              }

              return <ZUIIconLabelRow iconLabels={labels} />;
            }}
          </ZUIFutures>
        }
        title={title}
      >
        {children}
      </SimpleLayout>
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
