import React from 'react';
import {
    Button,
    Flex,
    Form, 
    TextField,
} from '@adobe/react-spectrum';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

interface RegistrationFormUserData {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone: string;
}

interface RegistrationFormProps {
    onValidSubmit: {
        (user : RegistrationFormUserData) : void;
    };
}

const RegistrationForm = ({ onValidSubmit } : RegistrationFormProps) : JSX.Element => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onSubmit = (ev: React.ChangeEvent<HTMLInputElement>) : void => {
        onValidSubmit({
            email: email,
            first_name: firstName,
            last_name: lastName,
            password: password,
            phone: phone,
        });

        ev.preventDefault();
    };

    const field1 = <Msg id="forms.reg.fields.firstName"/>;
    const field2 = <Msg id="forms.reg.fields.lastName"/>;
    const field3 = <Msg id="forms.reg.fields.email"/>;
    const field4 = <Msg id="forms.reg.fields.phone"/>;
    const field5 = <Msg id="forms.reg.fields.password"/>;

    const messageToString = useIntl().formatMessage;

    return (
        <Flex>
            <Form data-test="reg-form" onSubmit={ onSubmit }>
                <TextField
                    data-test="first-name"
                    label={ field1 }
                    onChange={ setFirstName }
                    placeholder={
                        messageToString({ id: field1.props.id })
                    }
                    type="text"
                    value={ firstName }
                />
                <TextField
                    data-test="last-name"
                    label={ field2 }
                    onChange={ setLastName }
                    placeholder={
                        messageToString({ id: field2.props.id })
                    }
                    type="text"
                    value={ lastName }
                />
                <TextField
                    data-test="email-address"
                    label={ field3 }
                    onChange={ setEmail }
                    placeholder={
                        messageToString({ id: field3.props.id })
                    }
                    type="email" 
                    value={ email }
                />
                <TextField
                    data-test="phone-number"
                    label={ field4 }
                    onChange={ setPhone }
                    placeholder={
                        messageToString({ id: field4.props.id })
                    }
                    type="tel"
                    value={ phone }
                />
                <TextField
                    data-test="password"
                    label={ field5 }
                    onChange={ setPassword }
                    placeholder={
                        messageToString({ id: field5.props.id })
                    }
                    type="password"
                    value={ password }
                />
                <Button
                    data-test="submit-button"
                    type="submit"
                    variant="cta">
                    <Msg id="forms.reg.submitButton"/>
                </Button>
            </Form>
        </Flex>
    );
};

export default RegistrationForm;