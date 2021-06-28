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
            <View flexGrow={ 1 } height="100vh" overflow="scroll">
                <Flex direction="column" height="100%" width="100%">
                    <View margin="1rem 1rem 0 1rem">
                        <Flex>
                            <View width="50%">
                                <BreadcrumbTrail/>
                            </View>
                            <Flex justifyContent="end" width="50%">
                                <SearchDrawer { ...{ orgId } } />
                            </Flex>
                        </Flex>
                    </View>
                    { children as JSX.Element }
                </Flex>
            </View>
        </Flex>
    );
};

export default OrganizeLayout;