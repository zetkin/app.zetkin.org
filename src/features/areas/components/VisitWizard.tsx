import { Box, Button, ButtonGroup, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';

import { Visit } from '../types';

export type WizardStep = 1 | 2 | 3;

type Report = Pick<
  Visit,
  'missionAccomplished' | 'doorWasOpened' | 'noteToOfficial'
>;

type VisitWizardProps = {
  onExit: () => void;
  onRecordVisit: (report: Report) => void;
  onStepChange: (newStep: WizardStep | null) => void;
  step: WizardStep | null;
};

const VisitWizard: FC<VisitWizardProps> = ({
  onExit,
  onRecordVisit,
  onStepChange,
  step,
}) => {
  const [noteToOfficial, setNoteToOfficial] = useState<string | null>(null);
  const [missionAccomplished, setMissionAccomplished] = useState<
    boolean | null
  >(null);
  const [doorWasOpened, setDoorWasOpened] = useState<boolean | null>(null);

  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="center"
    >
      <>
        <Box
          alignItems="center"
          display="flex"
          flexGrow={1}
          justifyContent="center"
        >
          {step == 1 && <Typography>Did they open the door?</Typography>}
          {step == 2 && <Typography>Did you have a conversation?</Typography>}
          {step == 3 && (
            <Box display="flex" flexDirection="column">
              <Typography>
                Did something happen that you need to report to an official?
              </Typography>
              <TextField
                onChange={(ev) => setNoteToOfficial(ev.target.value)}
                value={noteToOfficial}
              />
            </Box>
          )}
        </Box>
        {step == 1 && (
          <ButtonGroup fullWidth>
            <Button
              onClick={() => {
                setDoorWasOpened(true);
                onStepChange(2);
              }}
            >
              YES
            </Button>
            <Button
              onClick={() => {
                setDoorWasOpened(false);
                onStepChange(3);
              }}
            >
              NO
            </Button>
          </ButtonGroup>
        )}
        {step == 2 && (
          <ButtonGroup fullWidth>
            <Button
              onClick={() => {
                setMissionAccomplished(true);
                onStepChange(3);
              }}
            >
              YES
            </Button>
            <Button
              onClick={() => {
                setMissionAccomplished(false);
                onStepChange(3);
              }}
            >
              NO
            </Button>
          </ButtonGroup>
        )}
        {step == 3 && (
          <Button
            fullWidth
            onClick={() => {
              onRecordVisit({
                doorWasOpened: !!doorWasOpened,
                missionAccomplished: !!missionAccomplished,
                noteToOfficial,
              });
              onExit();
              setNoteToOfficial(null);
              setMissionAccomplished(null);
              setDoorWasOpened(null);
              onStepChange(null);
            }}
          >
            {noteToOfficial ? 'Save with note' : 'Save without note'}
          </Button>
        )}
      </>
    </Box>
  );
};

export default VisitWizard;
