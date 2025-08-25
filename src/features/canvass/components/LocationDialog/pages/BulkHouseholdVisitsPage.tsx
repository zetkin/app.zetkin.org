import {
  Box,
  Button,
  CircularProgress,
  Step,
  StepButton,
  StepContent,
  Stepper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { ZetkinMetric } from 'features/areaAssignments/types';
import PageBase from './PageBase';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import { MetricResponse } from 'features/canvass/types';

type BulkHouseholdVisitsPageProps = {
  metrics: ZetkinMetric[];
  onBack: () => void;
  onLogVisit: (metrics: MetricResponse[]) => void;
  selectedHouseholsdIds: number[];
};

const BulkHouseholdVisitsPage: FC<BulkHouseholdVisitsPageProps> = ({
  selectedHouseholsdIds,
  metrics,
  onBack,
  onLogVisit,
}) => {
  const messages = useMessages(messageIds);
  const [responseByMetricId, setResponseByMetricId] = useState<
    Record<number, MetricResponse>
  >({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResponseByMetricId({});
    setStep(0);
  }, []);

  return (
    <PageBase
      actions={
        step >= metrics.length && (
          <Button
            disabled={loading}
            fullWidth
            onClick={async () => {
              setLoading(true);
              const responses = Object.values(responseByMetricId).map(
                (response) => response
              );

              const filteredResponses = responses.filter(
                (response) => !!response.response
              );
              await onLogVisit(filteredResponses);
              setLoading(false);
            }}
            startIcon={
              loading ? (
                <CircularProgress color="secondary" size="20px" />
              ) : null
            }
            variant="contained"
          >
            {`Submit report for  ${selectedHouseholsdIds.length} households`}
          </Button>
        )
      }
      onBack={onBack}
      title={`Selected ${selectedHouseholsdIds.length} households`}
    >
      <Stepper activeStep={step} orientation="vertical">
        {metrics.map((metric, index) => {
          const options =
            metric.type == 'bool'
              ? [
                  {
                    label: messages.visit.household.yesButtonLabel(),
                    value: 'yes',
                  },
                  {
                    label: messages.visit.household.noButtonLabel(),
                    value: 'no',
                  },
                ]
              : [
                  { label: 1, value: 1 },
                  { label: 2, value: 2 },
                  { label: 3, value: 3 },
                  { label: 4, value: 4 },
                  { label: 5, value: 5 },
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
                    {responseByMetricId[metric.id].response}
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
                    onChange={(ev, newValue: MetricResponse['response']) => {
                      setResponseByMetricId({
                        ...responseByMetricId,
                        [metric.id]: {
                          metric_id: metric.id,
                          response: newValue,
                        },
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
                  {!metric.defines_success && (
                    <Button onClick={() => setStep(index + 1)}>
                      <Msg id={messageIds.visit.household.skipButtonLabel} />
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

export default BulkHouseholdVisitsPage;
