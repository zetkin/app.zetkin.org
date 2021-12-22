import { Box } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';

import { EllipsisMenuProps } from './EllipsisMenu';
import getView from 'fetching/views/getView';
import TabbedLayout from './TabbedLayout';
import ViewJumpMenu from 'components/views/ViewJumpMenu';
import ViewSmartSearchDialog from 'components/views/ViewSmartSearchDialog';


const SingleViewLayout: FunctionComponent = ({ children }) => {
    const intl = useIntl();
    const router = useRouter();
    const { orgId, viewId } = router.query;
    const [queryDialogOpen, setQueryDialogOpen] = useState(false);
    const viewQuery = useQuery(['view', viewId ], getView(orgId as string, viewId as string));

    const view = viewQuery.data;

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
