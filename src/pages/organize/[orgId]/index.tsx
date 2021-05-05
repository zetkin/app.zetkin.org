
import Actions from '@spectrum-icons/workflow/Actions';
import Cloud from '@spectrum-icons/workflow/Cloud';
import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import Settings from '@spectrum-icons/workflow/Settings';
import { useQuery } from 'react-query';
import { Flex, Header, Heading, Image, View } from '@adobe/react-spectrum';

import apiUrl from '../../../utils/apiUrl';
import DashboardCampaigns from '../../../components/DashboardCampaigns';
import DashboardPeople from '../../../components/DashboardPeople';
import getCampaigns from '../../../fetching/getCampaigns';
import getOrg from '../../../fetching/getOrg';
import OrganizeLayout from '../../../components/layout/OrganizeLayout';
import { PageWithLayout } from '../../../types';
import { scaffold } from '../../../utils/next';


const scaffoldOptions = {
    authLevelRequired: 1,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'pages.organize',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = context.params!;

    await context.queryClient.prefetchQuery(['campaigns', orgId], getCampaigns(orgId as string, context.apiFetch));
    await context.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, context.apiFetch));

    const campaignsState = context.queryClient.getQueryState(['campaigns', orgId]);
    const orgState = context.queryClient.getQueryState(['org', orgId]);

    if (campaignsState?.status === 'success' && orgState?.status === 'success') {
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

const OrganizePage: PageWithLayout<OrganizePageProps> = ({ orgId }) => {

    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <View borderColor="gray-400" borderWidth="thick" margin="1rem" padding="1rem">
                <Header>
                    <Flex height="100%" justifyContent="start" width="100%">
                        <Image
                            alt="Organization avatar"
                            data-testid="org-avatar"
                            objectFit="contain"
                            src={ apiUrl(`/orgs/${orgId}/avatar`) }
                            width="size-1200"
                        />
                        <View>
                            <Flex direction="column" margin="0 1rem">
                                <Heading level={ 1 }>
                                    { orgQuery.data?.title }
                                </Heading>
                                <View>
                                    <Cloud aria-label="Cloud" size="XS" />
                                    <NextLink href={ `/o/${orgId}` }>
                                        <a style={{ margin:'0.5rem' }}>
                                            <Msg id="pages.organize.linkGroup.public"/>
                                        </a>
                                    </NextLink>
                                    <Actions aria-label="Actions" size="XS" />
                                    <NextLink href={ `/organize/${orgId}/organization` }>
                                        <a style={{ margin:'0.5rem' }}>
                                            <Msg id="pages.organize.linkGroup.manage"/>
                                        </a>
                                    </NextLink>
                                    <Settings aria-label="Settings" size="XS" />
                                    <NextLink href={ `/organize/${orgId}/settings` }>
                                        <a style={{ margin:'0.5rem' }}>
                                            <Msg id="pages.organize.linkGroup.settings"/>
                                        </a>
                                    </NextLink>
                                </View>
                            </Flex>
                        </View>
                    </Flex>
                </Header>
            </View>
            <View>
                <Flex>
                    <View width="50%">
                        <View borderColor="gray-400" borderWidth="thick" margin="size-200" padding="size-200">
                            <DashboardCampaigns orgId={ orgId }/>
                        </View>
                        <View borderColor="gray-400" borderWidth="thick" margin="size-200" padding="size-200">
                            <DashboardPeople orgId={ orgId }/>
                        </View>
                        <View borderColor="gray-400" borderWidth="thick" margin="size-200">
                            Areas
                        </View>
                    </View>
                    <View borderColor="gray-400" borderWidth="thick" height="size-1200" margin="size-200" width="50%">Inbox</View>
                </Flex>
            </View>
        </>
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
