'use client';

import React, { FC, useMemo } from 'react';
import { Box } from '@mui/material';

import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useMemberships from 'features/organizations/hooks/useMemberships';
import ZUIFutures from 'zui/ZUIFutures';
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
  const messages = useMessages(messageIds);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
