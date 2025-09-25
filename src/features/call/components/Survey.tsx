import { Box } from '@mui/system';
import { FC, useRef } from 'react';
import { Delete } from '@mui/icons-material';

import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import SurveyForm from 'features/surveys/components/SurveyForm';
import ZUIText from 'zui/components/ZUIText';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { surveySubmissionAdded, surveySubmissionDeleted } from '../store';
import ZUIIconButton from 'zui/components/ZUIIconButton';

type Props = {
  survey: ZetkinSurveyExtended;
};

const Survey: FC<Props> = ({ survey }) => {
  const dispatch = useAppDispatch();
  const responseBySurveyId = useAppSelector(
    (state) =>
      state.call.lanes[state.call.activeLaneIndex].submissionDataBySurveyId
  );
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingTop: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <ZUIText variant="headingMd">{survey.title}</ZUIText>
        <ZUIIconButton
          icon={Delete}
          onClick={() => dispatch(surveySubmissionDeleted(survey.id))}
        />
      </Box>
      {survey.info_text && <ZUIText>{survey.info_text}</ZUIText>}
      <form
        ref={formRef}
        id={`survey-${survey.id}`}
        onSubmit={(ev) => {
          if (formRef.current) {
            ev.preventDefault();
          }
        }}
      >
        <SurveyForm
          initialValues={responseBySurveyId[survey.id]}
          onChange={(name, newValue) => {
            const updatedSurveySubmission = {
              ...responseBySurveyId[survey.id],
              ...{ [name]: newValue },
            };
            dispatch(
              surveySubmissionAdded([survey.id, updatedSurveySubmission])
            );
          }}
          survey={survey}
        />
      </form>
    </Box>
  );
};

export default Survey;
