import {
    Button,
    Flex,
    Form, 
    TextField
} from '@adobe/react-spectrum';

const RegForm = () : JSX.Element => {

    return (
        <Flex>
            <Form>
                <TextField
                    label='First name'
                    placeholder='First name'
                    type='text'
                    data-test='first-name'
                />
                <TextField
                    label='Last name'
                    placeholder='Last name'
                    type='text'
                    data-test='last-name'
                />
                <TextField
                    label='E-mail'
                    placeholder='E-mail'
                    type='email' 
                    data-test='email-address'
                />
                <TextField 
                    label='Phone number'
                    placeholder='Phone number'
                    type='tel'
                    data-test='phone-number'
                />
                <TextField 
                    label='Password'
                    placeholder='Password'
                    type='password'
                    data-test='password'
                />
                <Button
                    variant="cta"
                    data-test='submit-button'>
                    Submit
                </Button>
            </Form>
        </Flex>
    );
};

export default RegForm;