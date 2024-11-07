import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import {
  Household,
  Visit,
  ZetkinCanvassAssignment,
  ZetkinMetric,
} from 'features/canvassAssignments/types';
import PageBase from './PageBase';

const Question: FC<{
  metric: ZetkinMetric;
  onChange: (newValue: string | null) => void;
  value?: string;
}> = ({ onChange, metric, value }) => {
  const options =
    metric.kind == 'boolean'
      ? [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]
      : [
          { label: 1, value: '1' },
          { label: 2, value: '2' },
          { label: 3, value: '3' },
          { label: 4, value: '4' },
          { label: 5, value: '5' },
        ];

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
        <Typography>{metric.question}</Typography>
        <Typography variant="body2">{metric.description}</Typography>
      </Box>
      {!metric.definesDone && (
        <Button onClick={() => onChange('')}>Skip this question</Button>
      )}
      <ToggleButtonGroup
        exclusive
        fullWidth
        onChange={(ev, newValue) => {
          onChange(newValue);
        }}
        value={value}
      >
        {options.map((option) => (
          <ToggleButton key={option.value.toString()} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
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
      {!response && (
        <Box display="flex" gap={1}>
          <Typography variant="body2">{`${question}:`}</Typography>
          <Typography fontStyle="italic" variant="body2">
            {'Skipped'}
          </Typography>
        </Box>
      )}
      {response && (
        <Typography variant="body2">{`${question}: ${response}`}</Typography>
      )}
    </Box>
  );
};

type VisitWizardProps = {
  household: Household;
  metrics: ZetkinCanvassAssignment['metrics'];
  onBack: () => void;
  onLogVisit: (
    responses: Visit['responses'],
    noteToOfficial: Visit['noteToOfficial']
  ) => void;
};

const VisitWizard: FC<VisitWizardProps> = ({
  household,
  metrics,
  onBack,
  onLogVisit,
}) => {
  const [responses, setResponses] = useState<Visit['responses']>([]);
  const [step, setStep] = useState(0);
  const [noteToOfficial, setNoteToOfficial] = useState('');

  return (
    <PageBase
      onBack={onBack}
      title={`${household.title || 'Unititled household'}: Log visit`}
    >
      {metrics.map((metric, index) => {
        if (index < step) {
          return (
            <>
              <PreviousMessage
                key={metric.id}
                onClick={() => {
                  setStep(index);
                  setResponses(responses.slice(0, index + 1));
                }}
                question={metric.question}
                response={responses[index].response}
              />
              {index == metrics.length - 1 && (
                <Box
                  display="flex"
                  flexDirection="column"
                  flexGrow={1}
                  justifyContent="flex-end"
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    flexGrow={1}
                    justifyContent="center"
                  >
                    <Typography>
                      Did anything happen that an official needs to know about?
                    </Typography>
                    <TextField
                      onChange={(ev) => setNoteToOfficial(ev.target.value)}
                      value={noteToOfficial}
                    />
                  </Box>
                  <Button
                    fullWidth
                    onClick={() => {
                      const filteredResponses = responses.filter(
                        (response) => !!response.response
                      );
                      onLogVisit(filteredResponses, noteToOfficial);
                    }}
                    variant="contained"
                  >
                    {noteToOfficial ? 'Save with note' : 'Save without note'}
                  </Button>
                </Box>
              )}
            </>
          );
        }

        if (index == step) {
          return (
            <Box display="flex" flexDirection="column" flexGrow={1}>
              <Question
                key={metric.id}
                metric={metric}
                onChange={(newValue) => {
                  if (newValue == null) {
                    //User is returning and selects the same response
                    setStep(step + 1);
                  } else {
                    if (responses[index]) {
                      //User is returning and selects new response
                      setResponses([
                        ...responses.slice(
                          0,
                          responses.indexOf(responses[index])
                        ),
                        {
                          ...responses[index],
                          response: newValue.toString(),
                        },
                      ]);
                    } else {
                      //User is responding to this question for the first time
                      setResponses([
                        ...responses,
                        {
                          metricId: metric.id,
                          response: newValue.toString(),
                        },
                      ]);
                    }
                    setStep(step + 1);
                  }
                }}
                value={responses[index]?.response}
              />
            </Box>
          );
        }

        if (index > step) {
          return null;
        }
      })}
    </PageBase>
  );
};

export default VisitWizard;
