'use client';

import React, { FC, useMemo } from 'react';
import { Box, List, ListItem } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import NextLink from 'next/link';

import usePublicSubOrgs from '../hooks/usePublicSubOrgs';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIText from 'zui/components/ZUIText';
import useOrganizations from '../hooks/useOrganizations';
import useMemberships from '../hooks/useMemberships';
import ZUIFutures from '../../../zui/ZUIFutures';
import {
  ZetkinMembership,
  ZetkinOrganization,
} from '../../../utils/types/zetkin';
import buildOrganizationForest from '../../home/util/buildOrganizationForest';
import OrganizationsForest from '../../home/components/OrganizationsForest';

type Props = {
  orgId: number;
};

const SubOrganizationsForest: FC<{
  memberships: ZetkinMembership[];
  orgId: number;
  organizations: ZetkinOrganization[];
}> = ({ memberships, organizations, orgId }) => {
  const { organizationForest, idList } = useMemo(() => {
    const filteredOrgs = organizations.filter((org) => org.is_public);

    const { idList, orgMap } = buildOrganizationForest(
      filteredOrgs,
      memberships
    );

    if (!orgMap[orgId]) {
      return {
        idList: [],
        organizationForest: [],
      };
    }

    return {
      idList: idList,
      organizationForest: orgMap[orgId].children,
    };
  }, [organizations, memberships, orgId]);

  return <OrganizationsForest expanded={idList} forest={organizationForest} />;
};

const SubOrgsPage: FC<Props> = ({ orgId }) => {
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
        <SubOrganizationsForest
          memberships={data.memberships}
          organizations={data.organizations}
          orgId={orgId}
        />
      )}
    </ZUIFutures>
  );
};

export default SubOrgsPage;
