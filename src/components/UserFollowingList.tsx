import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { Button, Flex, Image, Text } from '@adobe/react-spectrum';

import apiUrl from '../utils/apiUrl';
import { ZetkinMembership } from '../types/zetkin';


interface UserFollowingListProps {
    following: ZetkinMembership[] | undefined;
    onUnfollow: (orgId : number) => void;
}

const UserFollowingList = ({ following, onUnfollow } : UserFollowingListProps) : JSX.Element => {

    if (!following || following.length === 0) {
        return (
            <Text data-testid="no-orgs-placeholder">
                <Msg id="pages.myOrgs.orgsPlaceholder"/>
            </Text>
        );
    }

    return (
        <Flex data-testid="following-list" direction="column">
            { following.map(follow => (
                <Flex
                    key="follow.organization.id"
                    alignItems="center"
                    marginY="size-200">
                    <Flex data-testid="following-item">
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
                                    <Text data-testid="org-title" marginX="size-200">{ follow.organization.title }</Text>
                                </a>
                            </NextLink>
                            { follow.role
                                ? (
                                    <Text data-testid="user-role" marginX="size-200">
                                        <Msg id={ `pages.myOrgs.${follow.role}` }/>
                                    </Text>
                                ) : (
                                    <Text marginX="size-200">
                                        <Msg id="pages.myOrgs.rolePlaceholder"/>
                                    </Text>
                                )
                            }
                        </Flex>
                    </Flex>
                    <Button
                        isQuiet
                        onPress={ () => onUnfollow(follow.organization.id) }
                        variant="negative">
                        <Msg id="pages.myOrgs.unfollow"/>
                    </Button>
                </Flex>
            )) }
        </Flex>
    );
};

export default UserFollowingList;