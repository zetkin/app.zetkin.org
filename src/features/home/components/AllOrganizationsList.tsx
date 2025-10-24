import React, { FC, useMemo } from 'react';

import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useMemberships from 'features/organizations/hooks/useMemberships';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';
import OrganizationsForest from './OrganizationsForest';
import buildOrganizationForest from '../util/buildOrganizationForest';
import buildLeveledIdList from '../util/buildLeveledIdList';

const AllOrganizationsForest: FC<{
  memberships: ZetkinMembership[];
  organizations: ZetkinOrganization[];
}> = ({ memberships, organizations }) => {
  const { organizationForest, idList } = useMemo(() => {
    const filteredOrgs = organizations.filter((org) => org.is_public);

    const { rootOrgs } = buildOrganizationForest(filteredOrgs, memberships);

    const idList = buildLeveledIdList(rootOrgs, 1).map((i) => i.toString());

    return {
      idList: idList,
      organizationForest: rootOrgs,
    };
  }, [organizations, memberships]);

  if (organizationForest.length === 0) {
    return null;
  }

  return <OrganizationsForest expanded={idList} forest={organizationForest} />;
};

const AllOrganizationsList: FC = () => {
  const organizationsFuture = useOrganizations();
  const membershipsFuture = useMemberships(true);

  if (
    !organizationsFuture.data ||
    !membershipsFuture.data ||
    membershipsFuture.data.length === 0
  ) {
    return null;
  }

  return (
    <AllOrganizationsForest
      memberships={membershipsFuture.data}
      organizations={organizationsFuture.data}
    />
  );
};

export default AllOrganizationsList;
