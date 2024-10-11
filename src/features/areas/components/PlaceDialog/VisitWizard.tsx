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
    <>
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
    </>
  );
};

type PreviousMessageProps = {
  onClick: () => void;
  question: string;
  response: string;
};

const PreviousMessage: FC<PreviousMessageProps> = ({
  onClick,
  question,
  response,
}) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      onClick={onClick}
      sx={{
        borderBottom: '1px solid lightGrey',
        padding: 1,
      }}
    >
      <Typography variant="body2">{`${question}: ${response}`}</Typography>
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
    <Box display="flex" flexDirection="column" height="100%">
      <Box>
        {responses.map((response, index) => {
          const metric = metrics.find(
            (metric) => metric.id == response.metricId
          );

          if (metric) {
            return (
              <PreviousMessage
                key={response.metricId}
                onClick={() => {
                  setStep(index);
                  setResponses(responses.slice(0, index));
                }}
                question={metric.question}
                response={response.response}
              />
            );
          }
        })}
      </Box>
      {currentMetric && (
        <Box display="flex" flexDirection="column" flexGrow={1}>
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
        </Box>
      )}
      {!currentMetric && (
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            justifyContent="center"
          >
            <Typography>
              Did something happen that you need an official to know?
            </Typography>
            <TextField
              onChange={(ev) => setNoteToOfficial(ev.target.value)}
              value={noteToOfficial}
            />
          </Box>
          <Button
            fullWidth
            onClick={() => {
              onLogVisit(noteToOfficial, responses);
              setNoteToOfficial('');
            }}
            variant="contained"
          >
            {noteToOfficial ? 'Save with note' : 'Save without note'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VisitWizard;
