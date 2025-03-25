import React, { FC, Suspense, useState } from 'react';
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
import useSurveyElements from 'features/surveys/hooks/useSurveyElements';
import {
  ELEMENT_TYPE,
  ZetkinSurveyExtended,
  ZetkinSurveyOptionsQuestionElement,
  ZetkinSurveyQuestionResponse,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';
import useSurveySubmissionMutations from 'features/surveys/hooks/useSurveySubmissionsMutations';
import SurveyText from './Survey/SurveyText';
import SurveyOptions from './Survey/SurveyOptions';
import { ZetkinCallTarget } from '../types';

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
  const elements = useSurveyElements(orgId, survey.id).data;
  const { addSubmission } = useSurveySubmissionMutations(orgId, survey.id);
  const [responses, setResponses] = useState<{
    [key: number]: { options?: number[]; response?: string };
  }>({});

  const handleResponseChange = (
    questionId: number,
    value: number[] | string | number
  ) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: Array.isArray(value)
        ? { options: value }
        : { response: String(value) },
    }));
  };

  const handleFormSubmission = () => {
    const signature = target.id;
    const formResponses: {
      [key: number]: { options?: number[]; response?: string };
    } = responses;

    const mappedResponses: ZetkinSurveyQuestionResponse[] = Object.keys(
      formResponses
    )
      .map((key) => {
        const questionId = parseInt(key);
        const response = formResponses[questionId];

        if (response.response) {
          return {
            question_id: questionId,
            response: response.response,
          };
        } else if (response.options) {
          return {
            options: response.options,
            question_id: questionId,
          };
        }

        return null;
      })
      .filter(
        (response): response is ZetkinSurveyQuestionResponse =>
          response !== null
      );

    addSubmission({
      responses: mappedResponses,
      signature,
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
          {elements &&
            elements.length > 0 &&
            elements.map((element) => {
              if (element.type === ELEMENT_TYPE.QUESTION) {
                if (element.question.response_type === 'text') {
                  return (
                    <SurveyText
                      key={element.id}
                      element={element as ZetkinSurveyTextQuestionElement}
                      onChange={(value) => {
                        handleResponseChange(element.id, value);
                      }}
                    />
                  );
                } else if (element.question.response_type === 'options') {
                  return (
                    <SurveyOptions
                      key={element.id}
                      element={element as ZetkinSurveyOptionsQuestionElement}
                      onChange={(value) => {
                        handleResponseChange(element.id, value);
                      }}
                    />
                  );
                }
              } else {
                return (
                  <Box key={element.id} mb={1} mt={2}>
                    <Typography variant="h6">
                      {element.text_block.header}
                    </Typography>
                    <Typography>{element.text_block.content}</Typography>
                  </Box>
                );
              }
              return null;
            })}
          <Button
            disabled={Object.keys(responses).length === 0}
            onClick={handleFormSubmission}
            variant="contained"
          >
            Update Submission
          </Button>
        </AccordionDetails>
      </Accordion>
    </Suspense>
  );
};

export default SurveyAccordion;
