import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@mui/styles';
import { Box, List, ListItem, Typography } from '@mui/material';

import PaneHeader from 'utils/panes/PaneHeader';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import SurveySubmissionModel, {
  ELEM_TYPE,
} from '../models/SurveySubmissionModel';

interface SurveySubmissionPaneProps {
  orgId: number;
  id: number;
}

const useStyles = makeStyles({
  element: {
    marginBottom: 20,
  },
  question: {
    fontWeight: 'bold',
  },
});

const SurveySubmissionPane: FC<SurveySubmissionPaneProps> = ({ orgId, id }) => {
  const styles = useStyles();
  const model = useModel((env) => new SurveySubmissionModel(env, orgId, id));
  const subFuture = model.getHydrated();

  return (
    <ZUIFuture future={subFuture}>
      {(sub) => {
        let person = (
          <FormattedMessage id="misc.panes.surveySubmission.anonymous" />
        );
        if (sub.respondent) {
          if (sub.respondent.id) {
            person = (
              <ZUIPersonLink
                person={{ ...sub.respondent, id: sub.respondent.id }}
              />
            );
          } else {
            person = (
              <>
                `${sub.respondent.first_name} ${sub.respondent.last_name}`;
              </>
            );
          }
        }

        return (
          <>
            <PaneHeader
              subtitle={
                <FormattedMessage
                  id="misc.panes.surveySubmission.subtitle"
                  values={{
                    date: <ZUIRelativeTime datetime={sub.submitted} />,
                    person: person,
                  }}
                />
              }
              title={sub.survey.title}
            />
            {sub.elements.map((elem) => {
              if (elem.type == ELEM_TYPE.OPEN_QUESTION) {
                return (
                  <Box className={styles.element}>
                    <Typography className={styles.question}>
                      {elem.question}
                    </Typography>
                    <Typography>{elem.description}</Typography>
                    {elem.response}
                  </Box>
                );
              } else if (elem.type == ELEM_TYPE.OPTIONS) {
                return (
                  <Box className={styles.element}>
                    <Typography>{elem.question}</Typography>
                    <Typography>{elem.description}</Typography>
                    <List>
                      {elem.selectedOptions.map((option) => (
                        <ListItem key={option.id}>X {option.text}</ListItem>
                      ))}
                    </List>
                  </Box>
                );
              } else if (elem.type == ELEM_TYPE.TEXT_BLOCK) {
                return (
                  <Box className={styles.element}>
                    <h1>{elem.header}</h1>
                    <p>{elem.text}</p>
                  </Box>
                );
              }
            })}
          </>
        );
      }}
    </ZUIFuture>
  );
};

export default SurveySubmissionPane;
