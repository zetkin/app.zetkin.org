import { OpenInNew } from '@mui/icons-material';
import { Box, Link, useTheme } from '@mui/material';

import ZUICard from 'zui/ZUICard';
import ZUITextfieldToClipboard from 'zui/ZUITextfieldToClipboard';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

interface SurveyURLCardProps {
  isOpen: boolean;
  orgId: string;
  surveyId: string;
}

const SurveyURLCard = ({ isOpen, orgId, surveyId }: SurveyURLCardProps) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  return (
    <ZUICard
      header={isOpen ? messages.urlCard.open() : messages.urlCard.preview()}
      status={
        <Box
          sx={{
            backgroundColor: isOpen
              ? theme.palette.success.main
              : theme.palette.grey['500'],
            borderRadius: 5,
            height: 20,
            width: 20,
          }}
        />
      }
      subheader={
        isOpen ? messages.urlCard.nowAccepting() : messages.urlCard.willAccept()
      }
    >
      <Box display="flex" paddingBottom={2}>
        <ZUITextfieldToClipboard
          copyText={`${process.env.NEXT_PUBLIC_ZETKIN_APP_DOMAIN}/o/${orgId}/surveys/${surveyId}`}
        >
          {`${process.env.NEXT_PUBLIC_ZETKIN_APP_DOMAIN}/o/${orgId}/surveys/${surveyId}`}
        </ZUITextfieldToClipboard>
      </Box>
      <Link
        display="flex"
        href={`/o/${orgId}/surveys/${surveyId}`}
        sx={{ alignItems: 'center', gap: 1 }}
        target="_blank"
      >
        <OpenInNew fontSize="inherit" />
        {isOpen ? (
          <Msg id={messageIds.urlCard.visitPortal} />
        ) : (
          <Msg id={messageIds.urlCard.previewPortal} />
        )}
      </Link>
    </ZUICard>
  );
};

export default SurveyURLCard;
