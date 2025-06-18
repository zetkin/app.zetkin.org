import { FC, useState } from 'react';
import { Box } from '@mui/material';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { ZetkinCall } from 'features/call/types';
import ZUIButton from 'zui/components/ZUIButton';
import HeaderBase from './HeaderBase';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
  onNextCall: () => void;
  onTakeBreak: () => void;
};

const SummaryHeader: FC<Props> = ({
  assignment,
  call,
  onNextCall,
  onTakeBreak,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <HeaderBase
      primaryButton={
        <ZUIButton
          label="Next call"
          onClick={async () => {
            setIsLoading(true);
            onNextCall();
            setIsLoading(false);
          }}
          variant={isLoading ? 'loading' : 'primary'}
        />
      }
      secondaryButton={
        <ZUIButton
          label="Take a break"
          onClick={() => onTakeBreak()}
          variant="secondary"
        />
      }
      title={
        <Box alignItems="center" display="flex" gap={0.5} minWidth={0}>
          <ZUIPersonAvatar
            firstName={call.target.first_name}
            id={call.target.id}
            lastName={call.target.last_name}
            size="small"
          />
          <ZUIText noWrap variant="bodyMdRegular">
            {call.target.first_name} {call.target.last_name}
          </ZUIText>
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

export default SummaryHeader;
