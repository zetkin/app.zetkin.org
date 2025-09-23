import { Box } from '@mui/system';
import { FC, useRef } from 'react';

import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import SurveyForm from 'features/surveys/components/SurveyForm';
import ZUIText from 'zui/components/ZUIText';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { surveySubmissionAdded } from '../store';

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

  //TODO: think about what form data we save where
  const formDataToSurveySubmissionData = (formData: FormData) => {
    const submittedFormContent: Record<string, string | string[]> = {};
    Array.from(formData.entries()).forEach((entry) => {
      const [nameOfQuestion, newValue] = entry;
      const existingValue = submittedFormContent[nameOfQuestion];

      if (!existingValue) {
        submittedFormContent[nameOfQuestion] = newValue as string;
      } else {
        if (Array.isArray(existingValue)) {
          existingValue.push(newValue as string);
        } else {
          const multiChoiceArray: string[] = [];

          multiChoiceArray.push(existingValue);
          multiChoiceArray.push(newValue as string);

          submittedFormContent[nameOfQuestion] = multiChoiceArray;
        }
      }
    });
    return submittedFormContent;
  };

  const saveSurveySubmissionData = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();

      const formData = new FormData(formRef.current);

      const surveySubmissionData = formDataToSurveySubmissionData(formData);
      dispatch(surveySubmissionAdded([survey.id, surveySubmissionData]));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingRight: '0.5rem',
        width: '100%',
      }}
    >
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
          survey={survey}
        />
      </form>
    </Box>
  );
};

export default Survey;
