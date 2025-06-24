import { Box } from '@mui/system';
import { FC, useRef } from 'react';

import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import ZUIModal from 'zui/components/ZUIModal';
import SurveyForm from 'features/surveys/components/SurveyForm';
import ZUIText from 'zui/components/ZUIText';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { surveyResponseAdded } from '../store';

type SurveyModalProps = {
  onClose: () => void;
  open: boolean;
  survey: ZetkinSurveyExtended;
};

const SurveyModal: FC<SurveyModalProps> = ({ onClose, open, survey }) => {
  const dispatch = useAppDispatch();
  const responseBySurveyId = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].responseBySurveyId
  );
  const formRef = useRef<HTMLFormElement | null>(null);

  const formDataToSurveyResponse = (formData: FormData) => {
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

  const saveSurveyIfNotEmpty = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();

      const formData = new FormData(formRef.current);

      const hasMeaningfulContent = Array.from(formData.entries()).some(
        ([, value]) => {
          if (typeof value === 'string') {
            return value.trim() !== '';
          }
          return true;
        }
      );

      if (hasMeaningfulContent) {
        const surveyResponse = formDataToSurveyResponse(formData);
        dispatch(surveyResponseAdded([survey.id, surveyResponse]));
      }
    }
  };

  return (
    <ZUIModal
      onClose={() => {
        saveSurveyIfNotEmpty();
        onClose();
      }}
      open={open}
      primaryButton={{
        label: 'Save',
        onClick: () => {
          saveSurveyIfNotEmpty();
          onClose();
        },
      }}
      size="medium"
      title={survey.title || ''}
    >
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
              saveSurveyIfNotEmpty();
            }
          }}
        >
          <SurveyForm
            initialValues={responseBySurveyId[survey.id]}
            survey={survey}
          />
        </form>
      </Box>
    </ZUIModal>
  );
};

export default SurveyModal;
