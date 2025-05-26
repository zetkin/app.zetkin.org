import { Undo } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

import { useMessages } from 'core/i18n';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import messageIds from 'zui/l10n/messageIds';

type Props = {
  onClick: () => void;
  subtitle?: ReactNode;
  title: JSX.Element;
};

const Summary: FC<Props> = ({ onClick, subtitle, title }) => {
  const messages = useMessages(messageIds);
  return (
    <Box
      onClick={() => onClick()}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <ZUIText variant="headingMd">{title}</ZUIText>
        <ZUIButton
          label={messages.report.summary.undoButtonLabel()}
          onClick={() => onClick()}
          size="small"
          startIcon={Undo}
        />
      </Box>
      {subtitle && (
        <ZUIText noWrap variant="bodySmSemiBold">
          {subtitle}
        </ZUIText>
      )}
    </Box>
  );
};

export default Summary;
