import { Box } from '@mui/material';
import { FC } from 'react';
import Link from 'next/link';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import useAllocateCall from '../hooks/useAllocateCall';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUIDivider from 'zui/components/ZUIDivider';

type StatsHeaderProps = {
  assignment: ZetkinCallAssignment;
  onPrepareCall: () => void;
};

const StatsHeader: FC<StatsHeaderProps> = ({ assignment, onPrepareCall }) => {
  const { allocateCall, error } = useAllocateCall(
    assignment.organization.id,
    assignment.id
  );
  return (
    <>
      <Box
        sx={{
          pl: { sm: 3, xs: 2 },
          pr: 2,
          pt: 2,
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
              <ZUIOrgLogoAvatar orgId={assignment.organization.id} />
            </Box>

            <Box maxWidth="100%" minWidth={0} ml={1}>
              <ZUIText noWrap variant="bodySmRegular">
                {assignment?.organization.title || 'Untitled organization'}
              </ZUIText>
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            <Link href="/my/home" passHref>
              <ZUIButton label="Quit" variant="secondary" />
            </Link>

            <ZUIButton
              disabled={error !== null ? true : false}
              label="Start calling"
              onClick={() => {
                allocateCall();
                onPrepareCall();
              }}
              variant="primary"
            />
          </Box>
        </Box>
      </Box>
      <ZUIDivider />
    </>
  );
};

export default StatsHeader;
