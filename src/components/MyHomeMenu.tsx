import { FunctionComponent } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { Button, Flex, Footer } from '@adobe/react-spectrum';

const MyHomeMenu : FunctionComponent = () => {
    return (
        <Footer
            bottom={ 0 }
            left={ 0 }
            position="absolute"
            right={ 0 }>
            <Flex justifyContent="center">
                <NextLink href="/my">
                    <Button data-test="feed-button" margin="size-200" variant="cta">
                        <Msg id="layout.my.tabs.feed"/>
                    </Button>
                </NextLink>
                <NextLink href="/my/todo">
                    <Button data-test="todo-button" margin="size-200" variant="cta">
                        <Msg id="layout.my.tabs.todo"/>
                    </Button>
                </NextLink>
                <NextLink href="/my/orgs">
                    <Button data-test="orgs-button" margin="size-200" variant="cta">
                        <Msg id="layout.my.tabs.orgs"/>
                    </Button>
                </NextLink>
                <NextLink href="/my/settings">
                    <Button data-test="settings-button" margin="size-200" variant="cta">
                        <Msg id="layout.my.tabs.settings"/>
                    </Button>
                </NextLink>
            </Flex>
        </Footer>
    );
};

export default MyHomeMenu;