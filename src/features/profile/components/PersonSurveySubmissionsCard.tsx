import { Box, Button, Card, List, ListItem, ListItemText } from '@mui/material';
import { useMemo, useState } from 'react';

import messageIds from '../l10n/messageIds';
import ZUISection from 'zui/ZUISection';
import { useMessages } from 'core/i18n';
import { ZetkinPerson, ZetkinSurveySubmission } from 'utils/types/zetkin';
import usePersonSurveySubmissions from 'features/profile/hooks/usePersonSurveySubmissions';
import ZUIFuture from 'zui/ZUIFuture';
import { usePanes } from 'utils/panes';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import Msg from 'core/i18n/Msg';

const initialItemCount = 4;

const SurveySubmissionList: React.FunctionComponent<{
  orgId: number;
  submissions: ZetkinSurveySubmission[];
}> = ({ orgId, submissions }) => {
  const { openPane } = usePanes();

  const sortedSubmissions = useMemo(() => {
    return submissions.sort(
      (a, b) => Date.parse(b.submitted) - Date.parse(a.submitted)
    );
  }, [submissions]);

  const [showMore, setShowMore] = useState(false);

  const shownSubmissions = useMemo(
    () =>
      showMore
        ? sortedSubmissions
        : sortedSubmissions.slice(0, initialItemCount),
    [sortedSubmissions, showMore]
  );

  return (
    <List disablePadding>
      {shownSubmissions.map((submission, idx) => (
        <ListItem
          key={idx}
          divider
          onClick={() => {
            openPane({
              render() {
                return (
                  <SurveySubmissionPane id={submission.id} orgId={orgId} />
                );
              },
              width: 400,
            });
          }}
          sx={(theme) => ({
            '&:hover': {
              backgroundColor: theme.palette.background.default,
            },
            cursor: 'pointer',
          })}
        >
          <ListItemText
            primary={submission.survey.title}
            secondary={<ZUIRelativeTime datetime={submission.submitted} />}
          />
        </ListItem>
      ))}

      {sortedSubmissions.length > initialItemCount && !showMore && (
        <Button fullWidth onClick={() => setShowMore(true)}>
          <Box textAlign="center">
            <Msg
              id={messageIds.surveySubmissions.showMore}
              values={{ numExtra: sortedSubmissions.length - initialItemCount }}
            />
          </Box>
        </Button>
      )}
    </List>
  );
};

const PersonSurveySubmissionsCard: React.FunctionComponent<{
  orgId: number;
  person: ZetkinPerson;
}> = ({ orgId, person }) => {
  const messages = useMessages(messageIds);
  const surveySubmissionsFuture = usePersonSurveySubmissions(orgId, person);

  return (
    <ZUISection title={messages.surveySubmissions.title()}>
      <Card>
        <ZUIFuture future={surveySubmissionsFuture}>
          {(surveySubmissions) => (
            <SurveySubmissionList
              orgId={orgId}
              submissions={surveySubmissions}
            />
          )}
        </ZUIFuture>
      </Card>
    </ZUISection>
  );
};

export default PersonSurveySubmissionsCard;
