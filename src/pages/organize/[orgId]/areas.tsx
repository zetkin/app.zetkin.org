import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';

import DefaultLayout from '../../../components/layout/organize/DefaultLayout';
import getOrg from '../../../fetching/getOrg';
import { PageWithLayout } from '../../../types';
import { scaffold } from '../../../utils/next';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));

    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    if (orgState?.status === 'success') {
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

type OrganizeAreaPageProps = {
    orgId: string;
};

const OrganizeAreaPage : PageWithLayout<OrganizeAreaPageProps> = () => {
    return (
        <Heading level={ 1 }>
            area page content
        </Heading>
    );
};

OrganizeAreaPage.getLayout = function getLayout(page) {
    return (
        <DefaultLayout>
            { page }
        </DefaultLayout>
    );
};

export default OrganizeAreaPage;
