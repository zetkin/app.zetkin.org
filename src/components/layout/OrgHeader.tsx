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
                alt="Cover image"
                objectFit="cover"
                src="/cover.jpg"
                width="100%"
            />
            <Flex
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                marginX="size-200">
                <Image
                    alt="Organization avatar"
                    height="size-800"
                    objectFit="cover"
                    src={ `https://api.zetk.in/v1/orgs/${org.id}/avatar` }

                />
                <Flex
                    alignItems="center"
                    direction="row"
                    marginX="size-200">
                    <View marginX="size-200">
                        <Link>
                            <NextLink href="/">
                                <a>Edit Page</a>
                            </NextLink>
                        </Link>
                    </View>
                    <Button data-test="unfollow-button" variant="cta">Unfollow</Button>
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