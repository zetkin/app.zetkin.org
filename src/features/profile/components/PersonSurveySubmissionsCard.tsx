import { Card, ListItem, ListItemText } from '@mui/material';
import { useMemo } from 'react';

import messageIds from '../l10n/messageIds';
import ZUIList from 'zui/ZUIList';
import ZUISection from 'zui/ZUISection';
import { useMessages } from 'core/i18n';
import { ZetkinPerson, ZetkinSurveySubmission } from 'utils/types/zetkin';
import usePersonSurveySubmissions from 'features/profile/hooks/usePersonSurveySubmissions';
import ZUIFuture from 'zui/ZUIFuture';
import { usePanes } from 'utils/panes';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

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

  return (
    <ZUIList initialLength={4} showMoreStep={sortedSubmissions.length - 4}>
      {sortedSubmissions.map((submission, idx) => (
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
    </ZUIList>
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
