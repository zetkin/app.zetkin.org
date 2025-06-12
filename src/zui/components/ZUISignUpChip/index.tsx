import { Box } from '@mui/material';
import { FC } from 'react';

import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import ZUILabel from '../ZUILabel';

type ZUISignUpChipProps = {
  status: 'needed' | 'signedUp' | 'booked';
};

const ZUISignUpChip: FC<ZUISignUpChipProps> = ({ status }) => {
  return (
    <Box
      sx={(theme) => {
        const colors =
          status == 'needed'
            ? theme.palette.swatches.yellow
            : status == 'booked'
            ? theme.palette.swatches.blue
            : theme.palette.swatches.green;
        return {
          alignItems: 'center',
          bgcolor: colors[100],
          borderRadius: 4,
          color: colors[900],
          display: 'inline-flex',
          pointerEvents: 'none',
          px: 1,
          py: 0.3,
        };
      }}
    >
      <ZUILabel color="inherit">
        <Msg id={messageIds.signUpChip[status]} />
      </ZUILabel>
    </Box>
  );
};

export default ZUISignUpChip;
