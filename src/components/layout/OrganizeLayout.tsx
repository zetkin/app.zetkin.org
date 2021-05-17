import { FunctionComponent } from 'react';
import { Flex, View } from '@adobe/react-spectrum';

import BreadcrumbTrail from '../BreadcrumbTrail';
import OrganizeSidebar from '../OrganizeSidebar';
import SearchDrawer from '../../components/SearchDrawer';

interface OrganizeLayoutProps {
    orgId: string;
}

const OrganizeLayout : FunctionComponent<OrganizeLayoutProps> = ({ children, orgId }) => {
    return (
        <Flex>
            <View backgroundColor="gray-600" height="100vh">
                <OrganizeSidebar orgId={ orgId }  />
            </View>
            <View backgroundColor="gray-100" width="100%">
                <View backgroundColor="gray-100" borderColor="transparent" borderWidth="thick" margin="1rem">
                    <Flex justifyContent="space-between">
                        <View width="50%">
                            <BreadcrumbTrail/>
                        </View>
                        <Flex justifyContent="end" width="50%">
                            <SearchDrawer />
                        </Flex>
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