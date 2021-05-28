import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { useQuery } from 'react-query';
import {
    Flex,
    Grid,
    Heading,
    repeat,
    Text,
    View,
} from '@adobe/react-spectrum';

import EventTabs from '../../components/EventTabs';
import getEventsFromFollowedOrgs from '../../fetching/getEventsFromFollowedOrgs';
import getUserCampaigns from '../../fetching/getUserCampaigns';
import MyHomeLayout from '../../components/layout/MyHomeLayout';
import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';
import { useEventResponses } from '../../hooks';
import { ZetkinUser } from '../../types/zetkin';

const scaffoldOptions = {
    authLevelRequired: 1,
    localeScope: [
        'layout.my',
        'misc.eventList',
        'misc.eventResponseButton',
        'misc.eventTabs',
        'misc.publicHeader',
        'pages.my',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const { user } = context;

    if (user) {
        await context.queryClient.prefetchQuery('eventsFromFollowedOrgs', getEventsFromFollowedOrgs(context.apiFetch));
        await context.queryClient.prefetchQuery('userCampaigns', getUserCampaigns(context.apiFetch));

        return {
            props: {},
        };
    }
    else {
        return {
            notFound: true,
        };
    }
}, scaffoldOptions);

interface MyPageProps {
    user: ZetkinUser;
}

const MyPage : PageWithLayout<MyPageProps> = (props) => {
    const { user } = props;

    const userCampaignsQuery = useQuery('userCampaigns', getUserCampaigns());
    const eventsFromFollowedOrgsQuery = useQuery('eventsFromFollowedOrgs', getEventsFromFollowedOrgs());

    const eventsFromFollowedOrgs = eventsFromFollowedOrgsQuery.data;

    const { onSignup, onUndoSignup } = useEventResponses('eventsFromFollowedOrgs');

    if (!eventsFromFollowedOrgs || eventsFromFollowedOrgs.length === 0) {
        return (
            <>
                <Heading level={ 1 }>
                    <Msg id="pages.my.welcome" values={{ userName: user.first_name }}/>
                </Heading>
                <Text>
                    <Msg id="pages.my.placeholder"/>
                </Text>
            </>
        );
    }

    return (
        <View marginBottom="size-1000" marginX="5vw">
            <Heading level={ 1 }>
                <Msg id="pages.my.welcome" values={{ userName: user.first_name }}/>
            </Heading>
            <Heading level={ 2 } marginBottom="0" marginTop="size-600">
                <Msg id="pages.my.events"/>
            </Heading>
            <EventTabs
                events={ eventsFromFollowedOrgs }
                onSignup={ onSignup }
                onUndoSignup={ onUndoSignup }
            />
            <Heading level={ 2 } marginTop="size-300">
                <Msg id="pages.my.campaigns"/>
            </Heading>
            { userCampaignsQuery.data &&
                <Grid
                    autoRows="size-1200"
                    columns={ repeat('auto-fit', 'size-3600') }
                    gap="size-100">
                    { userCampaignsQuery.data.map(campaign => (
                        <View key={ campaign.id } data-testid="campaign-link">
                            <NextLink
                                href={ `/o/${campaign.organization?.id}/campaigns/${campaign.id}` }>
                                <a>
                                    <View backgroundColor="gray-300" height="100%">
                                        <Flex alignItems="center" height="100%" justifyContent="center">
                                            <Heading level={ 3 }>
                                                { campaign.title }
                                            </Heading>
                                        </Flex>
                                    </View>
                                </a>
                            </NextLink>
                        </View>
                    )) }
                </Grid>
            }
        </View>
    );
};

MyPage.getLayout = function getLayout(page) {
    return (
        <MyHomeLayout>
            { page }
        </MyHomeLayout>
    );
};

export default MyPage;
