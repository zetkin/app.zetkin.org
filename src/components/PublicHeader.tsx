import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import {
    Button,
    Flex,
    Header,
    Image,
    Text,
    View,
} from '@adobe/react-spectrum';

import apiUrl from '../utils/apiUrl';
import { ZetkinMembership, ZetkinOrganization, ZetkinUser } from '../types/zetkin';

interface PublicHeaderProps {
    user: ZetkinUser | null;
    org?: ZetkinOrganization | null;
    canOrganize?: boolean;
    officials: ZetkinMembership[];
}

const PublicHeader = ({ canOrganize, user, org, officials: memberships  } : PublicHeaderProps) : JSX.Element => {

    return (
        <Header margin="size-200">
            <Flex
                alignItems="center"
                direction="row"
                height="size-600"
                justifyContent="space-between">
                { org ? (
                    <NextLink href={ `/o/${org.id}` }>
                        <a>
                            <Image
                                alt="Organization avatar"
                                data-testid="org-avatar"
                                height="size-600"
                                objectFit="contain"
                                src={ apiUrl(`/orgs/${org.id}/avatar`) }
                                width="size-600"
                            />
                        </a>
                    </NextLink>
                ) : (
                    <Image
                        alt="Zetkin logo"
                        data-testid="zetkin-logotype"
                        height="size-600"
                        objectFit="contain"
                        src="/logo-zetkin.png"
                        width="size-600"
                    />
                ) }
                { user ? (
                    <Flex>
                        <View>
                            <NextLink href="/my">
                                <a>
                                    <Text data-testid="username">
                                        { user.first_name } { user.last_name }
                                    </Text>
                                    <Image
                                        alt="User avatar"
                                        data-testid="user-avatar"
                                        height="size-600"
                                        objectFit="contain"
                                        src={ `/api/users/${ user.id }/avatar` }
                                        width="size-600"
                                    />
                                </a>
                            </NextLink>
                        </View>
                        <>
                            { canOrganize && (
                                <NextLink href={ `/organize/${memberships[0].organization.id}` }>
                                    <a data-testid="organize-link">
                                        <Button data-testid="organize-button" variant="cta">
                                            <Msg id="misc.publicHeader.organize"/>
                                        </Button>
                                    </a>
                                </NextLink>)
                            }
                        </>
                        <NextLink href="/logout">
                            <Button data-testid="logout-button" variant="cta">
                                <Msg id="misc.publicHeader.logout"/>
                            </Button>
                        </NextLink>
                    </Flex>
                ) : (
                    <NextLink href="/login">
                        <Button data-testid="login-button" variant="cta">
                            <Msg id="misc.publicHeader.login"/>
                        </Button>
                    </NextLink>
                ) }
            </Flex>
        </Header>
    );
};

export default PublicHeader;
