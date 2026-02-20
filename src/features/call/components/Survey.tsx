import { Box } from '@mui/system';
import { FC, useRef } from 'react';
import { ChevronLeft } from '@mui/icons-material';

import { ZetkinSurvey } from 'utils/types/zetkin';
import SurveyForm from 'features/surveys/components/SurveyForm';
import ZUIText from 'zui/components/ZUIText';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import {
  surveyDeselected,
  surveySubmissionAdded,
  surveySubmissionDeleted,
} from '../store';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIDivider from 'zui/components/ZUIDivider';

type Props = {
  survey: ZetkinSurvey;
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
        height: '100%',
        position: 'relative',
        width: '100%',
      }}
    >
      <Box sx={{ left: 20, position: 'absolute', top: 16 }}>
        <ZUIButton
          label="Back to activities"
          onClick={() => {
            const response = responseBySurveyId[survey.id];

            const hasMeaningfulContent =
              !!response &&
              Object.entries(response).some(([, value]) => {
                if (typeof value === 'string') {
                  return value.trim() !== '';
                }
                return value.length > 0;
              });

            if (hasMeaningfulContent) {
              dispatch(surveyDeselected());
            } else {
              dispatch(surveySubmissionDeleted(survey.id));
            }
          }}
          startIcon={ChevronLeft}
        />
      </Box>
      <Box
        sx={{
          paddingX: '1.25rem',
          position: 'absolute',
          top: 58,
          width: '100%',
        }}
      >
        <ZUIDivider />
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
      </Box>
    </Box>
  );
};

export default Survey;
