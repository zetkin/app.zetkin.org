import {
  Box,
  Button,
  Step,
  StepButton,
  StepContent,
  Stepper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';

import {
  Household,
  Visit,
  ZetkinCanvassAssignment,
} from 'features/canvassAssignments/types';
import PageBase from './PageBase';

type VisitWizardProps = {
  household: Household;
  metrics: ZetkinCanvassAssignment['metrics'];
  onBack: () => void;
  onLogVisit: (
    responses: Visit['responses'],
    noteToOfficial: Visit['noteToOfficial']
  ) => void;
};

const VisitWizard: FC<VisitWizardProps> = ({
  household,
  metrics,
  onBack,
  onLogVisit,
}) => {
  const [responseByMetricId, setResponseByMetricId] = useState<
    Record<string, string>
  >({});
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [household.id]);

  return (
    <PageBase
      actions={
        step >= metrics.length && (
          <Button
            fullWidth
            onClick={() => {
              const responses = Object.entries(responseByMetricId).map(
                ([metricId, response]) => ({ metricId, response })
              );
              const filteredResponses = responses.filter(
                (response) => !!response.response
              );
              onLogVisit(filteredResponses, '');
            }}
            variant="contained"
          >
            Submit report
          </Button>
        )
      }
      onBack={onBack}
      title={`${household.title || 'Unititled household'}: Log visit`}
    >
      <Stepper activeStep={step} orientation="vertical">
        {metrics.map((metric, index) => {
          const options =
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
                ];

          const stepIsCurrent = index == step;
          const completed = metric.id in responseByMetricId;

          return (
            <Step key={index}>
              <StepButton
                onClick={() => setStep(index)}
                sx={{
                  '& span': {
                    overflow: 'hidden',
                  },
                }}
              >
                <Typography
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: stepIsCurrent ? 'normal' : 'nowrap',
                  }}
                >
                  {metric.question}
                </Typography>

                {completed && step != index && (
                  <Typography variant="body2">
                    {responseByMetricId[metric.id]}
                  </Typography>
                )}
              </StepButton>
              <StepContent>
                <Box
                  alignItems="stretch"
                  display="flex"
                  flexDirection="column"
                  gap={2}
                  width="100%"
                >
                  {metric.description && (
                    <Typography variant="body2">
                      {metric.description}
                    </Typography>
                  )}
                  <ToggleButtonGroup
                    exclusive
                    fullWidth
                    onChange={(ev, newValue) => {
                      setResponseByMetricId({
                        ...responseByMetricId,
                        [metric.id]: newValue,
                      });
                      setStep(index + 1);
                    }}
                    value={responseByMetricId[metric.id]}
                  >
                    {options.map((option) => (
                      <ToggleButton
                        key={option.value.toString()}
                        value={option.value}
                      >
                        {option.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  {!metric.definesDone && (
                    <Button onClick={() => setStep(index + 1)}>
                      Skip this question
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </PageBase>
  );
};

export default VisitWizard;
