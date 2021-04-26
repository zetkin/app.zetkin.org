import { FunctionComponent } from 'react';
import { Flex, View } from '@adobe/react-spectrum';

import OrganizeSidebar from '../OrganizeSidebar';

interface OrganizeLayoutProps {
    orgId: string;
}

const OrganizeLayout : FunctionComponent<OrganizeLayoutProps> = ({ children, orgId }) => {
    return (
        <Flex>        
            <View backgroundColor="gray-600" height="100vh">
                <OrganizeSidebar orgId={ orgId }  />
            </View>    
            <View>
                { children as JSX.Element }
            </View>
        </Flex>
    );
};

export default OrganizeLayout;