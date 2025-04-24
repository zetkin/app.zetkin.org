import { Box } from '@mui/material';
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
        sx={{
          overflow: 'hidden',
          pl: { sm: 3, xs: 2 },
          pr: 2,
          pt: 2,
          textOverflow: 'ellipsis',
        }}
      >
        <ZUIText noWrap variant="headingMd">
          {assignment?.title || 'Untitled call assignment'}
        </ZUIText>
      </Box>

      <Box sx={{ px: { sm: 3, xs: 2 }, py: 2 }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'grid',
            gap: 1,
            gridTemplateColumns: '1fr auto',
            width: '100%',
          }}
        >
          <Box alignItems="center" display="flex" minWidth={0}>
            <Box alignItems="center" display="flex" sx={{ flexShrink: 0 }}>
              <ZUIOrgAvatar
                orgId={assignment.organization.id}
                title={assignment.organization.title}
              />
            </Box>

            <Box
              maxWidth="100%"
              minWidth={0}
              ml={1}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <ZUIText noWrap variant="bodySmRegular">
                {assignment?.organization.title || 'Untitled organization'}
              </ZUIText>
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            <Link href="/my/home" passHref>
              <ZUIButton label="Quit" variant="secondary" />
            </Link>
            <Link href={`/call/${assignment.id}/prepare`} passHref>
              <ZUIButton
                label="Start calling"
                onClick={() => {
                  allocateCall();
                }}
                variant="primary"
              />
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default StatsHeader;
