import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

import getViews from 'fetching/views/getViews';
import { PageWithLayout } from 'types';
import PeopleLayout from 'components/layout/organize/PeopleLayout';
import { scaffold } from 'utils/next';
import { ZetkinView } from 'types/zetkin';
import { CreateViewActionButton, SuggestedViews, ViewsListTable  } from 'components/views';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'pages.people', 'misc',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['views', orgId], getViews(orgId as string, ctx.apiFetch));
    const viewsQueryState = ctx.queryClient.getQueryState<ZetkinView[]>(['views', orgId]);

    if (
        viewsQueryState?.status === 'success'
    ) {
        return {
            props: {
                orgId,
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
}, scaffoldOptions);

type PeopleViewsPageProps = {
    orgId: string;
};

const PeopleViewsPage: PageWithLayout<PeopleViewsPageProps> = () => {
    const intl = useIntl();

    return (
        <>
            <Head>
                <title>
                    { intl.formatMessage({ id:'layout.organize.people.title' })
                    + ' - ' +
                    intl.formatMessage({ id:'layout.organize.people.tabs.views' }) }
                </title>
            </Head>
            <SuggestedViews />
            <ViewsListTable />
            <CreateViewActionButton />
        </>
    );
};

PeopleViewsPage.getLayout = function getLayout(page) {
    return (
        <PeopleLayout>
            { page }
        </PeopleLayout>
    );
};

export default PeopleViewsPage;
