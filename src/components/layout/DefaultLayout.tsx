import { FunctionComponent } from 'react';
import { Content, Flex } from '@adobe/react-spectrum';

import PublicHeader from '../PublicHeader';
import { useUser } from '../../hooks';

const DefaultLayout : FunctionComponent = ({ children }) => {
    const user = useUser();

    return (
        <Flex
            direction="column"
            gap="size-100"
            margin="size-200">
            <PublicHeader user={ user }/>
            <Content>
                { children }
            </Content>
        </Flex>
    );
};

export default DefaultLayout;