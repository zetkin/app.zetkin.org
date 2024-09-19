'use client';

import { Avatar, Box, Typography } from '@mui/material';
import { FC } from 'react';
import dynamic from 'next/dynamic';

import useArea from '../hooks/useArea';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

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
            justifyContent="space-between"
            padding={2}
          >
            <Box alignItems="center" display="flex" gap={1}>
              <Avatar src={`/api/orgs/${orgId}/avatar`} />
              {org.title}
            </Box>
            <Box alignItems="flex-end" display="flex" flexDirection="column">
              {area.title ?? <Msg id={messageIds.empty.title} />}
              <Typography color="secondary" variant="body2">
                {area.description ?? <Msg id={messageIds.empty.description} />}
              </Typography>
            </Box>
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
