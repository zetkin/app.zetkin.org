import { Card, ListItem, ListItemText } from '@mui/material';

import messageIds from '../l10n/messageIds';
import ZUIList from 'zui/ZUIList';
import ZUISection from 'zui/ZUISection';
import { useMessages } from 'core/i18n';
import { ZetkinPerson } from 'utils/types/zetkin';
import usePersonSurveySubmissions from 'features/profile/hooks/usePersonSurveySubmissions';
import ZUIFuture from 'zui/ZUIFuture';
import { usePanes } from 'utils/panes';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';

const PersonSurveySubmissionsCard: React.FunctionComponent<{
  orgId: number;
  person: ZetkinPerson;
}> = ({ orgId, person }) => {
  const messages = useMessages(messageIds);
  const surveySubmissionsFuture = usePersonSurveySubmissions(orgId, person);
  const { openPane } = usePanes();

  return (
    <ZUISection title={messages.surveySubmissions.title()}>
      <Card>
        <ZUIFuture future={surveySubmissionsFuture}>
          {(surveySubmissions) => (
            <ZUIList
              initialLength={4}
              showMoreStep={surveySubmissions.length - 4}
            >
              {surveySubmissions.map((submission, idx) => (
                <ListItem
                  key={idx}
                  divider
                  onClick={() => {
                    openPane({
                      render() {
                        return (
                          <SurveySubmissionPane
                            id={submission.id}
                            orgId={orgId}
                          />
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
                    secondary={submission.survey.title}
                  />
                </ListItem>
              ))}
            </ZUIList>
          )}
        </ZUIFuture>
      </Card>
    </ZUISection>
  );
};

export default PersonSurveySubmissionsCard;
