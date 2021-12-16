import { Box } from '@material-ui/core';
import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getView from 'fetching/views/getView';
import TabbedLayout from './TabbedLayout';
import ViewJumpMenu from 'components/views/ViewJumpMenu';


const SingleViewLayout: FunctionComponent = ({ children }) => {
    const router = useRouter();
    const { orgId, viewId } = router.query;
    const viewQuery = useQuery(['view', viewId ], getView(orgId as string, viewId as string));

    const view = viewQuery.data;

    const title = (
        <Box>
            { view?.title }
            <ViewJumpMenu/>
        </Box>
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
