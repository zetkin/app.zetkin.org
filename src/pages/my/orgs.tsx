import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { useQuery } from 'react-query';
import { Flex, Heading, Image, Text } from '@adobe/react-spectrum';

import apiUrl from '../../utils/apiUrl';
import getUserMemberships from '../../fetching/getUserMemberships';
import MyHomeLayout from '../../components/layout/MyHomeLayout';
import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';


const scaffoldOptions = {
    authLevelRequired: 1,
    localeScope: [
        'layout.my',
        'misc.publicHeader',
        'pages.myOrgs',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const { user } = context;

    let membershipsState;

    if (user) {
        await context.queryClient.prefetchQuery('memberships', getUserMemberships(context.apiFetch));

        membershipsState = context.queryClient.getQueryState('memberships');
    }

    if (membershipsState?.status === 'success') {
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

const MyOrgsPage : PageWithLayout = () => {
    const membershipsQuery = useQuery('memberships', getUserMemberships());
    const memberships = membershipsQuery.data;

    if (!memberships || memberships.length === 0) {
        return (
            <>
                <Heading level={ 1 }>
                    <Msg id="pages.myOrgs.heading"/>
                </Heading>
                <Text data-testid="no-orgs-placeholder">
                    You are not connected to any organizations yet.
                </Text>
            </>
        );
    }

    return (
        <>
            <Heading level={ 1 }>
                <Msg id="pages.myOrgs.heading"/>
            </Heading>
            <Flex direction="column">
                { memberships.map(membership => (
                    <NextLink key="membership.profile.id" href={ `/o/${membership.organization.id}` }>
                        <a>
                            <Flex alignItems="center" marginY="size-200">
                                <Image
                                    alt="Organization avatar"
                                    data-testid="org-avatar"
                                    height="size-600"
                                    objectFit="contain"
                                    src={ apiUrl(`/orgs/${membership.organization.id}/avatar`) }
                                    width="size-600"
                                />
                                <Flex direction="column">
                                    <Text marginX="size-200">{ membership.organization.title }</Text>
                                    { membership.role
                                        ? <Text marginX="size-200">{ membership.role }</Text>
                                        : <Text marginX="size-200">You do not have a role yet</Text>
                                    }
                                </Flex>
                            </Flex>
                        </a>
                    </NextLink>
                )) }
            </Flex>
        </>
    );
};

MyOrgsPage.getLayout = function getLayout(page) {
    return (
        <MyHomeLayout>
            { page }
        </MyHomeLayout>
    );
};

export default MyOrgsPage;