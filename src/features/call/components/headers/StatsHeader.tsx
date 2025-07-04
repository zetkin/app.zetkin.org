import { Box } from '@mui/material';
import { FC } from 'react';
import Link from 'next/link';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import useAllocateCall from '../../hooks/useAllocateCall';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import HeaderBase from './HeaderBase';

type StatsHeaderProps = {
  assignment: ZetkinCallAssignment;
};

const StatsHeader: FC<StatsHeaderProps> = ({ assignment }) => {
  const { allocateCall, error, isLoading } = useAllocateCall(
    assignment.organization.id,
    assignment.id
  );

  return (
    <HeaderBase
      primaryButton={
        <ZUIButton
          disabled={isLoading || error !== null}
          label="Start calling"
          onClick={async () => {
            await allocateCall();
          }}
          variant={isLoading ? 'loading' : 'primary'}
        />
      }
      secondaryButton={
        <Link href="/my/home" passHref>
          <ZUIButton label="Quit" variant="secondary" />
        </Link>
      }
      title={
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
      }
      topLeft={
        <Box sx={{ marginBottom: 1 }}>
          <ZUIText noWrap variant="headingMd">
            {assignment?.title || 'Untitled call assignment'}
          </ZUIText>
        </Box>
      }
    />
  );
};

export default StatsHeader;
