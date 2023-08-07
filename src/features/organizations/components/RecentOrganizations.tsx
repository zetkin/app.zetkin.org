import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';

import ProceduralColorIcon from './ProceduralColorIcon';

interface RecentOrganizationProps {
  orgId: number;
  recentOrganizations: { id: number; title: string }[];
}

const RecentOrganizations: FC<RecentOrganizationProps> = ({
  orgId,
  recentOrganizations,
}) => {
  return (
    <Box m={1}>
      {recentOrganizations.map((org) => (
        <NextLink key={org.id} href={`/organize/${org.id}`}>
          <Box m={1} sx={{ alignItems: 'center', display: 'inlineFlex' }}>
            <Box mr={1}>
              <ProceduralColorIcon id={org.id} />
            </Box>
            <Typography
              sx={{ fontWeight: orgId == org.id ? 'bold' : 'normal' }}
              variant="body2"
            >
              {org.title}
            </Typography>
          </Box>
        </NextLink>
      ))}
    </Box>
  );
};

export default RecentOrganizations;
