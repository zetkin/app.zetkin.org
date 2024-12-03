import { FC, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

import PageBase from './PageBase';
import Stepper from '../Stepper';
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
    }
  }, [active]);

  return (
    <PageBase
      actions={
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
        {assignment.metrics.map((metric) => {
          if (metric.kind == 'boolean') {
            const values = valuesByMetricId[metric.id] || [0, 0];
            return (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                gap={1}
              >
                <Typography color="secondary" variant="h5">
                  {metric.question}
                </Typography>
                {metric.description && (
                  <Typography variant="body2">{metric.description}</Typography>
                )}
                <Box maxWidth={200} mx="auto" width="70%">
                  <Stepper
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
                  <Stepper
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
              </Box>
            );
          } else if (metric.kind == 'scale5') {
            const values = valuesByMetricId[metric.id] || [0, 0, 0, 0, 0];
            return (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                gap={1}
              >
                <Typography color="secondary" variant="h5">
                  {metric.question}
                </Typography>
                {metric.description && (
                  <Typography variant="body2">{metric.description}</Typography>
                )}
                <Box maxWidth={200} mx="auto" width="70%">
                  {values.map((count, index) => {
                    const ratingValue = index + 1;
                    return (
                      <Stepper
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
            );
          }
        })}
      </Box>
    </PageBase>
  );
};

export default PlaceVisitPage;
