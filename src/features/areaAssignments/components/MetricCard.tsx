import { Close, LinearScale, SwitchLeft } from '@mui/icons-material';
import React, { FC, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinMetric } from '../types';

type MetricCardProps = {
  metric: ZetkinMetric;
  onClose: () => void;
  onSave: (metric: ZetkinMetric) => void;
};

const MetricCard: FC<MetricCardProps> = ({ metric, onClose, onSave }) => {
  const [question, setQuestion] = useState<string>(metric.question || '');
  const [description, setDescription] = useState<string>(
    metric.description || ''
  );
  const [definesDone, setDefinesDone] = useState<boolean>(
    metric.definesDone || false
  );

  useEffect(() => {
    setQuestion(metric.question || '');
    setDescription(metric.description || '');
    setDefinesDone(metric.definesDone || false);
  }, [metric]);

  return (
    <Card sx={{ minWidth: 400 }}>
      <CardContent>
        <Box alignItems="center" display="flex" justifyContent="space-between">
          {metric.kind === 'boolean' ? (
            <Typography alignItems="center" display="flex" variant="h6">
              <SwitchLeft color="secondary" sx={{ marginRight: 1 }} />
              <Msg id={messageIds.report.metricCard.choice} />
            </Typography>
          ) : (
            <Typography alignItems="center" display="flex" variant="h6">
              <LinearScale color="secondary" sx={{ marginRight: 1 }} />
              <Msg id={messageIds.report.metricCard.scale} />
            </Typography>
          )}

          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          {metric.kind == 'scale5' && (
            <Typography color="secondary" fontStyle="italic" mb={1}>
              <Msg id={messageIds.report.metricCard.ratingDescription} />
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
          <Box display="flex" gap={1} justifyContent="right" width="100%">
            <Button
              onClick={() => {
                onSave({
                  definesDone,
                  description,
                  id: metric.id || '',
                  kind: metric.kind,
                  question,
                });
              }}
              variant="contained"
            >
              <Msg id={messageIds.report.metricCard.save} />
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
