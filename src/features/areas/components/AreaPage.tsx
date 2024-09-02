'use client';

import { Avatar, Box } from '@mui/material';
import { FC } from 'react';
import dynamic from 'next/dynamic';

import useArea from '../hooks/useArea';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';

const PublicAreaMap = dynamic(() => import('./PublicAreaMap'), { ssr: false });

type AreaPageProps = {
  areaId: string;
  orgId: number;
};

const AreaPage: FC<AreaPageProps> = ({ areaId, orgId }) => {
  const orgFuture = useOrganization(orgId);
  const areaFuture = useArea(orgId, areaId);

  return (
    <ZUIFutures futures={{ area: areaFuture, org: orgFuture }}>
      {({ data: { area, org } }) => (
        <>
          <Box
            alignItems="center"
            display="flex"
            gap={1}
            height="10vh"
            padding={2}
          >
            <Avatar src={`/api/orgs/${orgId}/avatar`} />
            {org.title}
          </Box>
          <Box height="90vh">
            <PublicAreaMap area={area} />
          </Box>
        </>
      )}
    </ZUIFutures>
  );
};

export default AreaPage;
