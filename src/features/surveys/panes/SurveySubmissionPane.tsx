import { Box, Link, Typography } from '@mui/material';
import { Check, FormatQuote } from '@mui/icons-material';
import { FC, ReactNode } from 'react';
import NextLink from 'next/link';

import { EyeClosed } from 'zui/icons/EyeClosed';
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
}

const SurveySubmissionPane: FC<SurveySubmissionPaneProps> = ({ orgId, id }) => {
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
                <Box
                  sx={{
                    backgroundColor: '#A7DFB1',
                    borderRadius: '16px',
                    fontSize: '0.8em',
                    marginLeft: '0.6em',
                    padding: '0.2em 0.7em',
                  }}
                >
                  <Msg id={messageIds.submissionPane.linked} />
                </Box>
              </Box>
            );
          } else {
            person = (
              <Typography
                sx={{
                  display: 'inline-block',
                  marginRight: '5.8em',
                }}
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
              title={
                <Link
                  color={'inherit'}
                  component={NextLink}
                  href={`/organize/${sub.organization.id}/projects/${
                    sub.campaign ? sub.campaign.id : 'standalone'
                  }/surveys/${sub.survey.id}`}
                  underline={'hover'}
                >
                  {sub.survey.title}
                </Link>
              }
            />
            {sub.elements.map((elem) => {
              if (elem.type == ELEM_TYPE.OPEN_QUESTION) {
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
              } else if (elem.type == ELEM_TYPE.OPTIONS) {
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
              } else if (elem.type == ELEM_TYPE.TEXT_BLOCK) {
                return (
                  <Box
                    key={elem.id}
                    sx={{
                      marginBottom: '20px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1.2em',
                        fontWeight: 'bold',
                      }}
                    >
                      {elem.header}
                    </Typography>
                    <Typography>{elem.text}</Typography>
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
  return (
    <Box
      sx={{
        marginBottom: '20px',
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ fontWeight: 'bold', opacity: hidden ? 0.4 : 1 }}>
          {question}
        </Typography>
        {hidden && (
          <Box
            sx={{
              backgroundColor: '#EBEBEB',
              borderRadius: '16px',
              display: 'flex',
              fontSize: '0.8em',
              marginLeft: '0.6em',
              padding: '0.2em 0.7em',
            }}
          >
            <EyeClosed />
            <Box sx={{ fontSize: '1em' }}>
              <Msg id={messageIds.submissionPane.hidden} />
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ marginTop: '10px', opacity: hidden ? 0.4 : 1 }}>
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
