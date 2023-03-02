import { makeStyles } from '@mui/styles';
import { Box, Typography } from '@mui/material';
import { Check, FormatQuote } from '@mui/icons-material';
import { FC, ReactNode } from 'react';

import { Msg } from 'core/i18n';
import PaneHeader from 'utils/panes/PaneHeader';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import SurveySubmissionModel, {
  ELEM_TYPE,
} from '../models/SurveySubmissionModel';

import messageIds from '../l10n/messageIds';

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
  response: {
    marginTop: 10,
  },
  textContent: {},
  textHeader: {
    fontSize: '1.2em',
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
        let person = <Msg id={messageIds.submissionPane.anonymous} />;
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
                <Msg
                  id={messageIds.submissionPane.subtitle}
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
                  <Question hidden={elem.hidden} question={elem.question}>
                    <ResponseItem icon={<FormatQuote />}>
                      {elem.response || '-'}
                    </ResponseItem>
                  </Question>
                );
              } else if (elem.type == ELEM_TYPE.OPTIONS) {
                return (
                  <Question hidden={elem.hidden} question={elem.question}>
                    {elem.selectedOptions.length == 0 && '-'}
                    {elem.selectedOptions.map((option) => (
                      <ResponseItem key={option.id} icon={<Check />}>
                        {option.text}
                      </ResponseItem>
                    ))}
                  </Question>
                );
              } else if (elem.type == ELEM_TYPE.TEXT_BLOCK) {
                return (
                  <Box className={styles.element}>
                    <Typography className={styles.textHeader}>
                      {elem.header}
                    </Typography>
                    <Typography className={styles.textContent}>
                      {elem.text}
                    </Typography>
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

const Question: FC<{
  children: ReactNode;
  hidden: boolean;
  question: string;
}> = ({ children, hidden, question }) => {
  const styles = useStyles();
  return (
    <Box className={styles.element} sx={{ opacity: hidden ? 0.4 : 1 }}>
      <Typography className={styles.question}>{question}</Typography>
      <Box className={styles.response}>{children}</Box>
    </Box>
  );
};

const ResponseItem: FC<{ children: ReactNode; icon: JSX.Element }> = ({
  children,
  icon,
}) => {
  return (
    <Box display="flex">
      <Box color="#888888">{icon}</Box>
      <Box>{children}</Box>
    </Box>
  );
};

export default SurveySubmissionPane;
