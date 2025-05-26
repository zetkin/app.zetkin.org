import { Undo } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

import { useMessages } from 'core/i18n';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import messageIds from 'zui/l10n/messageIds';

type Props = {
  onClick: () => void;
  title: ReactNode;
};

const Summary: FC<Props> = ({ onClick, title }) => {
  const messages = useMessages(messageIds);
  return (
    <Box sx={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
      <ZUIText>{title}</ZUIText>
      <ZUIButton
        label={messages.report.summary.undoButtonLabel()}
        onClick={() => onClick()}
        size="small"
        startIcon={Undo}
      />
    </Box>
  );
};

export default Summary;
