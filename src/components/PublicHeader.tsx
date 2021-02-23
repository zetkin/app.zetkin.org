import {
    Button,
    Flex,
    Header,
    Image,
    Text,
    View,
} from '@adobe/react-spectrum';

interface PublicHeaderProps {
    user: {
        first_name: string;
        id: number;
        last_name: string;
    };
}

const PublicHeader = ({ user } : PublicHeaderProps) : JSX.Element => {
    return (
        <Header>
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
                { !user ? <Button data-test="login-button" variant="cta">Login</Button> : null }
                { user ?
                    <View>
                        <Text>{ user.first_name } { user.last_name }</Text>
                        <Image
                            alt="User avatar"
                            data-test="user-avatar"
                            src={ `/api/users/${user.id}/avatar` }
                        />
                    </View>
                    : null }
            </Flex>
        </Header>
    );
};

export default PublicHeader;