import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { Button, Flex, Heading, Image, Text } from '@adobe/react-spectrum';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import apiUrl from '../../utils/apiUrl';
import deleteUserFollowing from '../../fetching/deleteUserFollowing';
import getUserFollowing from '../../fetching/getUserFollowing';
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

    let followingState;

    if (user) {
        await context.queryClient.prefetchQuery('following', getUserFollowing(context.apiFetch));

        followingState = context.queryClient.getQueryState('following');
    }

    if (followingState?.status === 'success') {
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
    const followingQuery = useQuery('following', getUserFollowing());
    const following = followingQuery.data;

    const queryClient = useQueryClient();

    const removeFunc = useMutation(deleteUserFollowing, {
        onSettled: () => {
            queryClient.invalidateQueries('following');
        },
    });

    function onDisconnect (orgId : number) {
        removeFunc.mutate(orgId);
    }

    if (!following || following.length === 0) {
        return (
            <>
                <Heading level={ 1 }>
                    <Msg id="pages.myOrgs.heading"/>
                </Heading>
                <Text data-testid="no-orgs-placeholder">
                    <Msg id="pages.myOrgs.orgsPlaceholder"/>
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
                { following.map(follow => (
                    <Flex
                        key="follow.profile.id"
                        alignItems="center"
                        marginY="size-200">
                        <Flex>
                            <Image
                                alt="Organization avatar"
                                data-testid="org-avatar"
                                height="size-600"
                                objectFit="contain"
                                src={ apiUrl(`/orgs/${follow.organization.id}/avatar`) }
                                width="size-600"
                            />
                            <Flex direction="column">
                                <NextLink href={ `/o/${follow.organization.id}` }>
                                    <a>
                                        <Text marginX="size-200">{ follow.organization.title }</Text>
                                    </a>
                                </NextLink>
                                { follow.role
                                    ? <Text marginX="size-200">{ follow.role }</Text>
                                    : (
                                        <Text marginX="size-200">
                                            <Msg id="pages.myOrgs.rolePlaceholder"/>
                                        </Text>
                                    )
                                }
                            </Flex>
                        </Flex>
                        <Button
                            isQuiet
                            onPress={ () => onDisconnect(follow.organization.id) }
                            variant="negative">
                            <Msg id="pages.myOrgs.disconnect"/>
                        </Button>
                    </Flex>
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