import { Flex } from '@adobe/react-spectrum';
import { FunctionComponent } from 'react';

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
            { children as JSX.Element }
        </Flex>
    );
};

export default DefaultLayout;