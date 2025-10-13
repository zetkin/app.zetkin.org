import React, { FC, useMemo } from 'react';

import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useMemberships from 'features/organizations/hooks/useMemberships';
import ZUIFutures from 'zui/ZUIFutures';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';
import OrganizationsForest from './OrganizationsForest';
import buildOrganizationForest from '../util/buildOrganizationForest';

const AllOrganizationsForest: FC<{
  memberships: ZetkinMembership[];
  organizations: ZetkinOrganization[];
}> = ({ memberships, organizations }) => {
  const { organizationForest, idList } = useMemo(() => {
    const filteredOrgs = organizations.filter((org) => org.is_public);

    const { idList, rootOrgs } = buildOrganizationForest(
      filteredOrgs,
      memberships
    );

    return {
      idList: idList,
      organizationForest: rootOrgs,
    };
  }, [organizations, memberships]);

  return <OrganizationsForest expanded={idList} forest={organizationForest} />;
};

const AllOrganizationsList: FC = () => {
  const organizationsFuture = useOrganizations();
  const membershipsFuture = useMemberships(true);

  return (
    <ZUIFutures
      futures={{
        memberships: membershipsFuture,
        organizations: organizationsFuture,
      }}
    >
      {({
        data,
      }: {
        data: {
          memberships: ZetkinMembership[];
          organizations: ZetkinOrganization[];
        };
      }) => (
        <AllOrganizationsForest
          memberships={data.memberships}
          organizations={data.organizations}
        />
      )}
    </ZUIFutures>
  );
};

export default AllOrganizationsList;
