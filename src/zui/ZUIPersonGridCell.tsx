import { FC } from 'react';
import { Person } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { ZetkinPerson } from 'utils/types/zetkin';
import { Avatar, Box, SxProps, Tooltip } from '@mui/material';

//this is basicly a copy of ZUIAvatar
interface ZUICellAvatarProps {
  orgId: number;
  person: ZetkinPerson;
}

const ZUICellAvatar: FC<ZUICellAvatarProps> = ({ orgId, person }) => {
  const personId = person.id;
  return (
    <Tooltip title={person.first_name + ' ' + person.last_name}>
      <Avatar
        src={`/api/orgs/${orgId}/people/${personId}/avatar`}
        style={{ height: 40, width: 40 }}
      />
    </Tooltip>
  );
};

const ZUIPersonGridCell: FC<{
  onClick?: () => void;
  person: ZetkinPerson | null;
  sx?: SxProps;
}> = ({ onClick, person, sx }) => {
  const query = useRouter().query;
  const orgId = parseInt(query.orgId as string);

  return (
    <Box onClick={onClick} sx={sx}>
      {person ? (
        <ZUICellAvatar orgId={orgId} person={person} />
      ) : (
        <Tooltip title={'no person assigned'}>
          <Avatar>
            <Person />
          </Avatar>
        </Tooltip>
      )}
    </Box>
  );
};

export default ZUIPersonGridCell;
