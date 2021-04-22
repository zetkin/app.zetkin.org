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
import { ZetkinOrganization } from '../interfaces/ZetkinOrganization';
import { ZetkinUser } from '../interfaces/ZetkinUser';

interface PublicHeaderProps {
    user: ZetkinUser | null;
    org?: ZetkinOrganization | null;
    canOrganize?: boolean;
}

const PublicHeader = ({ canOrganize, user, org  } : PublicHeaderProps) : JSX.Element => {
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
                                data-test="org-avatar"
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
                        data-test="zetkin-logotype"
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
                                    <Text data-test="username">
                                        { user.first_name } { user.last_name }
                                    </Text>
                                    <Image
                                        alt="User avatar"
                                        data-test="user-avatar"
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
                                <NextLink href="https://organize.zetk.in">
                                    <Button data-test="organize-button" variant="cta">
                                        <Msg id="misc.publicHeader.organize"/>
                                    </Button>
                                </NextLink>)
                            }
                        </>
                        <NextLink href="/logout">
                            <Button data-test="logout-button" variant="cta">
                                <Msg id="misc.publicHeader.logout"/>
                            </Button>
                        </NextLink>
                    </Flex>
                ) : (
                    <NextLink href="/login">
                        <Button data-test="login-button" variant="cta">
                            <Msg id="misc.publicHeader.login"/>
                        </Button>
                    </NextLink>
                ) }
            </Flex>
        </Header>
    );
};

export default PublicHeader;
