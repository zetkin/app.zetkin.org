import { Box } from '@mui/material';
import { FC } from 'react';

import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import ZUILabel from '../ZUILabel';

type ZUISignUpChipProps = {
  status: 'needed' | 'signedUp';
};

const ZUISignUpChip: FC<ZUISignUpChipProps> = ({ status }) => {
  return (
    <Box
      sx={(theme) => ({
        alignItems: 'center',
        bgcolor:
          status == 'needed'
            ? theme.palette.swatches.blue[100]
            : theme.palette.swatches.green[100],
        borderRadius: 4,
        color:
          status == 'needed'
            ? theme.palette.swatches.blue[900]
            : theme.palette.swatches.green[900],
        display: 'inline-flex',
        pointerEvents: 'none',
        px: 1,
        py: 0.3,
      })}
    >
      <ZUILabel color="inherit">
        <Msg id={messageIds.signUpChip[status]} />
      </ZUILabel>
    </Box>
  );
};

export default ZUISignUpChip;
