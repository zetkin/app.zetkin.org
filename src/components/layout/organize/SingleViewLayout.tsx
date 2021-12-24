import { Alert } from '@material-ui/lab';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Box, Snackbar } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import EditTextinPlace from 'components/EditTextInPlace';
import getView from 'fetching/views/getView';
import patchView from 'fetching/views/patchView';
import TabbedLayout from './TabbedLayout';
import ViewJumpMenu from 'components/views/ViewJumpMenu';
import ZetkinQuery from 'components/ZetkinQuery';


const SingleViewLayout: FunctionComponent = ({ children }) => {
    const intl = useIntl();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { orgId, viewId } = router.query;
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

    return (
        <TabbedLayout
            baseHref={ `/organize/${orgId}/people/views/${viewId}` }
            defaultTab="/"
            fixedHeight={ true }
            tabs={ [
                { href: `/`, messageId: 'layout.organize.view.tabs.view' },
            ] }
            title={ title }>
            { children }
        </TabbedLayout>
    );
};

export default SingleViewLayout;
