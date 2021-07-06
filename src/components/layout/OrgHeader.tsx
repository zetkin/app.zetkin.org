import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { useContext } from 'react';
import {
    Button,
    Flex,
    Header,
    Heading,
    Image,
    Link,
    View,
} from '@adobe/react-spectrum';

import UserContext from '../../contexts/UserContext';
import { ZetkinMembership, ZetkinOrganization } from '../../types/zetkin';

interface OrgHeaderProps {
    following: ZetkinMembership[] | undefined;
    onFollow: (orgId: number) => void;
    onUnfollow: (orgId: number) => void;
    org: ZetkinOrganization;
}

const OrgHeader = ({ following, onFollow, onUnfollow, org } : OrgHeaderProps) : JSX.Element => {
    const follows = following?.some(follow => follow.organization.id === org.id);
    const user = useContext(UserContext);

    return (
        <Header>
            <Image
                alt="Cover image"
                height="size-2000"
                objectFit="cover"
                src="/cover.jpg"
                width="100%"
            />
            <Flex
                alignItems="center"
                direction="row"
                justifyContent="space-between">
                <Flex
                    alignItems="center"
                    direction="row">
                    <View marginX="size-200">
                        <Link>
                            <NextLink href="/">
                                <a><Msg id="layout.org.actions.edit"/></a>
                            </NextLink>
                        </Link>
                    </View>
                    { user ? (
                        follows ? (
                            <Button
                                data-testid="unfollow-button"
                                onPress={ () => onUnfollow(org.id) }
                                variant="cta">
                                <Msg id="layout.org.actions.unfollow"/>
                            </Button>
                        ) : (
                            <Button
                                data-testid="follow-button"
                                onPress={ () => onFollow(org.id) }
                                variant="cta">
                                <Msg id="layout.org.actions.follow"/>
                            </Button>
                        )
                    //TODO: Create button alternative for non-users
                    ) : <></> }
                </Flex>
            </Flex>
            <View>
                <Heading level={ 1 }>
                    { org.title }
                </Heading>
            </View>
        </Header>
    );
};

export default OrgHeader;
