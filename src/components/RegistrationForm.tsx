import React from 'react';
import {
    Button,
    Flex,
    Form, 
    TextField
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
    }
}

const RegistrationForm = ({ onValidSubmit } : RegistrationFormProps) : JSX.Element => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onSubmit = (ev) : void => {
        onValidSubmit({
            email: email,
            first_name: firstName,
            last_name: lastName,
            password: password,
            phone: phone
        });

        ev.preventDefault();
    };

    return (
        <Flex>
            <Form data-test='reg-form' onSubmit={ onSubmit }>
                <TextField
                    label='First name'
                    placeholder='First name'
                    type='text'
                    value={ firstName }
                    onChange={ setFirstName }
                    data-test='first-name'
                />
                <TextField
                    label='Last name'
                    placeholder='Last name'
                    type='text'
                    value={ lastName }
                    onChange={ setLastName }
                    data-test='last-name'
                />
                <TextField
                    label='E-mail'
                    placeholder='E-mail'
                    type='email' 
                    value={ email }
                    onChange={ setEmail }
                    data-test='email-address'
                />
                <TextField 
                    label='Phone number'
                    placeholder='Phone number'
                    type='tel'
                    value={ phone }
                    onChange={ setPhone }
                    data-test='phone-number'
                />
                <TextField 
                    label='Password'
                    placeholder='Password'
                    type='password'
                    value={ password }
                    onChange={ setPassword }
                    data-test='password'
                />
                <Button
                    variant="cta"
                    type='submit'
                    data-test='submit-button'>
                    Submit
                </Button>
            </Form>
        </Flex>
    );
};

export default RegistrationForm;