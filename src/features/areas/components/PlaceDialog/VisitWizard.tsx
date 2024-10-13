import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import { Visit, ZetkinCanvassAssignment } from 'features/areas/types';

const Question: FC<{
  description: string;
  onChange: (newValue: boolean) => void;
  options: { label: string | number; value: string }[];
  question: string;
  value?: string;
}> = ({ description, onChange, options, question, value }) => {
  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        flexGrow={1}
        gap={1}
        justifyContent="center"
      >
        <Typography>{question}</Typography>
        <Typography variant="body2">{description}</Typography>
      </Box>
      <ToggleButtonGroup
        exclusive
        fullWidth
        onChange={(ev, newValue) => {
          onChange(newValue);
        }}
        value={value}
      >
        {options.map((option) => (
          <ToggleButton key={option.value.toString()} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </>
  );
};

type PreviousMessageProps = {
  onClick: () => void;
  question: string;
  response: string;
};

const PreviousMessage: FC<PreviousMessageProps> = ({
  onClick,
  question,
  response,
}) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      onClick={onClick}
      sx={{
        borderBottom: '1px solid lightGrey',
        padding: 1,
      }}
    >
      <Typography variant="body2">{`${question}: ${response}`}</Typography>
    </Box>
  );
};

type VisitWizardProps = {
  metrics: ZetkinCanvassAssignment['metrics'];
  onLogVisit: (responses: Visit['responses']) => void;
};

const VisitWizard: FC<VisitWizardProps> = ({ metrics, onLogVisit }) => {
  const [responses, setResponses] = useState<Visit['responses']>([]);
  const [step, setStep] = useState(0);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {metrics.map((metric, index) => {
        if (index < step) {
          return (
            <>
              <PreviousMessage
                key={metric.id}
                onClick={() => {
                  setStep(index);
                  setResponses(responses.slice(0, index + 1));
                }}
                question={metric.question}
                response={responses[index].response}
              />
              {index == metrics.length - 1 && (
                <Box
                  display="flex"
                  flexDirection="column"
                  flexGrow={1}
                  justifyContent="flex-end"
                >
                  <Button
                    fullWidth
                    onClick={() => {
                      onLogVisit(responses);
                    }}
                    variant="contained"
                  >
                    Save
                  </Button>
                </Box>
              )}
            </>
          );
        }

        if (index == step) {
          return (
            <Box display="flex" flexDirection="column" flexGrow={1}>
              <Question
                key={metric.id}
                description={metric.description}
                onChange={(newValue) => {
                  if (newValue == null) {
                    //User is returning and selects the same response
                    setStep(step + 1);
                  } else {
                    if (responses[index]) {
                      //User is returning and selects new response
                      setResponses([
                        ...responses.slice(
                          0,
                          responses.indexOf(responses[index])
                        ),
                        {
                          ...responses[index],
                          response: newValue.toString(),
                        },
                      ]);
                    } else {
                      //User is responding to this question for the first time
                      setResponses([
                        ...responses,
                        {
                          metricId: metric.id,
                          response: newValue.toString(),
                        },
                      ]);
                    }
                    setStep(step + 1);
                  }
                }}
                options={
                  metric.kind == 'boolean'
                    ? [
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' },
                      ]
                    : [
                        { label: 1, value: '1' },
                        { label: 2, value: '2' },
                        { label: 3, value: '3' },
                        { label: 4, value: '4' },
                        { label: 5, value: '5' },
                      ]
                }
                question={metric.question}
                value={responses[index]?.response}
              />
            </Box>
          );
        }

        if (index > step) {
          return null;
        }
      })}
    </Box>
  );
};

export default VisitWizard;
