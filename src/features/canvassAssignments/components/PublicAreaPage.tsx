'use client';

import { Avatar, Box, Typography } from '@mui/material';
import { FC } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

import useArea from '../../areas/hooks/useArea';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';
import useServerSide from 'core/useServerSide';

const PublicAreaMap = dynamic(() => import('./PublicAreaMap'), { ssr: false });

type PublicAreaPageProps = {
  areaId: string;
  orgId: number;
};

const PublicAreaPage: FC<PublicAreaPageProps> = ({ areaId, orgId }) => {
  const orgFuture = useOrganization(orgId);
  const areaFuture = useArea(orgId, areaId);
  const searchParams = useSearchParams();

  const canvassAssId = searchParams?.get('canvassAssId') || null;

  const isServer = useServerSide();
  if (isServer) {
    return null;
  }

  return (
    <ZUIFutures futures={{ area: areaFuture, org: orgFuture }}>
      {({ data: { area, org } }) => (
        <>
          <Box
            alignItems="center"
            display="flex"
            gap={1}
            height="10vh"
            justifyContent="space-between"
            padding={2}
          >
            <Box alignItems="center" display="flex" gap={1}>
              <Avatar src={`/api/orgs/${orgId}/avatar`} />
              {org.title}
            </Box>
            <Box alignItems="flex-end" display="flex" flexDirection="column">
              {area.title ?? 'Untitled canvassassignment'}
              <Typography color="secondary" variant="body2">
                {area.description ?? 'Untitled area'}
              </Typography>
            </Box>
          </Box>
          <Box height="90vh">
            <PublicAreaMap area={area} canvassAssId={canvassAssId} />
          </Box>
        </>
      )}
    </ZUIFutures>
  );
};

export default PublicAreaPage;
