import messageIds from '../l10n/messageIds';
import React from 'react';
import { useMessages } from 'core/i18n';
import { useTheme } from '@mui/material';
import ZUICard from 'zui/ZUICard';
import ZUINumberChip from 'zui/ZUINumberChip';

const SurveyUnlinkedCard = () => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

  return (
    <ZUICard
      header={messages.unlinkedCard.header()}
      status={<ZUINumberChip color={theme.palette.grey[200]} value={9} />}
    >
      <h1>weeeee</h1>
    </ZUICard>
  );
};

export default SurveyUnlinkedCard;
