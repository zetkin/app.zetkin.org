import makeStyles from '@mui/styles/makeStyles';
import { useRouter } from 'next/router';
import { Box, Theme } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { FunctionComponent, useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import defaultFetch from 'utils/fetching/defaultFetch';
import getView from 'features/views/fetching/getView';
import getViewColumns from '../fetching/getViewColumns';
import getViewRows from '../fetching/getViewRows';
import NProgress from 'nprogress';
import patchView from 'features/views/fetching/patchView';
import TabbedLayout from 'utils/layout/TabbedLayout';
import ViewJumpMenu from 'features/views/components/ViewJumpMenu';
import ViewSmartSearchDialog from 'features/views/components/ViewSmartSearchDialog';
import { viewsResource } from 'features/views/api/views';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import { ZUIEllipsisMenuProps } from 'zui/ZUIEllipsisMenu';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUIQuery from 'zui/ZUIQuery';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { Group, ViewColumnOutlined } from '@mui/icons-material';

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

  const [deactivated, setDeactivated] = useState(false);
  const classes = useStyles({ deactivated });
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);
  const viewQuery = useQuery(
    ['view', viewId],
    getView(orgId as string, viewId as string)
  );
  const patchViewMutation = useMutation(
    patchView(orgId as string, viewId as string)
  );
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const deleteMutation = viewsResource(orgId as string).useDelete();

  const updateTitle = async (newTitle: string) => {
    patchViewMutation.mutateAsync(
      { title: newTitle },
      {
        onError: () => {
          showSnackbar(
            'error',
            intl.formatMessage({
              id: `misc.views.editViewTitleAlert.error`,
            })
          );
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries(['view', viewId]);
          showSnackbar(
            'success',
            intl.formatMessage({
              id: `misc.views.editViewTitleAlert.success`,
            })
          );
        },
      }
    );
  };

  const view = viewQuery.data;

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

  const title = (
    <>
      <ZUIQuery queries={{ viewQuery }}>
        {({ queries: { viewQuery } }) => {
          const view = viewQuery.data;
          return (
            <Box>
              <ZUIEditTextinPlace
                key={view.id}
                disabled={patchViewMutation.isLoading}
                onChange={(newTitle) => updateTitle(newTitle)}
                value={view?.title}
              />
              <ViewJumpMenu />
            </Box>
          );
        }}
      </ZUIQuery>
    </>
  );

  const ellipsisMenu: ZUIEllipsisMenuProps['items'] = [];

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

  const deleteView = () => {
    if (view) {
      setDeactivated(true);
      NProgress.start();
      deleteMutation.mutate(view.id, {
        onError: () => {
          setDeactivated(false);
          showSnackbar(
            'error',
            intl.formatMessage({
              id: 'pages.people.views.layout.deleteDialog.error',
            })
          );
        },
        onSuccess: () => {
          router.push(`/organize/${orgId}/people/views`);
        },
      });
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
    <Box className={classes.deactivateWrapper}>
      <TabbedLayout
        baseHref={`/organize/${orgId}/people/views/${viewId}`}
        defaultTab="/"
        ellipsisMenuItems={ellipsisMenu}
        fixedHeight={true}
        subtitle={
          // TODO: Replace with model eventually
          <ZUIQuery
            queries={{
              colsQuery: useQuery(
                ['view', viewId, 'columns'],
                getViewColumns(orgId as string, viewId as string)
              ),
              rowsQuery: useQuery(
                ['view', viewId, 'rows'],
                getViewRows(orgId as string, viewId as string)
              ),
            }}
          >
            {({ queries: { colsQuery, rowsQuery } }) => (
              <ZUIIconLabelRow
                iconLabels={[
                  {
                    icon: <Group />,
                    label: (
                      <FormattedMessage
                        id="pages.people.views.layout.subtitle.people"
                        values={{ count: rowsQuery.data.length }}
                      />
                    ),
                  },
                  {
                    icon: <ViewColumnOutlined />,
                    label: (
                      <FormattedMessage
                        id="pages.people.views.layout.subtitle.columns"
                        values={{ count: colsQuery.data.length }}
                      />
                    ),
                  },
                ]}
              />
            )}
          </ZUIQuery>
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
    </Box>
  );
};

export default SingleViewLayout;
