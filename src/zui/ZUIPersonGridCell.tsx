import { FC } from 'react';
import { Person } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Avatar, Box, SxProps, Tooltip } from '@mui/material';

import ZUIAvatar from 'zui/ZUIAvatar';
import { ZetkinPerson, ZetkinSurveySubmission } from 'utils/types/zetkin';

const ZUIPersonGridCell: FC<{
  onClick?: () => void;
  person: ZetkinPerson | ZetkinSurveySubmission['respondent'] | null;
  sx?: SxProps;
}> = ({ person, onClick, sx }) => {
  const query = useRouter().query;
  const orgId = parseInt(query.orgId as string);

  return (
    <Box onClick={onClick} sx={sx}>
      {person && person.id ? (
        <Tooltip title={`${person.first_name} ${person.last_name}`}>
          <ZUIAvatar orgId={orgId} personId={person.id} />
        </Tooltip>
      ) : (
        <Avatar>
          <Person />
        </Avatar>
      )}
    </Box>
  );
};

export default ZUIPersonGridCell;
