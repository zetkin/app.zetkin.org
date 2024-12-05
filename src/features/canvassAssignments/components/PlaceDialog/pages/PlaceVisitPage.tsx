import { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Typography,
} from '@mui/material';

import PageBase from './PageBase';
import IntInput from '../IntInput';
import {
  ZetkinCanvassAssignment,
  ZetkinPlaceVisit,
} from 'features/canvassAssignments/types';

type Props = {
  active: boolean;
  assignment: ZetkinCanvassAssignment;
  onBack: () => void;
  onClose: () => void;
  onLogVisit: (responses: ZetkinPlaceVisit['responses']) => void;
};

const PlaceVisitPage: FC<Props> = ({
  active,
  assignment,
  onBack,
  onClose,
  onLogVisit,
}) => {
  const [step, setStep] = useState(0);
  const [numHouseholds, setNumHouseholds] = useState(0);
  const [valuesByMetricId, setValuesByMetricId] = useState<
    Record<string, number[]>
  >({});

  useEffect(() => {
    const metricCounts = assignment.metrics.map((metric) => {
      const values = valuesByMetricId[metric.id] || [];
      return values.reduce((sum, value) => sum + value, 0);
    });

    const max = Math.max(...metricCounts);

    if (max > numHouseholds) {
      setNumHouseholds(max);
    }
  }, [valuesByMetricId]);

  useEffect(() => {
    if (active) {
      setNumHouseholds(0);
      setValuesByMetricId({});
      setStep(0);
    }
  }, [active]);

  return (
    <PageBase
      actions={
        step >= assignment.metrics.length - 1 && (
          <Button
            onClick={() => {
              const metricIds = Object.keys(valuesByMetricId);
              onLogVisit(
                metricIds.map((metricId) => ({
                  metricId,
                  responseCounts: valuesByMetricId[metricId],
                }))
              );
            }}
            variant="contained"
          >
            Submit
          </Button>
        )
      }
      onBack={onBack}
      onClose={onClose}
      title="Report visits here"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        justifyContent="center"
      >
        <Stepper activeStep={step} nonLinear orientation="vertical">
          {assignment.metrics.map((metric, index) => {
            const completed = !!valuesByMetricId[metric.id];
            const numYes = valuesByMetricId[metric.id]?.[0] ?? 0;
            const numNo = valuesByMetricId[metric.id]?.[1] ?? 0;
            const numHouseholds = numYes + numNo;
            const stepIsCurrent = index == step;

            if (metric.kind == 'boolean') {
              const values = valuesByMetricId[metric.id] || [0, 0];
              return (
                <Step
                  key={index}
                  completed={completed}
                  disabled={index > step && !valuesByMetricId[metric.id]}
                >
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
                        ({numHouseholds} households, {numYes} yes)
                      </Typography>
                    )}
                  </StepButton>
                  <StepContent>
                    <Box
                      alignItems="center"
                      display="flex"
                      flexDirection="column"
                      gap={4}
                    >
                      {metric.description && (
                        <Typography variant="body2">
                          {metric.description}
                        </Typography>
                      )}
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={2}
                        maxWidth={200}
                        mx="auto"
                        width="70%"
                      >
                        <IntInput
                          label="Yes"
                          labelPlacement="horizontal"
                          onChange={(value) => {
                            setValuesByMetricId((current) => ({
                              ...current,
                              [metric.id]: [value, values[1]],
                            }));
                          }}
                          value={values[0]}
                        />
                        <IntInput
                          label="No"
                          labelPlacement="horizontal"
                          onChange={(value) => {
                            setValuesByMetricId((current) => ({
                              ...current,
                              [metric.id]: [values[0], value],
                            }));
                          }}
                          value={values[1]}
                        />
                      </Box>
                      <Button
                        onClick={() => setStep((current) => current + 1)}
                        variant="contained"
                      >
                        Proceed
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              );
            } else if (metric.kind == 'scale5') {
              const values = valuesByMetricId[metric.id] || [0, 0, 0, 0, 0];
              const numHouseholds = values.reduce((sum, val) => sum + val, 0);
              const sumTotal = values.reduce(
                (sum, count, index) => sum + count * (index + 1)
              );
              const avg = sumTotal / numHouseholds;
              const avgFixed = avg.toFixed(1);

              return (
                <Step
                  key={index}
                  completed={completed}
                  disabled={index > step && !valuesByMetricId[metric.id]}
                >
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
                        ({numHouseholds} households, {avgFixed} average)
                      </Typography>
                    )}
                  </StepButton>
                  <StepContent>
                    <Box
                      alignItems="center"
                      display="flex"
                      flexDirection="column"
                      gap={4}
                    >
                      {metric.description && (
                        <Typography variant="body2">
                          {metric.description}
                        </Typography>
                      )}
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={2}
                        maxWidth={200}
                        mx="auto"
                        width="70%"
                      >
                        {values.map((count, index) => {
                          const ratingValue = index + 1;
                          return (
                            <IntInput
                              key={ratingValue}
                              label={ratingValue.toString()}
                              labelPlacement="horizontal"
                              onChange={(newValue) => {
                                setValuesByMetricId((current) => ({
                                  ...current,
                                  [metric.id]: [
                                    ...values.slice(0, index),
                                    newValue,
                                    ...values.slice(index + 1),
                                  ],
                                }));
                              }}
                              value={count}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  </StepContent>
                </Step>
              );
            }
          })}
        </Stepper>
      </Box>
    </PageBase>
  );
};

export default PlaceVisitPage;
