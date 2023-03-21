import { FC } from 'react';
import { Person } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Avatar, Box, SxProps } from '@mui/material';

import ZUIAvatar from 'zui/ZUIAvatar';

const ZUIPersonGridCell: FC<{
  onClick?: () => void;
  personId: number | null;
  sx?: SxProps;
}> = ({ personId, onClick, sx }) => {
  const query = useRouter().query;
  const orgId = parseInt(query.orgId as string);

  return (
    <Box onClick={onClick} sx={sx}>
      {personId ? (
        <ZUIAvatar orgId={orgId} personId={personId} />
      ) : (
        <Avatar>
          <Person />
        </Avatar>
      )}
    </Box>
  );
};

export default ZUIPersonGridCell;
