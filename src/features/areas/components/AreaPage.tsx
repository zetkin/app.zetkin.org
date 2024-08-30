'use client';

import { Avatar, Box } from '@mui/material';
import { FC } from 'react';

import useArea from '../hooks/useArea';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';

type AreaPageProps = {
  areaId: number;
  orgId: number;
};

const AreaPage: FC<AreaPageProps> = ({ areaId, orgId }) => {
  const orgFuture = useOrganization(orgId);
  const areaFuture = useArea(orgId, areaId);

  return (
    <ZUIFutures futures={{ area: areaFuture, org: orgFuture }}>
      {({ data: { area, org } }) => (
        <Box>
          <Box alignItems="center" display="flex" gap={1} padding={2}>
            <Avatar src={`/api/orgs/${orgId}/avatar`} />
            {org.title}
          </Box>
          {area.id}
        </Box>
      )}
    </ZUIFutures>
  );
};

export default AreaPage;
