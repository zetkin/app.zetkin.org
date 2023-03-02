import { FC } from 'react';
import { Person } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';

import { Avatar, Box } from '@mui/material';

const ZUIPersonGridCell: FC<{
  cell?: ZetkinPerson | null;
}> = ({ cell }) => {
  const query = useRouter().query;
  const orgId = parseInt(query.orgId as string);

  return (
    <Box>
      {cell ? (
        <ZUIAvatar orgId={orgId} personId={cell.id} />
      ) : (
        <Avatar>
          <Person />
        </Avatar>
      )}
    </Box>
  );
};

export default ZUIPersonGridCell;
