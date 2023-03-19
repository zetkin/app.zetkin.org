import { QuizOutlined } from '@mui/icons-material';
import { Box, Button, Link, Typography } from '@mui/material';

import { Msg } from 'core/i18n';

import messageIds from '../l10n/messageIds';

interface EmptyOverviewProps {
  campId: string;
  orgId: string;
  surveyId: string;
}

const EmptyOverview = ({ campId, orgId, surveyId }: EmptyOverviewProps) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      paddingTop={8}
    >
      <QuizOutlined
        color="secondary"
        sx={{ fontSize: '8em', paddingBottom: 2 }}
      />
      <Typography color="secondary">
        <Msg id={messageIds.overview.noQuestions.title} />
      </Typography>
      <Link
        href={`/organize/${orgId}/projects/${campId}/surveys/${surveyId}/questions`}
        sx={{ marginTop: 4 }}
        underline="none"
      >
        <Button variant="contained">
          <Msg id={messageIds.overview.noQuestions.button} />
        </Button>
      </Link>
    </Box>
  );
};

export default EmptyOverview;
