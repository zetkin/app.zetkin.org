import {
    Button,
    Flex,
    Header,
    Image,
    Text,
    View,
} from '@adobe/react-spectrum';

import { ZetkinUser } from '../interfaces/ZetkinUser';

interface PublicHeaderProps {
    user: ZetkinUser | null;
}

const PublicHeader = ({ user } : PublicHeaderProps) : JSX.Element => {
    return (
        <Header margin="size-200">
            <Flex
                alignItems="center"
                direction="row"
                height="size-600"
                justifyContent="space-between">
                <Image
                    alt="Zetkin logo"
                    data-test="zetkin-logotype"
                    height="size-600"
                    objectFit="contain"
                    src="/logo-zetkin.png"
                />
                { user ?
                    <View>
                        <Text>{ user.first_name } { user.last_name }</Text>
                        <Image
                            alt="User avatar"
                            data-test="user-avatar"
                            src={ `/api/users/${user.id}/avatar` }
                        />
                    </View>
                    : <Button data-test="login-button" variant="cta">Login</Button>
                }
            </Flex>
        </Header>
    );
};

export default PublicHeader;