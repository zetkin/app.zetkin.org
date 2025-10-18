'use client';

import React, { FC, useMemo } from 'react';
import { Box } from '@mui/material';

import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useMemberships from 'features/organizations/hooks/useMemberships';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';
import buildOrganizationForest from 'features/home/util/buildOrganizationForest';
import OrganizationsForest from 'features/home/components/OrganizationsForest';
import ZUIButton from 'zui/components/ZUIButton';
import { useMessages } from 'core/i18n';
import messageIds from 'features/organizations/l10n/messageIds';

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

    const { orgMap } = buildOrganizationForest(filteredOrgs, memberships);

    if (!orgMap[orgId]) {
      return {
        idList: [],
        organizationForest: [],
      };
    }

    return {
      idList: [],
      organizationForest: orgMap[orgId].children,
    };
  }, [organizations, memberships, orgId]);

  if (organizationForest.length === 0) {
    return null;
  }

  return <OrganizationsForest expanded={idList} forest={organizationForest} />;
};

const SubOrgsPage: FC<Props> = ({ orgId }) => {
  const organizationsFuture = useOrganizations();
  const membershipsFuture = useMemberships(true);
  const messages = useMessages(messageIds);

  if (
    !organizationsFuture.data ||
    !membershipsFuture.data ||
    membershipsFuture.data.length === 0
  ) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SubOrganizationsForest
        memberships={membershipsFuture.data}
        organizations={organizationsFuture.data}
        orgId={orgId}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <ZUIButton
          href={'/my/organizations'}
          label={messages.subOrgsPage.showAll()}
        />
      </Box>
    </Box>
  );
};

export default SubOrgsPage;
