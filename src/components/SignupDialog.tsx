import {
    FormattedMessage as Msg,
} from 'react-intl';
import NextLink from 'next/link';
import {
    Button,
    ButtonGroup,
    Content,
    Dialog,
    DialogTrigger,
    Divider,
    Flex, Heading, Text,
} from '@adobe/react-spectrum';


const SignupDialogTrigger = (): JSX.Element => {
    return (
        <DialogTrigger>
            <Button data-test="dialog-trigger-button" variant="cta" width="100%">
                <Msg id="pages.orgEvent.actions.signup" />
            </Button>
            { (close) => (
                <Dialog size="L">
                    <Heading>
                        <Msg id="misc.signupDialog.heading" />
                    </Heading>
                    <Divider />
                    <Content>
                        <Content marginBottom="size-400">
                            <Msg id="misc.signupDialog.cta"/>
                        </Content>
                        <Flex gap="size-125" width="100%">
                            <Flex direction="column" justifyContent="space-between" width="50%">
                                <Text marginBottom="size-400">
                                    <Msg id="misc.signupDialog.registerCopy"/>
                                </Text>
                                <NextLink href="/register">
                                    <Button data-test="register-button" onPress={ close } variant="cta">
                                        <Msg id="misc.signupDialog.actions.register" />
                                    </Button>
                                </NextLink>
                            </Flex>
                            <Divider orientation="vertical" size="M" />
                            <Flex direction="column" justifyContent="space-between" width="50%">
                                <Text marginBottom="size-400">
                                    <Msg id="misc.signupDialog.loginCopy"/>
                                </Text>
                                <NextLink href="/login">
                                    <Button data-test="login-button" onPress={ close } variant="cta">
                                        <Msg id="misc.signupDialog.actions.login" />
                                    </Button>
                                </NextLink>
                            </Flex>
                        </Flex>
                    </Content>
                    <ButtonGroup>
                        <Button aria-label="close" data-test="close-button" onPress={ close } variant="negative">
                            <Msg id="misc.signupDialog.actions.cancel" />
                        </Button>
                    </ButtonGroup>
                </Dialog>
            ) }
        </DialogTrigger>
    );
};

export default SignupDialogTrigger;
