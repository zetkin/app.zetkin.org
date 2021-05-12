import { FunctionComponent } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { Button, Flex, View } from '@adobe/react-spectrum';

const MyHomeMenu : FunctionComponent = () => {
    return (
        <View
            backgroundColor="gray-100"
            bottom={ 0 }
            left={ 0 }
            position="fixed"
            right={ 0 }>
            <Flex
                justifyContent="center">
                <NextLink href="/my">
                    <Button data-testid="feed-button" isQuiet margin="size-200" variant="primary">
                        <Msg id="layout.my.tabs.feed"/>
                    </Button>
                </NextLink>
                <NextLink href="/my/todo">
                    <Button data-testid="todo-button" isQuiet margin="size-200" variant="primary">
                        <Msg id="layout.my.tabs.todo"/>
                    </Button>
                </NextLink>
                <NextLink href="/my/orgs">
                    <Button data-testid="orgs-button" isQuiet margin="size-200" variant="primary">
                        <Msg id="layout.my.tabs.orgs"/>
                    </Button>
                </NextLink>
                <NextLink href="/my/settings">
                    <Button data-testid="settings-button" isQuiet margin="size-200" variant="primary">
                        <Msg id="layout.my.tabs.settings"/>
                    </Button>
                </NextLink>
            </Flex>
        </View>
    );
};

export default MyHomeMenu;