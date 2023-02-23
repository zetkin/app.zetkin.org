import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@mui/styles';
import { Box, SvgIcon, Typography } from '@mui/material';
import { Check, FormatQuote } from '@mui/icons-material';
import { FC, ReactNode } from 'react';

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
    marginRight: '4em',
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
              <Box display="inline-flex">
                <ZUIPersonLink
                  person={{ ...sub.respondent, id: sub.respondent.id }}
                />
                <Box className={styles.linkedChip}>Linked</Box>
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
            {sub.elements.map((elem, idx) => {
              if (elem.type == ELEM_TYPE.OPEN_QUESTION) {
                return (
                  <Question
                    key={`elementQue-${idx}`}
                    hidden={elem.hidden}
                    question={elem.question}
                  >
                    <ResponseItem icon={<FormatQuote />}>
                      {elem.response || '-'}
                    </ResponseItem>
                  </Question>
                );
              } else if (elem.type == ELEM_TYPE.OPTIONS) {
                return (
                  <Question
                    key={`elementOpt-${idx}`}
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
              } else if (elem.type == ELEM_TYPE.TEXT_BLOCK) {
                return (
                  <Box key={`elementTxt-${idx}`} className={styles.element}>
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
      <Box display="flex">
        <Typography
          className={styles.question}
          sx={{ opacity: hidden ? 0.4 : 1 }}
        >
          {question}
        </Typography>
        {hidden && (
          <Box className={styles.hiddenChip}>
            <SvgIcon>
              <svg fill="none" height="17" viewBox="0 0 24 24" width="17">
                <path
                  d="M20.3644 17.3895C21.9263 16.0409 23.1603 14.3212 23.9306 12.3666L22.0698 11.6333C21.3163 13.5453 20.0357 15.1934 18.4065 16.3955C16.6134 17.7184 14.3999 18.4999 12.0002 18.4999C9.60045 18.4999 7.38695 17.7184 5.59388 16.3955C3.96466 15.1934 2.68404 13.5453 1.93055 11.6333L0.0698242 12.3666C0.84011 14.3212 2.0741 16.0409 3.63602 17.3895L2.18648 19.4187L3.8139 20.5812L5.24698 18.5751C6.94151 19.6293 8.90019 20.299 11.0002 20.4614V22.9999H13.0002V20.4614C15.1002 20.299 17.0589 19.6293 18.7534 18.5751L20.1865 20.5812L21.8139 19.4187L20.3644 17.3895Z"
                  fill="black"
                  fillOpacity="0.6"
                />
              </svg>
            </SvgIcon>
            <Typography className={styles.hidden}>Hidden</Typography>
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
