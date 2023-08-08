import { FC } from 'react';
import NextLink from 'next/link';
import { Box, List, Typography, useTheme } from '@mui/material';

import ProceduralColorIcon from './ProceduralColorIcon';
import { ZetkinOrganization } from 'utils/types/zetkin';

export type RecentOrganization = Pick<ZetkinOrganization, 'id' | 'title'>;

interface RecentOrganizationProps {
  onSwitchOrg: () => void;
  orgId: number;
  recentOrganizations: RecentOrganization[];
}

const RecentOrganizations: FC<RecentOrganizationProps> = ({
  onSwitchOrg,
  orgId,
  recentOrganizations,
}) => {
  const theme = useTheme();
  return (
    <List>
      {recentOrganizations.map((org) => (
        <NextLink key={org.id} href={`/organize/${org.id}`}>
          <Box
            onClick={onSwitchOrg}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.grey[100],
              },
              alignItems: 'center',
              cursor: 'pointer',
              display: 'inlineFlex',
              marginLeft: 1,
              padding: 1,
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
      ))}
    </List>
  );
};

export default RecentOrganizations;
