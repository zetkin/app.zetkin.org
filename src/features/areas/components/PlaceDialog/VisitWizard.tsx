import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import { Visit } from '../../types';

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

  const showPreviousButton = step && step != 1;

  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="center"
    >
      {showPreviousButton && (
        <Button
          onClick={() => {
            if (step == 2) {
              onStepChange(1);
              setMissionAccomplished(null);
            } else if (
              step == 3 &&
              (doorWasOpened == true || doorWasOpened == null)
            ) {
              onStepChange(2);
              setNoteToOfficial(null);
            } else {
              //User is on step 3 because the door was not opened
              onStepChange(1);
              setNoteToOfficial(null);
            }
          }}
        >
          Previous
        </Button>
      )}
      <>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
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
          <ToggleButtonGroup
            exclusive
            fullWidth
            onChange={(ev, value) => {
              if (value != null) {
                setDoorWasOpened(value);

                if (value) {
                  onStepChange(2);
                } else {
                  onStepChange(3);
                }
              }

              //If user has come back and clicks the same option again
              if (typeof doorWasOpened == 'boolean' && value == null) {
                if (doorWasOpened) {
                  onStepChange(2);
                } else {
                  onStepChange(3);
                }
              }
            }}
            value={doorWasOpened}
          >
            <ToggleButton value={true}>Yes</ToggleButton>
            <ToggleButton value={false}>No</ToggleButton>
          </ToggleButtonGroup>
        )}
        {step == 2 && (
          <ToggleButtonGroup
            exclusive
            fullWidth
            onChange={(ev, value) => {
              if (value != null) {
                setMissionAccomplished(value);
                onStepChange(3);
              }

              //If user has come back and clicks the same option again
              if (typeof missionAccomplished == 'boolean' && value == null) {
                onStepChange(3);
              }
            }}
            value={missionAccomplished}
          >
            <ToggleButton value={true}>Yes</ToggleButton>
            <ToggleButton value={false}>No</ToggleButton>
          </ToggleButtonGroup>
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
