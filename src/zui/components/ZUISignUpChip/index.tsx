import { Box, useTheme } from '@mui/material';
import { FC } from 'react';

import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import ZUILabel from '../ZUILabel';

type ZUISignUpChipProps = {
  name?: string;
  status: 'needed' | 'signedUp' | 'booked';
};

const ZUISignUpChip: FC<ZUISignUpChipProps> = ({ name, status }) => {
  const theme = useTheme();

  const getColors = () => {
    if (status == 'needed') {
      return theme.palette.swatches.yellow;
    } else if (status == 'signedUp') {
      return theme.palette.swatches.green;
    } else {
      //Status must be "booked"
      return theme.palette.swatches.blue;
    }
  };

  const colors = getColors();

  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: colors[100],
        borderRadius: 4,
        color: colors[900],
        display: 'inline-flex',
        pointerEvents: 'none',
        px: 1,
        py: 0.3,
      }}
    >
      <ZUILabel color="inherit">
        {name && status == 'signedUp' ? (
          <Msg id={messageIds.signUpChip.callSignUp} values={{ name }} />
        ) : (
          <Msg id={messageIds.signUpChip[status]} />
        )}
      </ZUILabel>
    </Box>
  );
};

export default ZUISignUpChip;
