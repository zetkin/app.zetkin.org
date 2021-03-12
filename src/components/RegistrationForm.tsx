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

    const inputFieldFirstName = <Msg id="components.registrationForm.input_field_first_name"/>;
    const inputFieldLastName = <Msg id="components.registrationForm.input_field_last_name"/>;
    const inputFieldEmail = <Msg id="components.registrationForm.input_field_email"/>;
    const inputFieldPhone = <Msg id="components.registrationForm.input_field_phone"/>;
    const inputFieldPassword = <Msg id="components.registrationForm.input_field_password"/>;

    const messageToString = useIntl().formatMessage;

    return (
        <Flex>
            <Form data-test="reg-form" onSubmit={ onSubmit }>
                <TextField
                    data-test="first-name"
                    label={ inputFieldFirstName }
                    onChange={ setFirstName }
                    placeholder={
                        messageToString({ id: inputFieldFirstName.props.id })
                    }
                    type="text"
                    value={ firstName }
                />
                <TextField
                    data-test="last-name"
                    label={ inputFieldLastName }
                    onChange={ setLastName }
                    placeholder={
                        messageToString({ id: inputFieldLastName.props.id })
                    }
                    type="text"
                    value={ lastName }
                />
                <TextField
                    data-test="email-address"
                    label={ inputFieldEmail }
                    onChange={ setEmail }
                    placeholder={
                        messageToString({ id: inputFieldEmail.props.id })
                    }
                    type="email" 
                    value={ email }
                />
                <TextField
                    data-test="phone-number"
                    label={ inputFieldPhone }
                    onChange={ setPhone }
                    placeholder={
                        messageToString({ id: inputFieldPhone.props.id })
                    }
                    type="tel"
                    value={ phone }
                />
                <TextField
                    data-test="password"
                    label={ inputFieldPassword }
                    onChange={ setPassword }
                    placeholder={
                        messageToString({ id: inputFieldPassword.props.id })
                    }
                    type="password"
                    value={ password }
                />
                <Button
                    data-test="submit-button"
                    type="submit"
                    variant="cta">
                    <Msg id="components.registrationForm.submit_button"/>
                </Button>
            </Form>
        </Flex>
    );
};

export default RegistrationForm;