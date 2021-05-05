import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';

import getOrg from '../../../fetching/getOrg';
import OrganizeLayout from '../../../components/layout/OrganizeLayout';
import { PageWithLayout } from '../../../types';
import { scaffold } from '../../../utils/next';

const scaffoldOptions = {
    authLevelRequired: 1,
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

type OrganizePageProps = {
    orgId: string;
};

const OrganizePage : PageWithLayout<OrganizePageProps> = () => {

    return (
        <Heading level={ 1 }>
            hello
        </Heading>
    );
};

OrganizePage.getLayout = function getLayout(page, props) {
    return (
        <OrganizeLayout orgId={ props.orgId as string }>
            { page }
        </OrganizeLayout>
    );
};

export default OrganizePage;
