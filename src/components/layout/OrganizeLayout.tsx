import { FunctionComponent } from 'react';
import { Flex, View } from '@adobe/react-spectrum';

import BreadcrumbTrail from '../BreadcrumbTrail';
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
            <View backgroundColor="gray-200" width="100%">
                <View backgroundColor="gray-100" margin={ 0 }>
                    <Flex justifyContent="space-between">
                        <View width="100%">
                            <BreadcrumbTrail/>
                        </View>
                        <View backgroundColor="gray-500">
                            search drawer goes here
                        </View>
                    </Flex>
                </View>              
                <View>
                    { children as JSX.Element }
                </View>
            </View>
        </Flex>
    );
};

export default OrganizeLayout;