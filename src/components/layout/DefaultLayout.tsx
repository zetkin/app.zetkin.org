import { Flex } from '@adobe/react-spectrum';
import { FunctionComponent, useContext } from 'react';

import getUserMemberships from '../../fetching/getUserMemberships';
import PublicHeader from '../PublicHeader';
import { useQuery } from 'react-query';
import UserContext from '../../contexts/UserContext';
import { ZetkinOrganization } from '../../types/zetkin';

interface DefaultLayoutProps {
    org?: ZetkinOrganization;
}

const DefaultLayout : FunctionComponent<DefaultLayoutProps> = ({ children, org }) => {
    const user = useContext(UserContext);
    const membershipsQuery = useQuery(['memberships'], getUserMemberships());
    const memberships = membershipsQuery.data;

    return (
        <Flex
            direction="column"
            gap="size-100"
            marginX="size-200"
            minHeight="100vh">
            <PublicHeader
                org={ org }
                user={ user }
                userMemberships={ memberships || [] }
            />
            { children as JSX.Element }
        </Flex>
    );
};

export default DefaultLayout;
