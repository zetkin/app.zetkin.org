import { Box } from '@material-ui/core';
import { defaultFetch } from 'fetching';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { EllipsisMenuProps } from './EllipsisMenu';
import getView from 'fetching/views/getView';
import TabbedLayout from './TabbedLayout';
import ViewJumpMenu from 'components/views/ViewJumpMenu';
import ViewSmartSearchDialog from 'components/views/ViewSmartSearchDialog';


const SingleViewLayout: FunctionComponent = ({ children }) => {
    const intl = useIntl();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { orgId, viewId } = router.query;
    const [queryDialogOpen, setQueryDialogOpen] = useState(false);
    const viewQuery = useQuery(['view', viewId ], getView(orgId as string, viewId as string));

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
        <Box>
            { view?.title }
            <ViewJumpMenu/>
        </Box>
    );

    const ellipsisMenu: EllipsisMenuProps['items'] = [];

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

    return (
        <>
            <TabbedLayout
                baseHref={ `/organize/${orgId}/people/views/${viewId}` }
                defaultTab="/"
                ellipsisMenu={ ellipsisMenu }
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
