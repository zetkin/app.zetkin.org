import React, { FC, Suspense } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import useSubmitSurveySubmission from 'features/surveys/hooks/useSubmitSurveySubmission';
import { ZetkinCallTarget } from '../types';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyQuestionResponse,
} from 'utils/types/zetkin';
import SurveyElements from 'features/surveys/components/surveyForm/SurveyElements';

interface SurveyAccordionProps {
  orgId: number;
  survey: ZetkinSurveyExtended;
  target: ZetkinCallTarget;
}

const SurveyAccordion: FC<SurveyAccordionProps> = ({
  orgId,
  survey,
  target,
}) => {
  const { submitSurveySubmission } = useSubmitSurveySubmission(
    orgId,
    survey.id
  );

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const responseMap = new Map<
      number,
      { options?: number[]; response?: string }
    >();

    for (const [key, value] of formData.entries()) {
      const [idPart, subKey] = key.split('.');
      const questionId = Number(idPart);

      if (questionId) {
        if (!responseMap.has(questionId)) {
          responseMap.set(questionId, {});
        }

        const current = responseMap.get(questionId)!;

        if (subKey === 'options') {
          if (!current.options) {
            current.options = [];
          }
          current.options.push(Number(value));
        } else {
          current.response = String(value);
        }
      }
    }

    const mappedResponses: ZetkinSurveyQuestionResponse[] = Array.from(
      responseMap.entries()
    ).map(([question_id, responseObj]) => ({
      question_id,
      ...(responseObj.options
        ? { options: responseObj.options }
        : { response: responseObj.response ?? '' }),
    }));

    submitSurveySubmission({
      responses: mappedResponses,
      signature: target.id,
    });
  };

  return (
    <Suspense fallback={<ZUILogoLoadingIndicator />}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{survey.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box mb={2}>
            <Typography variant="h6">{survey.title}</Typography>
            <Typography>{survey.info_text}</Typography>
          </Box>
          <form onSubmit={handleFormSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <SurveyElements survey={survey} />
              <Button type="submit" variant="contained">
                Add Submission
              </Button>
            </Box>
          </form>
        </AccordionDetails>
      </Accordion>
    </Suspense>
  );
};

export default SurveyAccordion;
