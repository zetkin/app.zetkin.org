import NextLink from 'next/link';
import {
    Button,
    Flex,
    Header,
    Heading,
    Image,
    Link,
    View
} from '@adobe/react-spectrum';

interface OrgHeaderProps {
    org: {
        id: number;
        title: string
    }
}

const OrgHeader = ({ org } : OrgHeaderProps) : JSX.Element => {
    return (
        <Header>
            <Image
                src="/cover.jpg"
                alt="Cover image"
                objectFit="cover"
                width="100%"
            />
            <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                marginX="size-200">
                <Image
                    src={ `https://api.zetk.in/v1/orgs/${org.id}/avatar` }
                    alt="Organization avatar"
                    objectFit="cover"
                    height="size-800"
                />
                <Flex
                    direction="row"
                    alignItems="center"
                    marginX="size-200">
                    <View marginX="size-200">
                        <Link>
                            <NextLink href="/">
                                <a>Edit Page</a>
                            </NextLink>
                        </Link>
                    </View>
                    <Button variant="cta" data-test="unfollow-button">Unfollow</Button>
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