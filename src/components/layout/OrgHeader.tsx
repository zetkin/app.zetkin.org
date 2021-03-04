import NextLink from 'next/link';
import {
    Button,
    Flex,
    Header,
    Heading,
    Image,
    Link,
    View,
} from '@adobe/react-spectrum';

import apiUrl from '../../utils/apiUrl';
import { ZetkinOrganization } from '../../interfaces/ZetkinOrganization';

interface OrgHeaderProps {
    org: ZetkinOrganization;
}

const OrgHeader = ({ org } : OrgHeaderProps) : JSX.Element => {
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
                <Image
                    alt="Organization avatar"
                    height="size-600"
                    objectFit="contain"
                    src={ apiUrl(`/orgs/${org.id}/avatar`) }
                    width="size-600"
                />
                <Flex
                    alignItems="center"
                    direction="row">
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