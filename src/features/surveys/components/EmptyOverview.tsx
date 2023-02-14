import { FormattedMessage as Msg } from 'react-intl';
import { QuizOutlined } from '@mui/icons-material';
import { Box, Button, Link, Typography } from '@mui/material';

interface EmptyOverviewProps {
  campId: string;
  orgId: string;
  surveyId: string;
}

const EmptyOverview = ({ campId, orgId, surveyId }: EmptyOverviewProps) => {
  return (
    <Box alignItems="center" display="flex" flexDirection="column">
      <QuizOutlined
        color="secondary"
        sx={{ fontSize: '8em', paddingBottom: 2 }}
      />
      <Typography color="secondary">
        <Msg id="pages.organizeSurvey.overview.noQuestions.title" />
      </Typography>
      <Link
        href={`/organize/${orgId}/campaigns/${campId}/surveys/${surveyId}/questions`}
        sx={{ marginTop: 4 }}
        underline="none"
      >
        <Button variant="contained">
          <Msg id="pages.organizeSurvey.overview.noQuestions.button" />
        </Button>
      </Link>
    </Box>
  );
};

export default EmptyOverview;
