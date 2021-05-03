import Actions from '@spectrum-icons/workflow/Actions';
import Cloud from '@spectrum-icons/workflow/Cloud';
import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import Settings from '@spectrum-icons/workflow/Settings';
import { Flex, Header, Heading, Image, View } from '@adobe/react-spectrum';

import apiUrl from '../../../utils/apiUrl';
import DashboardCampaigns from '../../../components/DashboardCampaigns';
import DashboardPeople from '../../../components/DashboardPeople';
import getCampaigns from '../../../fetching/getCampaigns';
import getOrg from '../../../fetching/getOrg';
import { PageWithLayout } from '../../../types';
import { scaffold } from '../../../utils/next';
import { useQuery } from 'react-query';

const scaffoldOptions = {
    authLevelRequired: 1,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'pages.organize',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = context.params!;

    await context.queryClient.prefetchQuery(['campaigns', orgId], getCampaigns(orgId as string));
    await context.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

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

const OrganizePage: PageWithLayout<OrganizePageProps> = ({ orgId  }) => {

    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <View borderColor="celery-400" borderWidth="thick">
                <Header height="size-1200">
                    <Flex height="100%" justifyContent="start" width="100%">
                        <Image
                            alt="Organization avatar"
                            data-testid="org-avatar"
                            height="size-1200"
                            objectFit="contain"
                            src={ apiUrl(`/orgs/${orgId}/avatar`) }
                            width="size-1200"
                        />
                        <View>
                            <Flex direction="column">
                                <Heading level={ 1 }>
                                    { orgQuery.data?.title }
                                </Heading>
                                <View>
                                    <Cloud aria-label="Cloud" size="XS" />
                                    <NextLink href={ `/o/${orgId}` }>
                                        <a>
                                            <Msg id="pages.organize.linkGroup.public"/>
                                        </a>
                                    </NextLink>
                                    <Actions aria-label="Actions" size="XS" />
                                    <NextLink href={ `/organize/${orgId}/organization` }>
                                        <a>
                                            <Msg id="pages.organize.linkGroup.manage"/>
                                        </a>
                                    </NextLink>
                                    <Settings aria-label="Settings" size="XS" />
                                    <NextLink href={ `/organize/${orgId}/settings` }>
                                        <a>
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
                <Flex wrap>
                    <View width="50%">
                        <View borderWidth="thick">
                            <DashboardCampaigns orgId={ orgId }/>
                        </View>
                        <View borderWidth="thick">
                            <DashboardPeople orgId={ orgId }/>
                        </View>
                        <View borderWidth="thick">Areas</View>
                    </View>
                    <View borderColor="celery-400" borderWidth="thick" height="size-1200" width="50%">Inbox</View>
                </Flex>
            </View>
        </>
    );
};

OrganizePage.getLayout = function getLayout(page) {
    return (
        <div>
            { page }
        </div>
    );
};

export default OrganizePage;
