import { FunctionComponent } from 'react';
import PublicHeader from '../components/PublicHeader';

import { Content, Flex } from '@adobe/react-spectrum';

const DefaultLayout : FunctionComponent = ({ children }) => (
    <Flex
        direction='column'
        gap='size-100'
        margin='size-200'>
        <PublicHeader user={ null }/>
        <Content>
            { children }
        </Content>
    </Flex>
);

export default DefaultLayout;