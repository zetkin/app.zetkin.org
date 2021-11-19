import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getView from 'fetching/views/getView';
import TabbedLayout from './TabbedLayout';


const SingleViewLayout: FunctionComponent = ({ children }) => {
    const { orgId, viewId } = useRouter().query;
    const viewQuery = useQuery(['views', orgId, viewId ], getView(orgId as string, viewId as string));

    const view = viewQuery.data;

    return (
        <TabbedLayout
            baseHref={ `/organize/${orgId}/people/views/${viewId}` }
            defaultTab="/"
            fixedHeight={ true }
            tabs={ [
                { href: `/`, messageId: 'layout.organize.view.tabs.view' },
            ] }
            title={ view?.title }>
            { children }
        </TabbedLayout>
    );
};

export default SingleViewLayout;
