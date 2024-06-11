import React from 'react';
import { Avatar, AvatarGroup, Box } from '@mui/material';

import theme from 'theme';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';

interface ParticipantAvatarsProps {
  orgId: number;
  participants: ZetkinEventParticipant[] | ZetkinEventResponse[];
}

const ParticipantAvatars = ({
  participants: list,
  orgId,
}: ParticipantAvatarsProps) => {
  return (
    <Box alignItems="center" display="flex" flexWrap="wrap" gap={0.5}>
      <AvatarGroup
        max={18}
        sx={{
          /* surplus chip styling */
          '& .MuiAvatarGroup-avatar': {
            backgroundColor: 'inherit',
            borderColor: theme.palette.grey[400],
            borderRadius: '1.2em',
            borderWidth: '1px',
            color: theme.palette.text.primary,
            fontSize: '0.7em',
            height: 20,
            marginLeft: 0.1,
            maxWidth: 'max-content',
            minWidth: 20,
          },
        }}
      >
        {list.map((p, index) => (
          <ZUIPersonHoverCard key={index} personId={p.id}>
            <Avatar
              src={orgId ? `/api/orgs/${orgId}/people/${p.id}/avatar` : ''}
              sx={{ height: 20, width: 20 }}
            />
          </ZUIPersonHoverCard>
        ))}
      </AvatarGroup>
    </Box>
  );
};

export default ParticipantAvatars;
