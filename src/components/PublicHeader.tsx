import {
    Button,
    Flex,
    Header,
    Image,
    Text,
    View
} from '@adobe/react-spectrum';

interface PublicHeaderProps {
    user: {
        first_name: string;
        id: number;
        last_name: string;
    }
}

const PublicHeader = ({ user } : PublicHeaderProps) : JSX.Element => {
    return (
        <Header>
            <Flex
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                height='size-600'>
                <Image
                    src='/logo-zetkin.png'
                    alt='Zetkin logo'
                    data-test='zetkin-logotype'
                    objectFit='contain'
                    height='size-600'
                />
                { !user ? <Button variant='cta' data-test='login-button'>Login</Button> : null }
                { user ?
                    <View>
                        <Text>{ user.first_name } { user.last_name }</Text>
                        <Image
                            src={ `/api/users/${user.id}/avatar` }
                            alt='User avatar'
                            data-test='user-avatar'
                        />
                    </View>
                    : null }
            </Flex>
        </Header>
    );
};

export default PublicHeader;