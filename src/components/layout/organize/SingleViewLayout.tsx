import { Alert } from '@material-ui/lab';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Box, Snackbar } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { defaultFetch } from 'fetching';
import EditTextinPlace from 'components/EditTextInPlace';
import getView from 'fetching/views/getView';
import patchView from 'fetching/views/patchView';
import TabbedLayout from './TabbedLayout';
import ViewJumpMenu from 'components/views/ViewJumpMenu';
import ViewSmartSearchDialog from 'components/views/ViewSmartSearchDialog';
import { ZetkinEllipsisMenuProps } from 'components/ZetkinEllipsisMenu';
import ZetkinQuery from 'components/ZetkinQuery';


const SingleViewLayout: FunctionComponent = ({ children }) => {
    const intl = useIntl();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { orgId, viewId } = router.query;
    const [queryDialogOpen, setQueryDialogOpen] = useState(false);
    const viewQuery = useQuery(['view', viewId ], getView(orgId as string, viewId as string));
    const patchViewMutation = useMutation(patchView(orgId as string, viewId as string));

    const [updateViewSnackbar, setUpdateViewSnackbar] = useState<'error' | 'success'>();

    const updateTitle = async (newTitle: string) => {
        patchViewMutation.mutateAsync({ title: newTitle }, {
            onError: () => {
                setUpdateViewSnackbar('error');
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(['view', viewId]);
                setUpdateViewSnackbar('success');
            },
        });
    };

    const view = viewQuery.data;

    // TODO: Create mutation using new factory pattern
    const deleteQueryMutation = useMutation(async () => {
        await defaultFetch(`/orgs/${orgId}/people/views/${view?.id}/content_query`, {
            method: 'DELETE',
        });
    }, {
        onSettled: () => {
            queryClient.invalidateQueries(['view', view?.id.toString(), 'rows']);
            queryClient.invalidateQueries(['view', view?.id.toString()]);
        },
    });

    const title = (
        <>
            <ZetkinQuery queries={{ viewQuery }}>
                { ({ queries: { viewQuery } }) => {
                    const view = viewQuery.data;
                    return (
                        <Box>
                            <EditTextinPlace
                                key={ view.id }
                                disabled={ patchViewMutation.isLoading }
                                onChange={ (newTitle) => updateTitle(newTitle) }
                                value={ view?.title }
                            />
                            <ViewJumpMenu/>
                        </Box>
                    );
                } }
            </ZetkinQuery>
            { /* Snackbar that shows if updating the title failed or succeeded */ }
            <Snackbar
                onClose={ () => setUpdateViewSnackbar(undefined) }
                open={ Boolean(updateViewSnackbar) }>
                { updateViewSnackbar && (
                    <Alert onClose={ () => setUpdateViewSnackbar(undefined) } severity={ updateViewSnackbar }>
                        { intl.formatMessage({ id: `misc.views.editViewTitleAlert.${updateViewSnackbar}` } ) }
                    </Alert>
                ) }

            </Snackbar>
        </>
    );

    const ellipsisMenu: ZetkinEllipsisMenuProps['items'] = [];

    if (view?.content_query) {
        ellipsisMenu.push({
            label: intl.formatMessage({ id: 'pages.people.views.layout.ellipsisMenu.editQuery' }),
            onSelect: () => setQueryDialogOpen(true),
        });
        ellipsisMenu.push({
            label: intl.formatMessage({ id: 'pages.people.views.layout.ellipsisMenu.makeStatic' }),
            onSelect: () => deleteQueryMutation.mutate(),
        });
    }
    else {
        ellipsisMenu.push({
            label: intl.formatMessage({ id: 'pages.people.views.layout.ellipsisMenu.makeDynamic' }),
            onSelect: () => setQueryDialogOpen(true),
        });
    }

    return (
        <>
            <TabbedLayout
                baseHref={ `/organize/${orgId}/people/views/${viewId}` }
                defaultTab="/"
                ellipsisMenuItems={ ellipsisMenu }
                fixedHeight={ true }
                tabs={ [
                    { href: `/`, messageId: 'layout.organize.view.tabs.view' },
                ] }
                title={ title }>
                { children }
            </TabbedLayout>
            { queryDialogOpen && view && (
                <ViewSmartSearchDialog
                    onDialogClose={ () => setQueryDialogOpen(false) }
                    orgId={ orgId as string }
                    view={ view }
                />
            ) }
        </>
    );
};

export default SingleViewLayout;
