import { Flex } from '@adobe/react-spectrum';
import { FunctionComponent } from 'react';

import getUserMemberships from '../../fetching/getUserMemberships';
import PublicHeader from '../PublicHeader';
import { useQuery } from 'react-query';
import { useUser } from '../../hooks';
import { ZetkinOrganization } from '../../types/zetkin';

interface DefaultLayoutProps {
    org?: ZetkinOrganization;
}

const DefaultLayout : FunctionComponent<DefaultLayoutProps> = ({ children, org }) => {
    const user = useUser();
    const membershipsQuery = useQuery(['memberships'], getUserMemberships());
    const memberships = membershipsQuery.data;

    return (
        <Flex
            direction="column"
            gap="size-100"
            marginX="size-200"
            minHeight="100vh">
            <PublicHeader
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                officialMemberships={ memberships! }
                org={ org }
                user={ user }
            />
            { children as JSX.Element }
        </Flex>
    );
};

export default DefaultLayout;