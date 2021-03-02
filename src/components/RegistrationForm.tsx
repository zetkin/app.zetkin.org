import React from 'react';
import {
    Button,
    Flex,
    Form, 
    TextField,
} from '@adobe/react-spectrum';

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

    return (
        <Flex>
            <Form data-test="reg-form" onSubmit={ onSubmit }>
                <TextField
                    data-test="first-name"
                    label="First name"
                    onChange={ setFirstName }
                    placeholder="First name"
                    type="text"
                    value={ firstName }
                />
                <TextField
                    data-test="last-name"
                    label="Last name"
                    onChange={ setLastName }
                    placeholder="Last name"
                    type="text"
                    value={ lastName }
                />
                <TextField
                    data-test="email-address"
                    label="E-mail"
                    onChange={ setEmail }
                    placeholder="E-mail"
                    type="email" 
                    value={ email }
                />
                <TextField
                    data-test="phone-number"
                    label="Phone number"
                    onChange={ setPhone }
                    placeholder="Phone number"
                    type="tel"
                    value={ phone }
                />
                <TextField
                    data-test="password"
                    label="Password"
                    onChange={ setPassword }
                    placeholder="Password"
                    type="password"
                    value={ password }
                />
                <Button
                    data-test="submit-button"
                    type="submit"
                    variant="cta">
                    Submit
                </Button>
            </Form>
        </Flex>
    );
};

export default RegistrationForm;