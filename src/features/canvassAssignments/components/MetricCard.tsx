import { Close } from '@mui/icons-material';
import React, { FC, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Checkbox,
  Button,
  IconButton,
} from '@mui/material';

import { ZetkinMetric } from '../types';

type MetricCardProps = {
  hasDefinedDone: boolean;
  isOnlyQuestion: boolean;
  metric: ZetkinMetric;
  onClose: () => void;
  onDelete: (target: EventTarget & HTMLButtonElement) => void;
  onSave: (metric: ZetkinMetric) => void;
};

const MetricCard: FC<MetricCardProps> = ({
  hasDefinedDone,
  isOnlyQuestion,
  metric,
  onClose,
  onDelete,
  onSave,
}) => {
  const [question, setQuestion] = useState<string>(metric.question || '');
  const [description, setDescription] = useState<string>(
    metric.description || ''
  );
  const [definesDone, setDefinesDone] = useState<boolean>(
    metric.definesDone || false
  );

  const isEditing = !!metric?._id;

  useEffect(() => {
    setQuestion(metric.question || '');
    setDescription(metric.description || '');
    setDefinesDone(metric.definesDone || false);
  }, [metric]);

  const showDefinesDoneCheckbox =
    metric.kind == 'boolean' && (metric.definesDone || !hasDefinedDone);

  return (
    <Card sx={{ marginTop: 2 }}>
      <CardContent>
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Typography gutterBottom variant="h5">
            {metric.kind === 'boolean' ? 'Yes/No Question' : 'Scale Question'}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          {metric.kind == 'scale5' && (
            <Typography fontStyle="italic" mb={1}>
              The canvasser will respond by giving a rating from 1 to 5
            </Typography>
          )}
          <TextField
            label="Question"
            onChange={(ev) => setQuestion(ev.target.value)}
            sx={{ marginBottom: 2, marginTop: 2 }}
            value={question}
            variant="outlined"
          />
          <TextField
            label="Description"
            onChange={(ev) => setDescription(ev.target.value)}
            sx={{ marginBottom: 2 }}
            value={description}
            variant="outlined"
          />
          {showDefinesDoneCheckbox && (
            <Box alignItems="center" display="flex">
              <Checkbox
                checked={definesDone}
                disabled={definesDone && isOnlyQuestion}
                onChange={(ev) => setDefinesDone(ev.target.checked)}
              />
              <Typography>
                The answer to this question defines if the mission was
                successful
              </Typography>
            </Box>
          )}
          <Box display="flex" gap={1} justifyContent="center" width="100%">
            {isEditing && !isOnlyQuestion && (
              <Button
                color="error"
                onClick={(ev) => onDelete(ev.currentTarget)}
                variant="outlined"
              >
                Delete
              </Button>
            )}
            <Button
              onClick={() => {
                onSave({
                  _id: metric._id || '',
                  definesDone,
                  description,
                  kind: metric.kind,
                  question,
                });
              }}
              variant="outlined"
            >
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
