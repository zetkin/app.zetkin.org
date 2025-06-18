import { Box } from '@mui/material';
import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import useAllocateCall from '../../hooks/useAllocateCall';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import HeaderBase from './HeaderBase';

type StatsHeaderProps = {
  assignment: ZetkinCallAssignment;
  onBack: () => void;
  onPrimaryAction: () => void;
};

const StatsHeader: FC<StatsHeaderProps> = ({
  assignment,
  onBack,
  onPrimaryAction,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { allocateCall, error } = useAllocateCall(
    assignment.organization.id,
    assignment.id
  );
  const router = useRouter();

  return (
    <HeaderBase
      primaryButton={
        <ZUIButton
          disabled={isLoading || error !== null}
          label="Start calling"
          onClick={async () => {
            setIsLoading(true);
            const result = await allocateCall();
            if (result) {
              setIsLoading(false);
              onBack();
              router.push(`/call/${assignment.id}`);
            } else {
              setIsLoading(false);
              onPrimaryAction();
            }
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
