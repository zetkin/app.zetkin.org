import { FC } from 'react';
import { Person } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Avatar, Box } from '@mui/material';

import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';

const ZUIPersonGridCell: FC<{
  cell: ZetkinPerson | null;
  onClick?: () => void;
}> = ({ cell, onClick }) => {
  const query = useRouter().query;
  const orgId = parseInt(query.orgId as string);

  return (
    <Box onClick={onClick}>
      {cell?.id ? (
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
