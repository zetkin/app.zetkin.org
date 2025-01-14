import { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Typography,
} from '@mui/material';

import PageBase from './PageBase';
import IntInput from '../IntInput';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { ZetkinLocationVisit } from 'features/canvass/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';

type Props = {
  active: boolean;
  assignment: ZetkinAreaAssignment;
  onBack: () => void;
  onClose: () => void;
  onLogVisit: (responses: ZetkinLocationVisit['responses']) => Promise<void>;
};

const LocationVisitPage: FC<Props> = ({
  active,
  assignment,
  onBack,
  onClose,
  onLogVisit,
}) => {
  const messages = useMessages(messageIds);
  const [submitting, setSubmitting] = useState(false);
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
            disabled={submitting}
            onClick={async () => {
              const metricIds = Object.keys(valuesByMetricId);
              setSubmitting(true);
              await onLogVisit(
                metricIds.map((metricId) => ({
                  metricId,
                  responseCounts: valuesByMetricId[metricId],
                }))
              );
              setSubmitting(false);
              onClose();
            }}
            startIcon={
              submitting ? (
                <CircularProgress color="secondary" size={24} />
              ) : null
            }
            variant="contained"
          >
            <Msg id={messageIds.visit.location.submitButtonLabel} />
          </Button>
        )
      }
      onBack={onBack}
      onClose={onClose}
      title={messages.visit.location.header()}
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
            const stepIsLast = index == assignment.metrics.length - 1;

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
                        <Msg
                          id={messageIds.visit.location.completed}
                          values={{ numHouseholds, numYes }}
                        />
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
                          label={messages.visit.location.yesInputLabel()}
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
                          label={messages.visit.location.noInputLabel()}
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
                      {!stepIsLast && (
                        <Button
                          onClick={() => setStep((current) => current + 1)}
                          variant="contained"
                        >
                          <Msg
                            id={messageIds.visit.location.proceedButtonLabel}
                          />
                        </Button>
                      )}
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
                        <Msg
                          id={messageIds.visit.location.average}
                          values={{ avgFixed, numHouseholds }}
                        />
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

export default LocationVisitPage;
