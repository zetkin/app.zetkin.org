import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import { Visit, ZetkinCanvassAssignment } from 'features/areas/types';

const BooleanQuestion: FC<{
  description: string;
  onChange: (newValue: boolean) => void;
  question: string;
}> = ({ description, onChange, question }) => {
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        flexGrow={1}
        gap={1}
        justifyContent="center"
      >
        <Typography>{question}</Typography>
        <Typography variant="body2">{description}</Typography>
      </Box>
      <ToggleButtonGroup
        exclusive
        fullWidth
        onChange={(ev, newValue) => {
          if (typeof newValue == 'boolean') {
            onChange(newValue);
          }
        }}
      >
        <ToggleButton value={true}>Yes</ToggleButton>
        <ToggleButton value={false}>No</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

type VisitWizardProps = {
  metrics: ZetkinCanvassAssignment['metrics'];
  onLogVisit: (noteToOfficial: string, responses: Visit['responses']) => void;
};

const VisitWizard: FC<VisitWizardProps> = ({ metrics, onLogVisit }) => {
  const [responses, setResponses] = useState<Visit['responses']>([]);
  const [step, setStep] = useState(0);
  const [noteToOfficial, setNoteToOfficial] = useState('');

  const currentMetric = metrics[step] ? metrics[step] : null;
  return (
    <Box>
      {currentMetric && (
        <BooleanQuestion
          description={currentMetric.description}
          onChange={(newValue) => {
            setResponses([
              ...responses,
              { metricId: currentMetric.id, response: newValue.toString() },
            ]);
            setStep(step + 1);
          }}
          question={currentMetric.question}
        />
      )}
      {!currentMetric && (
        <Box>
          <Typography>
            Did something happen that you need an official to know?
          </Typography>
          <TextField
            onChange={(ev) => setNoteToOfficial(ev.target.value)}
            value={noteToOfficial}
          />
          <Button
            fullWidth
            onClick={() => {
              onLogVisit(noteToOfficial, responses);
              setNoteToOfficial('');
            }}
          >
            {noteToOfficial ? 'Save with note' : 'Save without note'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VisitWizard;
