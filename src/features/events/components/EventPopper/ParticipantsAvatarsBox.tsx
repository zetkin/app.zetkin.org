import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';

interface ParticipantsAvatarsBoxProps {
  list: ZetkinEventParticipant[] | ZetkinEventResponse[];
  max: number;
  maxList: ZetkinEventParticipant[] | ZetkinEventResponse[];
  message: React.ReactNode;
  orgId: number;
}

const ParticipantsAvatarsBox = ({
  list,
  max,
  maxList,
  message,
  orgId,
}: ParticipantsAvatarsBoxProps) => {
  return (
    <Box alignItems="center" display="flex" flexWrap="wrap" gap={0.5}>
      {maxList.map((p, index) => (
        <ZUIPersonHoverCard key={index} personId={p.id}>
          <Avatar
            src={orgId ? `/api/orgs/${orgId}/people/${p.id}/avatar` : ''}
            sx={{ height: 20, width: 20 }}
          />
        </ZUIPersonHoverCard>
      ))}
      {list.length > max && (
        <Box>
          <Typography color="secondary">{message}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ParticipantsAvatarsBox;
