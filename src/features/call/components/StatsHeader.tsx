import { Box, Stack } from '@mui/material';
import { FC } from 'react';
import Link from 'next/link';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import ZUIOrgAvatar from 'zui/components/ZUIOrgAvatar';
import useAllocateCall from '../hooks/useAllocateCall';
import ZUIButton from 'zui/components/ZUIButton';

type StatsHeaderProps = {
  assignment: ZetkinCallAssignment;
};

const StatsHeader: FC<StatsHeaderProps> = ({ assignment }) => {
  const { allocateCall } = useAllocateCall(
    assignment.organization.id,
    assignment.id
  );
  return (
    <>
      <Box
        mb={1}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <ZUIText noWrap variant="headingMd">
          {assignment.title}
        </ZUIText>
      </Box>

      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Stack alignItems="center" direction="row" spacing={1}>
          <ZUIOrgAvatar
            orgId={assignment.organization.id}
            title={assignment.organization.title}
          />
          <ZUIText variant="bodySmRegular">
            {assignment.organization.title}
          </ZUIText>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Link href="/my/home" passHref>
            <ZUIButton
              label="Quit"
              variant="secondary"
              // sx={{ whiteSpace: 'nowrap' }}
            />
          </Link>
          <Link href={`/call/${assignment.id}/prepare`} passHref>
            <ZUIButton
              label="Start calling"
              onClick={() => {
                allocateCall();
              }}
              //sx={{ ml: 1, whiteSpace: 'nowrap' }}
              variant="primary"
            />
          </Link>
        </Stack>
      </Stack>
    </>
  );
};

export default StatsHeader;
