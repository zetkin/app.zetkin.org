import Link from 'next/link';
import { ArrowBackIos } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import { FC } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import useCurrentCall from '../hooks/useCurrentCall';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIIconButton from 'zui/components/ZUIIconButton';

type PrepareHeaderProps = {
  assignment: ZetkinCallAssignment;
};

const PrepareHeader: FC<PrepareHeaderProps> = ({ assignment }) => {
  const call = useCurrentCall();

  if (!call) {
    return null;
  }

  return (
    <>
      <Stack alignItems="center" direction="row" mb={1}>
        <Link href={`/call/${assignment.id}`} passHref>
          <ZUIIconButton icon={ArrowBackIos} size="small" variant="tertiary" />
        </Link>
        <Box
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <ZUIText noWrap variant="bodySmRegular">
            {assignment.title}
          </ZUIText>
        </Box>
      </Stack>
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Stack alignItems="center" direction="row" spacing={1}>
          <ZUIPersonAvatar
            firstName={call.target.first_name}
            id={call.target.id}
            lastName={call.target.last_name}
          />
          <ZUIText variant="headingLg">
            {call.target.first_name} {call.target.last_name}
          </ZUIText>
        </Stack>
        <Stack direction="row" spacing={2}>
          <ZUIButton label="Skip" variant="secondary" />
          <ZUIButton label="Call" variant="primary" />
        </Stack>
      </Stack>
    </>
  );
};

export default PrepareHeader;
