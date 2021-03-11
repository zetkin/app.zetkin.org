import { FunctionComponent } from 'react';
import { Content, Flex } from '@adobe/react-spectrum';

import PublicHeader from '../PublicHeader';
import { useUser } from '../../hooks';
import { ZetkinOrganization } from '../../interfaces/ZetkinOrganization';

interface DefaultLayoutProps {
    org?: ZetkinOrganization;
}

const DefaultLayout : FunctionComponent<DefaultLayoutProps> = ({ children, org }) => {
    const user = useUser();

    return (
        <Flex
            direction="column"
            gap="size-100">
            <PublicHeader org={ org } user={ user }/>
            <Content margin="size-200">
                { children }
            </Content>
        </Flex>
    );
};

export default DefaultLayout;