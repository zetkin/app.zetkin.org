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
import { Undo } from '@mui/icons-material';
import { FC, useEffect, useState } from 'react';

import { ZetkinLocation, ZetkinMetric } from 'features/areaAssignments/types';
import PageBase from './PageBase';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import useHousehold from 'features/canvass/hooks/useHousehold';
import { MetricResponse } from 'features/canvass/types';

type HouseholdVisitPageProps = {
  householdId: number;
  location: ZetkinLocation;
  metrics: ZetkinMetric[];
  onBack: () => void;
  onLogVisit: (metrics: MetricResponse[]) => void;
};

const HouseholdVisitPage: FC<HouseholdVisitPageProps> = ({
  householdId,
  location,
  metrics,
  onBack,
  onLogVisit,
}) => {
  const messages = useMessages(messageIds);
  const household = useHousehold(
    location.organization_id,
    location.id,
    householdId
  );

  const [responseByMetricId, setResponseByMetricId] = useState<
    Record<number, MetricResponse>
  >({});
  const [step, setStep] = useState(0);

  useEffect(() => {
    setResponseByMetricId({});
    setStep(0);
  }, [household.id]);

  return (
    <PageBase
      actions={
        step >= metrics.length && (
          <Button
            fullWidth
            onClick={() => {
              const responses = Object.values(responseByMetricId).map(
                (response) => response
              );

              const filteredResponses = responses.filter(
                (response) => !!response.response
              );
              onLogVisit(filteredResponses);
            }}
            variant="contained"
          >
            <Msg id={messageIds.visit.household.submitReportButtonLabel} />
          </Button>
        )
      }
      color={household.color}
      onBack={onBack}
      title={messages.visit.household.header({
        householdTitle: household.title,
      })}
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
                onClick={() => {
                  if (index < step) {
                    const newResponses: Record<number, MetricResponse> = {};
                    metrics.forEach((m, i) => {
                      if (i < index && responseByMetricId[m.id]) {
                        newResponses[m.id] = responseByMetricId[m.id];
                      }
                    });
                    setResponseByMetricId(newResponses);
                  }

                  setStep(index);
                }}
                sx={{
                  '& .MuiStepLabel-vertical': {
                    alignItems: 'start',
                  },
                  '& span': {
                    overflow: 'hidden',
                  },
                  display: 'block',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
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
                    {!stepIsCurrent && index < step && <Undo />}
                  </Box>

                  {completed && step != index && (
                    <Typography variant="body2">
                      {responseByMetricId[metric.id].response}
                    </Typography>
                  )}
                </Box>
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

export default HouseholdVisitPage;
