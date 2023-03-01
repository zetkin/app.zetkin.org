import { FormattedMessage as Msg } from 'react-intl';
import { OpenInNew } from '@mui/icons-material';
import ZUITextfieldToClipboard from 'zui/ZUITextfieldToClipboard';
import { Box, Card, Link, Typography } from '@mui/material';

interface SurveyURLCardProps {
  isOpen: boolean;
  orgId: string;
  surveyId: string;
}

const SurveyURLCard = ({ isOpen, orgId, surveyId }: SurveyURLCardProps) => {
  return (
    <Card style={{ padding: 16 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">
          {isOpen ? (
            <Msg id="pages.organizeSurvey.urlCard.open" />
          ) : (
            <Msg id="pages.organizeSurvey.urlCard.preview" />
          )}
        </Typography>
        <Box
          sx={{
            backgroundColor: isOpen ? 'lightgreen' : 'lightgray',
            borderRadius: 5,
            height: 20,
            width: 20,
          }}
        />
      </Box>
      <Typography color="GrayText" paddingBottom={4} variant="body2">
        {isOpen ? (
          <Msg id="pages.organizeSurvey.urlCard.nowAccepting" />
        ) : (
          <Msg id="pages.organizeSurvey.urlCard.willAccept" />
        )}
      </Typography>
      <Box display="flex" flexDirection="row" paddingBottom={2}>
        <ZUITextfieldToClipboard
          copyText={`${process.env.NEXT_PUBLIC_ZETKIN_APP_DOMAIN}o/${orgId}/surveys/${surveyId}`}
        >
          {`${process.env.NEXT_PUBLIC_ZETKIN_APP_DOMAIN}o/${orgId}/surveys/${surveyId}`}
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
          <Msg id="pages.organizeSurvey.urlCard.visitPortal" />
        ) : (
          <Msg id="pages.organizeSurvey.urlCard.previewPortal" />
        )}
      </Link>
    </Card>
  );
};

export default SurveyURLCard;
