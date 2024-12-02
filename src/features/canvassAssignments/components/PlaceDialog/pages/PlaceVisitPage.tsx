import { FC, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

import PageBase from './PageBase';
import Stepper from '../Stepper';
import { ZetkinCanvassAssignment } from 'features/canvassAssignments/types';

type Props = {
  assignment: ZetkinCanvassAssignment;
  onBack: () => void;
  onClose: () => void;
};

const PlaceVisitPage: FC<Props> = ({ assignment, onBack, onClose }) => {
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

  return (
    <PageBase
      actions={<Button variant="contained">Submit</Button>}
      onBack={onBack}
      onClose={onClose}
      title="Report visits here"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={4}
        height="100%"
        justifyContent="center"
      >
        <Stepper
          label="Total number of households"
          onChange={(value) => setNumHouseholds(value)}
          value={numHouseholds}
        />
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
                <Typography color="secondary">{metric.question}</Typography>
                <Box display="flex" gap={1}>
                  <Button
                    color={values[0] > 0 ? 'primary' : 'secondary'}
                    onClick={() =>
                      setValuesByMetricId((current) => ({
                        ...current,
                        [metric.id]: [values[0] + 1, values[1]],
                      }))
                    }
                    variant="outlined"
                  >
                    Yes ({values[0]})
                  </Button>
                  <Button
                    color={values[1] > 0 ? 'primary' : 'secondary'}
                    onClick={() =>
                      setValuesByMetricId((current) => ({
                        ...current,
                        [metric.id]: [values[0], values[1] + 1],
                      }))
                    }
                    variant="outlined"
                  >
                    No ({values[1]})
                  </Button>
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
                <Typography color="secondary">{metric.question}</Typography>
                <Box display="flex" gap={1}>
                  {values.map((count, index) => (
                    <Button
                      key={index}
                      color={count > 0 ? 'primary' : 'secondary'}
                      onClick={() =>
                        setValuesByMetricId((current) => ({
                          ...current,
                          [metric.id]: [
                            ...values.slice(0, index),
                            values[index] + 1,
                            ...values.slice(index + 1),
                          ],
                        }))
                      }
                      variant="outlined"
                    >
                      {index} ({count})
                    </Button>
                  ))}
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
