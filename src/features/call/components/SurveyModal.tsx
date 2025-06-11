import { Box } from '@mui/system';
import { FC, useRef } from 'react';

import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import ZUIModal from 'zui/components/ZUIModal';
import SurveyForm from 'features/surveys/components/SurveyForm';
import ZUIText from 'zui/components/ZUIText';
import useLocalStorage from 'zui/hooks/useLocalStorage';

type SurveyModalProps = {
  onClose: () => void;
  open: boolean;
  survey: ZetkinSurveyExtended;
  targetId: number;
};

const SurveyModal: FC<SurveyModalProps> = ({
  onClose,
  open,
  survey,
  targetId,
}) => {
  const [formContent, setFormContent] = useLocalStorage<
    Record<string, string | string[]>
  >(`formContent-${survey.id}-${targetId}`, {});
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <ZUIModal
      onClose={() => {
        if (formRef.current) {
          formRef.current.requestSubmit();
          onClose();
        }
      }}
      open={open}
      primaryButton={{
        label: 'Save',
        onClick: () => {
          if (formRef.current) {
            formRef.current.requestSubmit();
            onClose();
          }
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
            const formContent: Record<string, string | string[]> = {};
            if (formRef.current) {
              ev.preventDefault();
              const formData = new FormData(formRef.current);

              Array.from(formData.entries()).forEach((entry) => {
                const [nameOfQuestion, newValue] = entry;
                const existingValue = formContent[nameOfQuestion];

                if (!existingValue) {
                  formContent[nameOfQuestion] = newValue as string;
                } else {
                  if (Array.isArray(existingValue)) {
                    existingValue.push(newValue as string);
                  } else {
                    const multiChoiceArray: string[] = [];

                    multiChoiceArray.push(existingValue);
                    multiChoiceArray.push(newValue as string);

                    formContent[nameOfQuestion] = multiChoiceArray;
                  }
                }
              });

              setFormContent(formContent);
            }
          }}
        >
          <SurveyForm initialValues={formContent} survey={survey} />
        </form>
      </Box>
    </ZUIModal>
  );
};

export default SurveyModal;
