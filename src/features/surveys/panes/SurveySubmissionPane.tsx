import { EyeClosed } from 'zui/icons/EyeClosed';
import { makeStyles } from '@mui/styles';
import { Box, Typography } from '@mui/material';
import { Check, FormatQuote } from '@mui/icons-material';
import { FC, ReactNode } from 'react';

import { Msg } from 'core/i18n';
import PaneHeader from 'utils/panes/PaneHeader';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import useHydratedSurveySubmission, {
  ELEM_TYPE,
} from '../hooks/useHydratedSurveySubmission';

import messageIds from '../l10n/messageIds';

interface SurveySubmissionPaneProps {
  orgId: number;
  id: number;
  isShared?: boolean;
}

const useStyles = makeStyles({
  element: {
    marginBottom: 20,
  },
  fullName: {
    display: 'inline-block',
    marginRight: '5.8em',
  },
  hidden: { fontSize: '1em' },
  hiddenChip: {
    backgroundColor: '#EBEBEB',
    borderRadius: '16px',
    display: 'flex',
    fontSize: '0.8em',
    marginLeft: '0.6em',
    padding: '0.2em 0.7em',
  },
  linkedChip: {
    backgroundColor: '#A7DFB1',
    borderRadius: '16px',
    fontSize: '0.8em',
    marginLeft: '0.6em',
    padding: '0.2em 0.7em',
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

const SurveySubmissionPane: FC<SurveySubmissionPaneProps> = ({
  orgId,
  id,
  isShared,
}) => {
  const styles = useStyles();

  const subFuture = useHydratedSurveySubmission(orgId, id);

  return (
    <ZUIFuture future={subFuture}>
      {(sub) => {
        let person = <Msg id={messageIds.submissionPane.anonymous} />;
        if (sub.respondent) {
          if (sub.respondent.id) {
            person = (
              <Box display="flex">
                <ZUIPersonLink
                  person={{ ...sub.respondent, id: sub.respondent.id }}
                />
                <Box className={styles.linkedChip}>
                  <Msg id={messageIds.submissionPane.linked} />
                </Box>
              </Box>
            );
          } else {
            person = (
              <Typography
                className={styles.fullName}
              >{`${sub.respondent.first_name} ${sub.respondent.last_name}`}</Typography>
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
                if (elem.hidden && isShared) {
                  return null;
                } else {
                  return (
                    <Question
                      key={elem.id}
                      hidden={elem.hidden}
                      question={elem.question}
                    >
                      <ResponseItem icon={<FormatQuote />}>
                        {elem.response || '-'}
                      </ResponseItem>
                    </Question>
                  );
                }
              } else if (elem.type == ELEM_TYPE.OPTIONS) {
                if (elem.hidden && isShared) {
                  return null;
                } else {
                  return (
                    <Question
                      key={elem.id}
                      hidden={elem.hidden}
                      question={elem.question}
                    >
                      {elem.selectedOptions.length == 0 && '-'}
                      {elem.selectedOptions.map((option) => (
                        <ResponseItem key={option.id} icon={<Check />}>
                          {option.text}
                        </ResponseItem>
                      ))}
                    </Question>
                  );
                }
              } else if (elem.type == ELEM_TYPE.TEXT_BLOCK) {
                return (
                  <Box key={elem.id} className={styles.element}>
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
    <Box className={styles.element}>
      <Box display="flex" justifyContent="space-between">
        <Typography
          className={styles.question}
          sx={{ opacity: hidden ? 0.4 : 1 }}
        >
          {question}
        </Typography>
        {hidden && (
          <Box className={styles.hiddenChip}>
            <EyeClosed />
            <Box className={styles.hidden}>
              <Msg id={messageIds.submissionPane.hidden} />
            </Box>
          </Box>
        )}
      </Box>
      <Box className={styles.response} sx={{ opacity: hidden ? 0.4 : 1 }}>
        {children}
      </Box>
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
