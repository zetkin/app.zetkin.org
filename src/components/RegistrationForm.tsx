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
    const intl = useIntl();

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

    const msg = (prop : string) => intl.formatMessage({ id: 'forms.reg.fields.' + prop });

    return (
        <Flex>
            <Form data-test="reg-form" onSubmit={ onSubmit }>
                <TextField
                    data-test="first-name"
                    label={ msg('firstName') }
                    onChange={ setFirstName }
                    placeholder={ msg('firstName') }
                    type="text"
                    value={ firstName }
                />
                <TextField
                    data-test="last-name"
                    label={ msg('lastName') }
                    onChange={ setLastName }
                    placeholder={ msg('lastName')  }
                    type="text"
                    value={ lastName }
                />
                <TextField
                    data-test="email-address"
                    label={ msg('email') }
                    onChange={ setEmail }
                    placeholder={ msg('email') }
                    type="email"
                    value={ email }
                />
                <TextField
                    data-test="phone-number"
                    label={ msg('phone') }
                    onChange={ setPhone }
                    placeholder={ msg('phone') }
                    type="tel"
                    value={ phone }
                />
                <TextField
                    data-test="password"
                    label={ msg('password') }
                    onChange={ setPassword }
                    placeholder={ msg('password') }
                    type="password"
                    value={ password }
                />
                <Button
                    data-test="submit-button"
                    type="submit"
                    variant="cta">
                    <Msg id="forms.reg.actions.submit"/>
                </Button>
            </Form>
        </Flex>
    );
};

export default RegistrationForm;