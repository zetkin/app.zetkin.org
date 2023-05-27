import { FC } from 'react';
import { Person } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Avatar, Box, SxProps, Tooltip } from '@mui/material';

import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';

type PersonGridCellPerson = Pick<ZetkinPerson, 'first_name' | 'last_name'> & {
  id: number | null;
};

const ZUIPersonGridCell: FC<{
  onClick?: () => void;
  person: PersonGridCellPerson | null;
  sx?: SxProps;
  tooltip: boolean;
}> = ({ person, onClick, sx, tooltip = true }) => {
  const query = useRouter().query;
  const orgId = parseInt(query.orgId as string);

  // If no person provided
  if (!person || !person.id) {
    return (
      <Box onClick={onClick} sx={sx}>
        <Avatar>
          <Person />
        </Avatar>
      </Box>
    );
  }

  return (
    <Box onClick={onClick} sx={sx}>
      {tooltip ? (
        // Person with tooltip
        <Tooltip title={`${person.first_name} ${person.last_name}`}>
          <ZUIAvatar orgId={orgId} personId={person.id} />
        </Tooltip>
      ) : (
        // Person without tooltip
        <ZUIAvatar orgId={orgId} personId={person.id} />
      )}
    </Box>
  );
};

export default ZUIPersonGridCell;
