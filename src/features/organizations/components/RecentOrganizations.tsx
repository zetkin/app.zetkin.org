import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Typography, useTheme } from '@mui/material';

import ProceduralColorIcon from './ProceduralColorIcon';
import { TreeItemData } from '../types';

interface RecentOrganizationProps {
  onSwitchOrg: () => void;
  orgId: number;
  recentOrganizations: (TreeItemData | undefined)[];
}

const RecentOrganizations: FC<RecentOrganizationProps> = ({
  onSwitchOrg,
  orgId,
  recentOrganizations,
}) => {
  const theme = useTheme();
  if (recentOrganizations.length > 7) {
    recentOrganizations = recentOrganizations.slice(0, 7);
  }
  return (
    <Box>
      {recentOrganizations.map((org) => {
        if (!org) {
          return;
        }
        return (
          <NextLink key={org.id} href={`/organize/${org.id}`} legacyBehavior>
            <Box
              onClick={onSwitchOrg}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.grey[100],
                },
                alignItems: 'center',
                cursor: 'pointer',
                display: 'inlineFlex',
                paddingLeft: 2,
                paddingRight: 1,
                paddingY: 1,
              }}
            >
              <Box marginRight={1}>
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
        );
      })}
    </Box>
  );
};

export default RecentOrganizations;
