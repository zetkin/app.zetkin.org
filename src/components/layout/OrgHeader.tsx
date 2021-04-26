import { FormattedMessage as Msg } from 'react-intl';
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

import { ZetkinOrganization } from '../../types/zetkin';

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
                    <Button data-testid="unfollow-button" variant="cta">
                        <Msg id="layout.org.actions.unfollow"/>
                    </Button>
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