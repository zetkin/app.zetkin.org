import { Close } from '@mui/icons-material';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Checkbox,
  Button,
} from '@mui/material';

import { ZetkinMetric } from 'features/areas/types';

const MetricCard = ({
  metric,
  onClose,
  onDelete,
  onSave,
}: {
  metric: ZetkinMetric;
  onClose: () => void;
  onDelete: () => void;
  onSave: (metric: ZetkinMetric) => void;
}) => {
  const [question, setQuestion] = useState<string>(metric.question || '');
  const [description, setDescription] = useState<string>(
    metric.description || ''
  );
  const [definesDone, setDefinesDone] = useState<boolean>(
    metric.definesDone || false
  );

  const isEditing = !!metric?.id;

  return (
    <Card sx={{ marginTop: 2 }}>
      <CardContent>
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Typography gutterBottom variant="h5">
            {metric.kind === 'boolean' ? 'Yes/No Question' : 'Rating Question'}
          </Typography>
          <Close onClick={onClose} />
        </Box>

        {metric.kind === 'boolean' && (
          <Box display="flex" flexDirection="column">
            <TextField
              label="Title"
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
            <Box alignItems="center" display="flex">
              <Typography>
                Answering this question defines the goal of the assignment?
              </Typography>
              <Checkbox
                checked={definesDone}
                onChange={(ev) => setDefinesDone(ev.target.checked)}
              />
            </Box>
            <Button
              onClick={() => {
                onSave({
                  definesDone,
                  description,
                  id: metric.id || '',
                  kind: 'boolean',
                  question,
                });
              }}
            >
              {isEditing ? 'Update' : 'Save'}
            </Button>
            {isEditing && (
              <Button color="error" onClick={onDelete}>
                Delete
              </Button>
            )}
          </Box>
        )}
        {metric.kind === 'scale5' && (
          <Box display="flex" flexDirection="column">
            <TextField
              label="Title"
              onChange={(ev) => setQuestion(ev.target.value)}
              sx={{ marginBottom: 1, marginTop: 2 }}
              value={question}
              variant="outlined"
            />
            <TextField
              label="Description"
              onChange={(ev) => setDescription(ev.target.value)}
              sx={{ marginBottom: 4, marginTop: 1 }}
              value={description}
              variant="outlined"
            />
            <Typography fontStyle="italic" mb={1}>
              Users will rate using a 1 to 5 scale system
            </Typography>

            <Button
              onClick={() => {
                onSave({
                  definesDone,
                  description,
                  id: metric.id || '',
                  kind: 'scale5',
                  question,
                });
              }}
            >
              {isEditing ? 'Update' : 'Save'}
            </Button>
            {isEditing && (
              <Button color="error" onClick={onDelete}>
                Delete
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
